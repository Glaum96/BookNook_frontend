<script lang="ts">
	import { onMount } from 'svelte'
	import type { Booking } from '../../types/Booking'
	export let fetchBookingsFunction: () => Promise<Booking[]>
	import './mineBookinger.css'
	import { getDate, getTime } from '$lib/functions/dateFunctions'

	let bookings: Booking[] = []

	// Fetch bookings from the backend endpoint
	async function fetchBookings() {
		try {
			const data = await fetchBookingsFunction()
			bookings = data
		} catch (error) {
			console.log(error)
		}
	}

	async function handleDeleteBooking(bookingId: string) {
		try {
			const response = await fetch(`http://localhost:9090/api/deleteBooking/${bookingId}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				await fetchBookings() // Fetch updated bookings
			} else {
				console.log('Failed to delete booking')
			}
		} catch (error) {
			console.log(error)
		}
	}

	// Fetch bookings when the component is mounted
	onMount(() => {
		fetchBookings()
	})
</script>

<div class="booking-cards">
	<h3 class="header">Dine bookinger</h3>

	{#each bookings as booking}
		<div class="booking-card">
			<p><strong>Dato: </strong> {getDate(booking.startTime)}</p>
			<p>
				<strong>Tidsperiode: </strong>
				{getTime(booking.startTime)} - {getTime(booking.endTime)}
			</p>
			<p><strong>Ansvarlig: </strong> {booking.responsibleName}</p>
			<p><strong>Telefonnummer: </strong> {booking.responsibleNumber}</p>
			<button class="delete-button" on:click={() => handleDeleteBooking(booking.id)}>Slett booking</button>
		</div>
	{/each}
</div>
