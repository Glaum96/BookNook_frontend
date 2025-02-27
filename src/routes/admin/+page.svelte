<script lang="ts">
	import type { User } from '../../types/User';
	import './admin.css';
	import { onMount } from 'svelte';
	import type { Booking } from '../../types/Booking';
	import { getDate, getTime } from '$lib/functions/dateFunctions.js';
	import { deleteUser, fetchAllUsers } from '$lib/api/user';
	import { deleteBooking, fetchAllBookings } from '$lib/api/bookings';

	let users: User[] = [];
	let bookings: Booking[] = [];

	onMount(async () => {
		users = await fetchAllUsers();
		bookings = await fetchAllBookings();
	});

	const handleDeleteBooking = async (bookingId: string) => {
		await deleteBooking(bookingId);
		bookings = await fetchAllBookings();
	}

	const handleDeleteUser = async (userId: string) => {
		await deleteUser(userId);
		users = await fetchAllUsers();
	}

</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Dette er admin-siden" />
</svelte:head>

	<div class="container">
			<section class="users">
				<h3 class="heading"> Alle brukere: </h3>
				<table class="user-table">
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
							<td><button class="delete-button" on:click={()=> handleDeleteUser(user.id)}>Slett</button></td>
						</tr>
					{/each}
					</tbody>
				</table>
			</section>
			<section class="bookings">
				<h3 class="heading"> Alle bookinger: </h3>
				<table class="booking-table">
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
							<td class="button-container"><button class="delete-button" on:click={()=> handleDeleteBooking(booking.id)}>Slett</button></td>
						</tr>
					{/each}
					</tbody>
				</table>
			</section>
	</div>

