<script lang="ts">
	import { onMount } from 'svelte'
	import './minside.css'
	import MineBookinger from '$lib/components/mineBookinger.svelte'
	import type { User } from '../../types/User'
	import type { Booking } from '../../types/Booking'
	import { updateUser } from '$lib/api/users'
	import { globalOnMount } from '$lib/api/globalOnMount'

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
		<MineBookinger userId={user.id} {bookings} />
	</section>
</div>
