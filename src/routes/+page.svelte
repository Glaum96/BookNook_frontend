<script lang="ts">
	import MineBookinger from '$lib/components/mineBookinger.svelte'
	import { onMount } from 'svelte'
	import './page.css'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { isAuthenticated } from '../stores/auth'
	import type { User } from '../types/User'
	import { fetchMyBookings, postBooking } from '$lib/api/bookings'
	import type { Booking } from '../types/Booking'

	onMount(async () => {
		const{ user: fetchedUser, bookings: fetchedBookings } = await globalOnMount()
		user = fetchedUser
		bookings = fetchedBookings
	})

	let user = {
		id: '',
		name: '',
		phoneNumber: '',
		email: '',
		apartmentNumber: '',
	} as User

	let bookings: Booking[] = []
	let startTime = new Date().toISOString().slice(0, 16)
	let endTime = new Date().toISOString().slice(0, 16)
	let dateVariable = ''
	let responsibleName = ''
	let responsibleNumber = ''

	function combineDateAndTime(dateVariable: string, startTime: string, endTime: string) {
		const date = new Date(dateVariable)
		const [startHours, startMinutes] = startTime.split(':')
		const [endHours, endMinutes] = endTime.split(':')

		const startDateTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			Number(startHours),
			Number(startMinutes)
		)
		const endDateTime = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			Number(endHours),
			Number(endMinutes)
		)

		return {
			startDateTime: startDateTime.toISOString(),
			endDateTime: endDateTime.toISOString(),
		}
	}

	async function handleSubmit() {
		const { startDateTime, endDateTime } = combineDateAndTime(dateVariable, startTime, endTime)
		const newBooking = {
			id: '', // ID is added in MongoDB Atlas
			startTime: startDateTime,
			endTime: endDateTime,
			date: dateVariable,
			userId: user.id,
			responsibleName: responsibleName,
			responsibleNumber: responsibleNumber,
		}
		await postBooking(newBooking)
		bookings = await fetchMyBookings(user.id)
		resetForm()
	}

	const resetForm = () => {
		startTime = new Date().toISOString().slice(0, 16)
		endTime = new Date().toISOString().slice(0, 16)
		dateVariable = ''
		responsibleName = ''
		responsibleNumber = ''
	}

	onMount(() => {
		console.log('Min side mounted')
	})
</script>

<svelte:head>
	<title>BookNook</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $isAuthenticated}
	<div class="main-container">
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
				<p class="input-lable">Oppgi ansvarlig sitt telefonnummer:</p>
				<input type="text" bind:value={responsibleNumber} placeholder="Telefonnummer" />
				<br />
				<button type="submit" class="button">Opprett booking</button>
			</form>
		</section>
		<section class="your-bookings">
			<MineBookinger userId={user.id} {bookings} />
		</section>
	</div>
{/if}
