
<script>
	import { onMount } from 'svelte';

	let startTime = new Date().toISOString().slice(0, 16);
	let endTime = new Date().toISOString().slice(0, 16);
	let dateVariable = '';
	let userId = "1001";
	let responsibleName = "";
	let responsibleNumber ="";
	let bookings = [];

	function combineDateAndTime(dateVariable, startTime, endTime) {
		const date = new Date(dateVariable);
		const [startHours, startMinutes] = startTime.split(':');
		const [endHours, endMinutes] = endTime.split(':');

		const startDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes);
		const endDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes);

		return {
			startDateTime: startDateTime.toISOString(),
			endDateTime: endDateTime.toISOString()
		};
	}

	async function fetchBookings() {
		try {
			const response = await fetch('http://localhost:9090/api/bookings');
			const data = await response.json();
			bookings = data;
		} catch (error) {
			console.log(error);
		}
	}

	async function handleSubmit() {
		const { startDateTime, endDateTime } = combineDateAndTime(dateVariable, startTime, endTime);

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
				await fetchBookings(); // Fetch updated bookings
			} else {
				console.log('Failed to add booking');
			}
		} catch (error) {
			console.log(error);
		}
	}

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
		<h1>Dine bookinger</h1>
		<ul>
			{#each bookings as booking}
				<li>

					<p><strong>Start-tidspunkt:</strong> {booking.startTime}</p>
					<p><strong>Slutt-tidspunkt:</strong> {booking.endTime}</p>
					<p><strong>BrukerId:</strong> {booking.responsibleName}</p>
				</li>
			{/each}
		</ul>
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

    section.booking, section.your-bookings {
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

    section.booking h1, section.your-bookings h1 {
        align-self: flex-start; /* Align h1 to the left */
        font-size: 2rem; /* Example font size */
        margin: 0; /* Remove default margin */
    }

    @media (max-width: 768px) {
        .container {
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
        }
        section.booking, section.your-bookings {
            flex: 0 0 100%; /* Full width on smaller screens */
        }
    }
</style>