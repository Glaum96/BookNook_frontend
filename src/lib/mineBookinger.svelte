<script lang="ts">
	import { onMount } from 'svelte';
	export let fetchBookingsFunction: () => Promise<Booking[]>;

	type Booking = {
		id: string;
		startTime: string;
		endTime: string;
		responsibleName: string;
	};

	let bookings: Booking[] = [];

	// Fetch bookings from the backend endpoint
	async function fetchBookings() {
		try {
			const data = await fetchBookingsFunction();
			bookings = data;
		} catch (error) {
			console.log(error);
		}
	}

	async function handleDeleteBooking(bookingId: string) {
		try {
			const response = await fetch(`http://localhost:9090/api/deleteBooking/${bookingId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await fetchBookings(); // Fetch updated bookings
			} else {
				console.log('Failed to delete booking');
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Fetch bookings when the component is mounted
	onMount(() => {
		fetchBookings();
	});
</script>

<!-- Display the list of bookings -->
<ul class="booking-list">
	<h1>Dine bookinger</h1>
	<ul>
		{#each bookings as booking}
			<li>
				<p><strong>Start-tidspunkt:</strong> {booking.startTime}</p>
				<p><strong>Slutt-tidspunkt:</strong> {booking.endTime}</p>
				<p><strong>BrukerId:</strong> {booking.responsibleName}</p>
				<button on:click={() => handleDeleteBooking(booking.id)}>Delete</button>
			</li>
		{/each}
	</ul>
</ul>

<style>
	/* Add your styles here */
	.booking-list {
		list-style-type: none;
		padding: 0;
	}

	.booking-item {
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}
</style>
