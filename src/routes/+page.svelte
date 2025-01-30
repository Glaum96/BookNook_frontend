<script lang="ts">
	import MineBookinger from '$lib/components/mineBookinger.svelte';
	import { onMount } from 'svelte';
	import { checkAuth, isAuthenticated } from '../stores/auth';
	import { goto } from '$app/navigation';
	import './page.css';
	import { fetchMyBookings, postBooking } from '$lib/api/bookings';
	import type { Booking } from '../types/Booking';

	onMount(() => {
		checkAuth();
		$: if (!$isAuthenticated) {
			goto('/login');
		}
	});

	let bookings: Booking[] = [];

	let startTime = new Date().toISOString().slice(0, 16);
	let endTime = new Date().toISOString().slice(0, 16);
	let dateVariable = '';
	let userId = '1001';
	let responsibleName = '';
	let responsibleNumber = '';


	onMount(async () => {
		bookings = await fetchMyBookings(userId);
	});

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

	async function handleSubmit() {
		const { startDateTime, endDateTime } = combineDateAndTime(dateVariable, startTime, endTime);
		const newBooking = {
			startTime: startDateTime,
			endTime: endDateTime,
			date: dateVariable,
			userId: userId,
			responsibleName: responsibleName,
			responsibleNumber: responsibleNumber
		}

	 	await postBooking(newBooking);
		bookings = await fetchMyBookings('1001');
		resetForm();
	}

	const resetForm = () => {
		startTime = new Date().toISOString().slice(0, 16);
		endTime = new Date().toISOString().slice(0, 16);
		dateVariable = '';
		responsibleName = '';
		responsibleNumber = '';
	};

</script>

<svelte:head>
	<title>Takterrassen</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $isAuthenticated}
	<div class="container">
		<section class="booking">
			<h3 class="header">Legg inn en booking</h3>
			<form on:submit|preventDefault={handleSubmit}>
				<p class="input-lable">Velg dato:</p>
				<input type="date" bind:value={dateVariable} placeholder="Dato" />
				<p class="input-lable">Velg start-tidspunkt:</p>
				<input type="time" bind:value={startTime} placeholder="Start-tidspunkt" />
				<p class="input-lable">Velg slutt-tidspunkt:</p>
				<input type="time" bind:value={endTime} placeholder="Slutt-tidspunkt" />
				<p class="input-lable">Hvem er ansvarlig for bookingen?</p>
				<input type="text" bind:value={responsibleName} placeholder="Navn" />
				<p class="input-lable">Oppgi ansvarlig sitt telefonnummer: </p>
				<input type="text" bind:value={responsibleNumber} placeholder="Telefonnummer" />
				<br />
				<button type="submit" class="button">Opprett booking</button>
			</form>
		</section>
		<section class="your-bookings">
			<MineBookinger userId={userId} bookings={bookings}/>
		</section>
	</div>
{/if}


