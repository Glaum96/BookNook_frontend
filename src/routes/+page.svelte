<script lang="ts">
	import MineBookinger from '$lib/mineBookinger.svelte';
	import { onMount } from 'svelte';

	let startTime = new Date().toISOString().slice(0, 16);
	let endTime = new Date().toISOString().slice(0, 16);
	let dateVariable = '';
	let userId = '1001';
	let responsibleName = '';
	let responsibleNumber = '';

	function combineDateAndTime(dateVariable: string, startTime: string, endTime: string) {
		const date = new Date(dateVariable);
		const [startHours, startMinutes] = startTime.split(':');
		const [endHours, endMinutes] = endTime.split(':');

		const startDateTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			Number(startHours),
			Number(startMinutes)
		);
		const endDateTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			Number(endHours),
			Number(endMinutes)
		);

		return {
			startDateTime: startDateTime.toISOString(),
			endDateTime: endDateTime.toISOString()
		};
	}

	async function fetchBookings() {
		try {
			const response = await fetch('http://localhost:9090/api/myBookings', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'User-Id': userId
				}
			});
			return await response.json();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleSubmit() {
		const { startDateTime, endDateTime } = combineDateAndTime(dateVariable, startTime, endTime);

		console.log(
			startDateTime,
			endDateTime,
			dateVariable,
			userId,
			responsibleName,
			responsibleNumber
		);

		try {
			const response = await fetch('http://localhost:9090/api/postBooking', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					startTime: startDateTime,
					endTime: endDateTime,
					date: dateVariable,
					userId: userId,
					responsibleName: responsibleName,
					responsibleNumber: responsibleNumber
				})
			});

			if (response.ok) {
				await fetchBookings();
				resetForm();
			} else {
				console.log('Failed to add booking');
			}
		} catch (error) {
			console.log(error);
		}
	}

	const resetForm = () => {
		startTime = new Date().toISOString().slice(0, 16);
		endTime = new Date().toISOString().slice(0, 16);
		dateVariable = '';
		responsibleName = '';
		responsibleNumber = '';
	};

	onMount(fetchBookings);
</script>

<svelte:head>
	<title>Takterrassen</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="container">
	<section class="booking">
		<h1>Book takterassen</h1>
		<form on:submit|preventDefault={handleSubmit}>
			<p>Dato:</p>
			<input type="date" bind:value={dateVariable} placeholder="Dato" />
			<p>Start-tidspunkt:</p>
			<input type="time" bind:value={startTime} placeholder="Start-tidspunkt" />
			<p>Slutt-tidspunkt:</p>
			<input type="time" bind:value={endTime} placeholder="Slutt-tidspunkt" />
			<p>Ansvarlig-navn:</p>
			<input type="text" bind:value={responsibleName} placeholder="Navn" />
			<p>Ansvarlig-telefonnummer:</p>
			<input type="text" bind:value={responsibleNumber} placeholder="Nummer" />
			<br />
			<button type="submit">Submit</button>
		</form>
	</section>
	<section class="your-bookings">
		<MineBookinger fetchBookingsFunction={fetchBookings} />
	</section>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		gap: 2rem; /* Adjust the gap as needed */
		padding: 1rem;
		flex-wrap: nowrap; /* Prevent wrapping */
	}

	section.booking,
	section.your-bookings {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: white;
		border-radius: 10px;
		padding: 1rem;
	}

	section.booking {
		flex: 0 0 70%; /* 70% of the container */
	}

	section.your-bookings {
		flex: 0 0 30%; /* 30% of the container */
	}

	section.booking h1,
	section.your-bookings h1 {
		align-self: flex-start; /* Align h1 to the left */
		font-size: 2rem; /* Example font size */
		margin: 0; /* Remove default margin */
	}

	@media (max-width: 768px) {
		.container {
			flex-wrap: wrap; /* Allow wrapping on smaller screens */
		}
		section.booking,
		section.your-bookings {
			flex: 0 0 100%; /* Full width on smaller screens */
		}
	}
</style>
