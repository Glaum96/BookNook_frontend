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
		token = localStorage.getItem('authToken')
		console.log('Min side mounted')
		fetchUser()
		fetchBookings()
	})

	const userId = '673f11a096afef5bf6502318'
	let token: string | null = null

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
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error('Failed to fetch user')
			return
		}

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
					Authorization: `Bearer ${token}`,
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
		const response = await fetch('http://localhost:9090/api/myBookings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				//Denne må oppdateres til å bruker userId
				'User-Id': '1001',
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.ok) {
			return await response.json()
		} else {
			console.log('status: ', response.status)
			console.log('error: ', response)
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault()
		updateUser()
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
		<MineBookinger fetchBookingsFunction={fetchBookings} />
	</section>
</div>
