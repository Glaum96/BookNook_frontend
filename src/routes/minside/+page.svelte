<script lang="ts">
	import { onMount } from 'svelte'
	import './minside.css'
	import MineBookinger from '$lib/components/mineBookinger.svelte'
	import { goto } from '$app/navigation'
	import { checkAuth, isAuthenticated } from '../../stores/auth'

	onMount(() => {
		checkAuth()
		if (!$isAuthenticated) {
			goto('/login')
		}
	})

	const userId = '673f11a096afef5bf6502318'

	let user = {
		id: userId,
		name: '',
		phoneNumber: '',
		email: '',
		apartmentNumber: '',
	}

	async function fetchUser() {
		const response = await fetch(`http://localhost:9090/api/getUser/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const userResponse = await response.json()

		user.name = userResponse.name
		user.phoneNumber = userResponse.phoneNumber
		user.email = userResponse.email
		user.apartmentNumber = userResponse.apartmentNumber
	}

	async function updateUser() {
		try {
			const response = await fetch(`http://localhost:9090/api/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})
			const success = await response.json()
			if (success) {
				console.log('User updated successfully')
			} else {
				console.error('Failed to update user')
			}
		} catch (error) {
			console.error('Error updating user:', error)
		}
	}

	async function fetchBookings() {
		try {
			const response = await fetch('http://localhost:9090/api/myBookings', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					//Denne må oppdateres til å bruker userId
					'User-Id': '1001',
				},
			})

			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault()
		updateUser()
	}

	onMount(() => {
		console.log('Min side mounted')
		fetchUser()
		fetchBookings()
	})
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
		<MineBookinger fetchBookingsFunction={fetchBookings} />
	</section>
</div>
