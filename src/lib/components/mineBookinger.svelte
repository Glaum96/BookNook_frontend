<script lang="ts">
	import type { Booking } from '../../types/Booking'
	import './mineBookinger.css'
	import { getDate, getTime } from '$lib/functions/dateFunctions'
	import { fetchMyBookings, deleteBooking } from '$lib/api/bookings'

	export let userId: string
	export let bookings: Booking[]

	const handleDeleteBooking = async (bookingId?: string) => {
		if (!bookingId) return

		await deleteBooking(bookingId)
		bookings = await fetchMyBookings(userId)
	}
</script>

<div class="booking-cards">
	<h3 class="header">Dine bookinger</h3>

	{#each bookings as booking (booking.id)}
		<div class="booking-card">
			<p><strong>Dato: </strong> {getDate(booking.startTime)}</p>
			<p><strong>Tidsperiode: </strong> {getTime(booking.startTime)} - {getTime(booking.endTime)}</p>
			<p><strong>Ansvarlig: </strong> {booking.responsibleName}</p>
			<p><strong>Telefonnummer: </strong> {booking.responsibleNumber}</p>
			<button class="delete-button" on:click={() => handleDeleteBooking(booking.id)}>Slett booking</button>
		</div>
		{:else}
		<p class="no-bookings">Ingen bookinger funnet.</p>
	{/each}
</div>
