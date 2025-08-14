<script lang="ts">
	import type { Booking } from '../../../types/Booking'
	import './myBookings.css'
	import { getDate, getTime } from '$lib/functions/dateFunctions'
	import { fetchMyBookings, deleteBooking } from '$lib/api/bookings'
	import { includePastBookings, setIncludePastBookings } from '../../../stores/includePastBookings';

	export let userId: string
	export let bookings: Booking[]

	const handleDeleteBooking = async (bookingId?: string) => {
		if (!bookingId) return

		await deleteBooking(bookingId)
		bookings = await fetchMyBookings(userId, $includePastBookings)
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
			<img src="/include_past.png" alt="Inkluder tidligere bookinger" />
			<input
			type="checkbox"
			id="includePastBookingsCheckBox"
			bind:checked={$includePastBookings}
			on:change={handleIncludePastBookingsChange}
			/>
		</div>
	</div>

	{#each bookings ?? [] as booking (booking.id)}
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
