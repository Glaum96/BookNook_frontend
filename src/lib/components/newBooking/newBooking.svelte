<script lang="ts">
	import { onMount } from 'svelte'
	import type { User } from '../../../types/User'
	import { fetchMyBookings, postBooking } from '$lib/api/bookings'
	import type { Booking } from '../../../types/Booking'
	import { includePastBookings } from '../../../stores/includePastBookings'
	import { isLoading } from '../../../stores/loading'
	import Spinner from '../spinner/Spinner.svelte'

	export let onClose: () => void
	export let user: User

	const postBookingLoading = isLoading('postBooking')

	function formatLocalDatetime(date: Date): string {
		const pad = (n: number) => String(n).padStart(2, '0')
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`
	}

	function getInitialStart(): string {
		const d = new Date()
		d.setHours(d.getHours() + 1, 0, 0, 0)
		return formatLocalDatetime(d)
	}

	function getInitialEnd(): string {
		const d = new Date()
		d.setHours(d.getHours() + 3, 0, 0, 0)
		return formatLocalDatetime(d)
	}

	let startDateTime = getInitialStart()
	let endDateTime = getInitialEnd()
	let responsibleName = user.name ?? ''
	let responsibleNumber = user.phoneNumber ?? ''
	let ruleErrors: string[] = []

	$: endBeforeStart = startDateTime && endDateTime && endDateTime <= startDateTime

	onMount(() => {
		const modalContent = document.querySelector('.modal-content')
		if (modalContent) {
			modalContent.setAttribute('tabindex', '-1')
			;(modalContent as HTMLElement).focus()
		}
	})

	async function handleSubmit() {
		if (endBeforeStart) return

		ruleErrors = []
		const newBooking: Booking = {
			id: '',
			startTime: new Date(startDateTime).toISOString(),
			endTime: new Date(endDateTime).toISOString(),
			userId: user.id,
			responsibleName,
			responsibleNumber,
		}
		const result = await postBooking(newBooking)
		if (!result.success) {
			ruleErrors = result.errors ?? []
			return
		}
		await fetchMyBookings(user.id, $includePastBookings)
		onClose()
	}
</script>

<div class="new-booking">
	<h3 class="title">Legg inn booking</h3>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="input-group">
			<label for="startDateTime">Fra</label>
			<input id="startDateTime" type="datetime-local" bind:value={startDateTime} required disabled={$postBookingLoading} />
		</div>
		<div class="input-group">
			<label for="endDateTime">Til</label>
			<input id="endDateTime" type="datetime-local" bind:value={endDateTime} required disabled={$postBookingLoading} />
			{#if endBeforeStart}
				<p class="field-error">Sluttidspunkt må være etter starttidspunkt</p>
			{/if}
		</div>
		<div class="input-group">
			<label for="responsibleName">Ansvarlig</label>
			<input id="responsibleName" type="text" bind:value={responsibleName} placeholder="Navn" required disabled={$postBookingLoading} />
		</div>
		<div class="input-group">
			<label for="responsibleNumber">Telefonnummer</label>
			<input id="responsibleNumber" type="tel" bind:value={responsibleNumber} placeholder="99887766" required disabled={$postBookingLoading} />
		</div>
		{#if ruleErrors.length > 0}
			<ul class="error-list">
				{#each ruleErrors as error}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}
		<button type="submit" disabled={$postBookingLoading || !!endBeforeStart}>
			{#if $postBookingLoading}
				<Spinner size="small" inline />
				Oppretter...
			{:else}
				Opprett booking
			{/if}
		</button>
	</form>
</div>

<style>
	.new-booking {
		min-width: 300px;
	}

	.title {
		margin: 0 0 1.5rem;
		font-size: 1.3rem;
		font-weight: bold;
		color: #525a8a;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		color: #555;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 1rem;
		box-sizing: border-box;
		background-color: #fff;
		color: #1c1b1f;
	}

	input:focus {
		outline: none;
		border-color: #525a8a;
		box-shadow: 0 0 0 2px rgba(82, 90, 138, 0.15);
	}

	.field-error {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: #cc0000;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		margin-top: 0.5rem;
		border: none;
		border-radius: 5px;
		background: #007bff;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	button:hover:not(:disabled) {
		background: #0056b3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-list {
		list-style: none;
		padding: 0.75rem 1rem;
		margin: 0 0 1rem;
		background: #fff0f0;
		border: 1px solid #ffcccc;
		border-radius: 5px;
		color: #cc0000;
		font-size: 0.9rem;
	}

	.error-list li + li {
		margin-top: 0.25rem;
	}
</style>
