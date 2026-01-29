<script lang="ts">
	import { base } from '$app/paths'
	import type { Booking } from '../../../types/Booking'
	import './myBookings.css'
	import { getDate, getTime } from '$lib/functions/dateFunctions'
	import { fetchMyBookings, deleteBooking } from '$lib/api/bookings'
	import { includePastBookings, setIncludePastBookings } from '../../../stores/includePastBookings'
	import { isLoading } from '../../../stores/loading'
	import Spinner from '../spinner/Spinner.svelte'

	export let userId: string
	export let bookings: Booking[]

	const myBookingsLoading = isLoading('myBookings')
	const deleteBookingLoading = isLoading('deleteBooking')
	let deletingBookingId: string | null = null

	const handleDeleteBooking = async (bookingId?: string) => {
		if (!bookingId) return

		deletingBookingId = bookingId
		await deleteBooking(bookingId)
		bookings = await fetchMyBookings(userId, $includePastBookings)
		deletingBookingId = null
	}

	const handleIncludePastBookingsChange = async (event: Event) => {
		const target = event.target as HTMLInputElement
		setIncludePastBookings(target.checked)
		bookings = await fetchMyBookings(userId, $includePastBookings)
	}
</script>

<div class="booking-cards">
	<div class="my-bookings-header">
		<h3 class="header">Dine bookinger</h3>
		<div class="past-bookings">
			<img src="{base}/include_past.png" alt="Inkluder tidligere bookinger" />
			<input
				type="checkbox"
				id="includePastBookingsCheckBox"
				bind:checked={$includePastBookings}
				on:change={handleIncludePastBookingsChange}
				disabled={$myBookingsLoading}
			/>
		</div>
	</div>

	{#if $myBookingsLoading && !deletingBookingId}
		<div class="loading-container">
			<Spinner size="medium" label="Laster bookinger..." />
		</div>
	{:else}
		{#each bookings ?? [] as booking (booking.id)}
			<div class="booking-card">
				<p><strong>Dato: </strong> {getDate(booking.startTime)}</p>
				<p><strong>Tidsperiode: </strong> {getTime(booking.startTime)} - {getTime(booking.endTime)}</p>
				<p><strong>Ansvarlig: </strong> {booking.responsibleName}</p>
				<p><strong>Telefonnummer: </strong> {booking.responsibleNumber}</p>
				<button
					class="delete-button"
					on:click={() => handleDeleteBooking(booking.id)}
					disabled={$deleteBookingLoading && deletingBookingId === booking.id}
				>
					{#if $deleteBookingLoading && deletingBookingId === booking.id}
						<Spinner size="small" inline />
					{:else}
						Slett booking
					{/if}
				</button>
			</div>
		{:else}
			<p class="no-bookings">Ingen bookinger funnet.</p>
		{/each}
	{/if}
</div>

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}
</style>
