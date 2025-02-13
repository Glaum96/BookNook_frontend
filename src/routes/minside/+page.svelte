<script lang="ts">
	import { onMount } from 'svelte'
	import './minside.css'
	import MineBookinger from '$lib/components/mineBookinger.svelte'
	import { goto } from '$app/navigation'
	import { checkAuth, isAuthenticated } from '../../stores/auth'
	import { fetchMyBookings } from '$lib/api/bookings.js'
	import type { Booking } from '../../types/Booking'
	import { fetchUser, updateUser } from '$lib/api/users'

	onMount(async () => {
		checkAuth()
		if (!$isAuthenticated) {
			goto('/login')
		}
		token = localStorage.getItem('authToken')
		console.log('Min side mounted')

		bookings = await fetchMyBookings(userIdBooking)
		user = await fetchUser(userId)
	})

	const userId = '673f11a096afef5bf6502318'
	const userIdBooking = '1001'
	let token: string | null = null

	let user = {
		id: userId,
		name: '',
		phoneNumber: '',
		email: '',
		apartmentNumber: '',
	}

	let bookings: Booking[] = []

	function handleSubmit(event: Event) {
		event.preventDefault()
		updateUser(user)
	}
</script>

<svelte:head>
	<title>Min side</title>
	<meta name="description" content="Dette er min side" />
</svelte:head>

<div class="min-side-container">
	<section class="min-side-user">
		<h3 class="header">Din profil</h3>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="min-side-inputcolumn">
				<p class="profile-input-label">Navn:</p>
				<input bind:value={user.name} />
				<p class="profile-input-label">Tlf:</p>
				<input bind:value={user.phoneNumber} />
				<p class="profile-input-label">Epost:</p>
				<input bind:value={user.email} />
				<p class="profile-input-label">Leilighetsnummer:</p>
				<input bind:value={user.apartmentNumber} />
			</div>
			<div class="inputcolumn">
				<button type="submit" class="button">Lagre endringer</button>
			</div>
		</form>
	</section>
	<section class="min-side-bookings">
		<MineBookinger {userId} {bookings} />
	</section>
</div>
