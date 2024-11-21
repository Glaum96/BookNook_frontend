<script>
	import { onMount } from 'svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	let textFromBackend = '';
	let usersText = '';
	let bookingsText = '';

	onMount(async () => {
		fetch('http://localhost:9090/')
			.then((response) => response.text())
			.then((data) => {
				console.log(data);
				textFromBackend = data;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});

	onMount(async () => {
		fetch('http://localhost:9090/api/users')
			.then((response) => response.text())
			.then((data) => {
				console.log(data);
				usersText = data;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});

	onMount(async () => {
		fetch('http://localhost:9090/api/bookings')
			.then((response) => response.text())
			.then((data) => {
				console.log(data);
				bookingsText = data;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});
</script>

<svelte:head>
	<title>Takterrassen</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		til DIN takterrasse-booking-app skrevet i <b>SvelteKit</b>
	</h1>

	<h2>
		{textFromBackend}
	</h2>
	<h2>
		{usersText}
	</h2>
	<h2>
		{bookingsText}
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
