<script lang="ts">
	import { onMount } from 'svelte'
	import type { User } from '../../../types/User'
	import { fetchMyBookings, postBooking } from '$lib/api/bookings'
	import type { Booking } from '../../../types/Booking'

	export let onClose: any
	export let user: User

	let bookings: Booking[] = []

	let startTime = new Date().toISOString().slice(0, 16)
	let endTime = new Date().toISOString().slice(0, 16)
	let dateVariable = ''
	let responsibleName = ''
	let responsibleNumber = ''

	function handleKeyDown(event: KeyboardEvent) {
		console.log('Keydown event:', event.key)
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			console.log('Keydown triggered')
			onClose() // Close the modal
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown)

		// Set active and focus on the modal content on mount so that no other DOM element can be activated by pressing space or enter
		const modalContent = document.querySelector('.modal-content')
		if (modalContent) {
			modalContent.setAttribute('tabindex', '-1') // Make it focusable
			;(modalContent as HTMLElement).focus()
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	})

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

	const resetForm = () => {
		startTime = new Date().toISOString().slice(0, 16)
		endTime = new Date().toISOString().slice(0, 16)
		dateVariable = ''
		responsibleName = ''
		responsibleNumber = ''
	}
    console.log('user in newBooking:', user)
</script>

<newBooking {onClose} {user}>
	<div class="new-booking">
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
			<button on:click={onClose} type="submit" class="button">Opprett booking</button>
		</form>
	</div>
</newBooking>

