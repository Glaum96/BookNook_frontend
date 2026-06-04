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

	function pad(n: number) { return String(n).padStart(2, '0') }

	function todayString(): string {
		const d = new Date()
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
	}

	function getInitialStartTime(): string {
		const d = new Date()
		d.setHours(d.getHours() + 1, 0, 0, 0)
		return `${pad(d.getHours())}:00`
	}

	function getInitialEndTime(): string {
		const d = new Date()
		d.setHours(d.getHours() + 3, 0, 0, 0)
		return `${pad(d.getHours())}:00`
	}

	let bookingDate = todayString()
	let startTime = getInitialStartTime()
	let endTime = getInitialEndTime()
	let responsibleName = user.name ?? ''
	let responsibleNumber = user.phoneNumber ?? ''
	let ruleErrors: string[] = []

	$: endBeforeStart = startTime && endTime && endTime <= startTime

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
			startTime: new Date(`${bookingDate}T${startTime}:00`).toISOString(),
			endTime: new Date(`${bookingDate}T${endTime}:00`).toISOString(),
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
			<label for="bookingDate">Dato</label>
			<input id="bookingDate" type="date" bind:value={bookingDate} required disabled={$postBookingLoading} />
		</div>
		<div class="form-row-2">
			<div class="input-group">
				<label for="startTime">Fra</label>
				<input id="startTime" type="time" bind:value={startTime} required disabled={$postBookingLoading} />
			</div>
			<div class="input-group">
				<label for="endTime">Til</label>
				<input id="endTime" type="time" bind:value={endTime} required disabled={$postBookingLoading} />
			</div>
		</div>
		{#if endBeforeStart}
			<p class="field-error">Sluttidspunkt må være etter starttidspunkt</p>
		{/if}
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
		color: var(--color-primary);
	}

	.input-group {
		margin-bottom: 1rem;
	}

	.form-row-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		font-size: 1rem;
		box-sizing: border-box;
		background-color: var(--bg-input);
		color: var(--text-body);
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--focus-ring);
	}

	.field-error {
		margin: -0.5rem 0 0.75rem;
		font-size: 0.85rem;
		color: var(--color-error);
	}

	button {
		width: 100%;
		padding: 0.75rem;
		margin-top: 0.5rem;
		border: none;
		border-radius: 5px;
		background: var(--color-action);
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	button:hover:not(:disabled) {
		background: var(--color-action-hover);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-list {
		list-style: none;
		padding: 0.75rem 1rem;
		margin: 0 0 1rem;
		background: var(--color-error-bg);
		border: 1px solid var(--color-error-border);
		border-radius: 5px;
		color: var(--color-error);
		font-size: 0.9rem;
	}

	.error-list li + li {
		margin-top: 0.25rem;
	}
</style>
