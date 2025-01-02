<script lang="ts">
	import type { User } from '../../types/User';
	import './admin.css';
	import { onMount } from 'svelte';
	import type { Booking } from '../../types/Booking';

	let users: User[] = [];
	let bookings: Booking[] = [];


	async function getAllUsers() {
		try {
			const response = await fetch('http://localhost:9090/api/getUsers', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			users  = await response.json();
			console.log("Users:", users);
		} catch (error) {
			console.log(error);
		}
}
	async function getAllBookings() {
		try {
			const response = await fetch('http://localhost:9090/api/bookings', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			bookings = await response.json();
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		await getAllBookings();
		await getAllUsers();

	});

</script>


<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Dette er admin-siden" />
</svelte:head>

<div >
	<section >
	Dette er admin-siden
	</section>
	<div class="container">
			<section class="users">
				<h3> Alle brukere: </h3>
				<table class="user-table">
					<thead>
					<tr>
						<th>Bruker-id</th>
						<th>Navn</th>
						<th>Epost</th>
						<th>Leilighetsnummer</th>
					</tr>
					</thead>
					<tbody>
					{#each users as user}
						<tr>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.apartmentNumber}</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</section>
			<section class="bookings">
				<h3> Alle bookinger: </h3>
				<table class="booking-table">
					<thead>
					<tr>
						<th>Start-tidspunkt</th>
						<th>Slutt-tidspunkt</th>
						<th>Ansvarlig</th>
						<th>Telefonnummer</th>
					</tr>
					</thead>
					<tbody>

					{#each bookings as booking}
						<tr>
							<td>{booking.startTime}</td>
							<td>{booking.endTime}</td>
							<td>{booking.responsibleName}</td>
							<td>{booking.responsibleNumber}</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</section>
	</div>

</div>