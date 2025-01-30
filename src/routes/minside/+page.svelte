<script lang="ts">
	import { onMount } from 'svelte';
	import './minside.css';
	import MineBookinger from '$lib/components/mineBookinger.svelte';
	import { fetchMyBookings } from '$lib/api/bookings.js';
	import type { Booking } from '../../types/Booking';
	import { fetchUser, updateUser } from '$lib/api/user';


	const userId = "673f11a096afef5bf6502318";
	const userIdBooking = '1001'

	let user = {
		id: userId,
		name: "",
		phoneNumber: "",
		email: "",
		apartmentNumber: "",
	};

	let bookings: Booking[] = [];

	onMount(async () => {
		bookings = await fetchMyBookings(userIdBooking);
		user = await fetchUser(userId);
	});

	function handleSubmit(event) {
		event.preventDefault();
		updateUser(user);
	}

</script>

<svelte:head>
	<title>Min side</title>
	<meta name="description" content="Dette er min side" />
</svelte:head>

<div class="container">
	<section class="user">
		<h3 class="header">Din profil</h3>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="inputcolumn">
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
	<section class="bookings">
		<MineBookinger userId={userId} bookings={bookings}/>
	</section>
</div>