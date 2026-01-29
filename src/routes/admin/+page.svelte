<script lang="ts">
	import type { User } from '../../types/User'
	import { onMount } from 'svelte'
	import './admin.css'
	import type { Booking } from '../../types/Booking'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { getDate, getTime } from '$lib/functions/dateFunctions.js'
	import { deleteBooking, fetchAllBookings } from '$lib/api/bookings'
	import { deleteUser, fetchAllUsers } from '$lib/api/users'
	import { isLoading } from '../../stores/loading'
	import Spinner from '$lib/components/spinner/Spinner.svelte'

	const usersLoading = isLoading('users')
	const bookingsLoading = isLoading('bookings')
	const deleteBookingLoading = isLoading('deleteBooking')
	const deleteUserLoading = isLoading('deleteUser')

	let deletingBookingId: string | null = null
	let deletingUserId: string | null = null

	onMount(() => {
		globalOnMount()
	})

	let users: User[] = []
	let bookings: Booking[] = []

	onMount(async () => {
		bookings = await fetchAllBookings()
		users = await fetchAllUsers()
	})

	const handleDeleteBooking = async (bookingId: string) => {
		deletingBookingId = bookingId
		await deleteBooking(bookingId)
		bookings = await fetchAllBookings()
		deletingBookingId = null
	}

	const handleDeleteUser = async (userId: string) => {
		deletingUserId = userId
		await deleteUser(userId)
		users = await fetchAllUsers()
		deletingUserId = null
	}
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Dette er admin-siden" />
</svelte:head>

<div class="admin-container">
	<section class="users-admin-panel">
		<h3 class="admin-heading">Alle brukere:</h3>
		{#if $usersLoading && users.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster brukere..." />
			</div>
		{:else}
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
					{#each users as user (user.id)}
						<tr>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.apartmentNumber}</td>
							<td>{user.id}</td>
							<td class="button-container">
								<button
									class="delete-button"
									on:click={() => handleDeleteUser(user.id)}
									disabled={$deleteUserLoading && deletingUserId === user.id}
								>
									{#if $deleteUserLoading && deletingUserId === user.id}
										<Spinner size="small" inline />
									{:else}
										Slett
									{/if}
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="no-users">Ingen brukere funnet</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
	<section class="bookings">
		<h3 class="heading">Alle bookinger:</h3>
		{#if $bookingsLoading && bookings.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster bookinger..." />
			</div>
		{:else}
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
					{#each bookings as booking (booking.id)}
						<tr>
							<td>{getDate(booking.startTime)}</td>
							<td>{getTime(booking.startTime)} - {getTime(booking.endTime)}</td>
							<td>{booking.responsibleName}</td>
							<td>{booking.responsibleNumber}</td>
							<td class="button-container">
								<button
									class="delete-button"
									on:click={() => handleDeleteBooking(booking.id)}
									disabled={$deleteBookingLoading && deletingBookingId === booking.id}
								>
									{#if $deleteBookingLoading && deletingBookingId === booking.id}
										<Spinner size="small" inline />
									{:else}
										Slett
									{/if}
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="no-bookings">Ingen bookinger funnet</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}
</style>
