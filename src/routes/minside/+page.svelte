<script>
	import { onMount } from 'svelte';
	import './minside.css'; // Import the CSS file

	let user = {
		name: "",
		phoneNumber: "",
		email: "",
		apartmentNumber: ""
	};

	function handleSubmit(event) {
		event.preventDefault();
		console.log('Form submitted');
	}

	//Henter bruker med en gitt brukerId
	const userId = "673f11a096afef5bf6502318";

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

	onMount(fetchUser);
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
	</section>
</div>