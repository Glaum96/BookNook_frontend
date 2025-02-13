<script lang="ts">
	import type { User } from '../../types/User'
	import { onMount } from 'svelte'
	import './admin.css'
	import type { Booking } from '../../types/Booking'
	import { getDate, getTime } from '$lib/functions/dateFunctions.js'
	import { goto } from '$app/navigation'
	import { checkAuth, isAuthenticated } from '../../stores/auth'
	import { fetchAllBookings } from '$lib/api/bookings'
	import { fetchAllUsers } from '$lib/api/users'

	onMount(() => {
		checkAuth()
		if (!$isAuthenticated) {
			goto('/login')
		}
	})

	let users: User[] = []
	let bookings: Booking[] = []

	onMount(async () => {
		console.log('Admin page mounted')
		bookings = await fetchAllBookings()
		users = await fetchAllUsers()
	})
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Dette er admin-siden" />
</svelte:head>

<div class="admin-container">
	<section class="users-admin-panel">
		<h3 class="admin-heading">Alle brukere:</h3>
		<table class="admin-user-table">
			<thead>
				<tr>
					<th>Navn</th>
					<th>Epost</th>
					<th>Leilighetsnummer</th>
					<th>Bruker-id</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td>{user.name}</td>
						<td>{user.email}</td>
						<td>{user.apartmentNumber}</td>
						<td>{user.id}</td>
						<td><button class="delete-button">X</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
	<section class="bookings">
		<h3 class="heading">Alle bookinger:</h3>
		<table class="admin-booking-table">
			<thead>
				<tr>
					<th>Dato</th>
					<th>Tidspunkt</th>
					<th>Ansvarlig</th>
					<th>Telefonnummer</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each bookings as booking}
					<tr>
						<td>{getDate(booking.startTime)}</td>
						<td>{getTime(booking.startTime)} - {getTime(booking.endTime)}</td>
						<td>{booking.responsibleName}</td>
						<td>{booking.responsibleNumber}</td>
						<td><button class="delete-button">X</button></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</div>
