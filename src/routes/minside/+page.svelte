<script>
	import { onMount } from 'svelte';
	import './minside.css';
	import MineBookinger from '$lib/mineBookinger.svelte'; // Import the CSS file

	const userId = "673f11a096afef5bf6502318";

	let user = {
		id: userId,
		name: "",
		phoneNumber: "",
		email: "",
		apartmentNumber: "",
	};

	async function fetchUser() {
		const response = await fetch(`http://localhost:9090/api/getUser/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const userResponse = await response.json();

		user.name = userResponse.name;
		user.phoneNumber = userResponse.phoneNumber;
		user.email = userResponse.email;
		user.apartmentNumber = userResponse.apartmentNumber;
	}

	async function updateUser() {
		try {
			const response = await fetch(`http://localhost:9090/api/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});
			const success = await response.json();
			if (success) {
				console.log('User updated successfully');
			} else {
				console.error('Failed to update user');
			}
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

	async function fetchBookings() {
		try {
			const response = await fetch('http://localhost:9090/api/myBookings', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					//Denne må oppdateres til å bruker userId
					'User-Id': '1001'
				}
			});

			return await response.json();
		} catch (error) {
			console.log(error);
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		updateUser();
	}

	onMount(() =>
	{
		fetchUser();
		fetchBookings();
	});
</script>

<svelte:head>
	<title>Min side</title>
	<meta name="description" content="Dette er min side" />
</svelte:head>

<div class="container">
	<section class="user">
		<form on:submit|preventDefault={handleSubmit}>
			<div class="inputcolumn">
				<p>Navn:</p>
				<input bind:value={user.name} />
				<p>Tlf:</p>
				<input bind:value={user.phoneNumber} />
				<p>Epost:</p>
				<input bind:value={user.email} />
			</div>
			<div class="inputcolumn">
				<p>Leilighetsnummer:</p>
				<input bind:value={user.apartmentNumber} />
				<br />
				<button type="submit" class="button">Lagre endringer</button>
			</div>
		</form>
	</section>
	<section class="bookings">
		<h3>Dine bookinger: </h3>
		<MineBookinger fetchBookingsFunction={fetchBookings} />

	</section>
</div>