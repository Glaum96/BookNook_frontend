<script>
	import { createEventDispatcher } from 'svelte'

	let id = ''
	let username = ''
	let password = ''
	let name = ''
	let email = ''
	let phoneNumber = ''
	let apartmentNumber = ''

	const dispatch = createEventDispatcher()

	async function registerUser() {
		const user = {
			id,
			username,
			password,
			name,
			email,
			phoneNumber,
			apartmentNumber,
		}

		const response = await fetch('http://localhost:9090/api/postUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})

		if (response.ok) {
			const result = await response.json()
			dispatch('registerSuccess', result)
			console.log('User registered successfully')
		} else {
			const error = await response.text()
			dispatch('registerError', error)
			console.log('Error registering user:', JSON.parse(error))
		}
	}
</script>

<main>
	<h1>Register</h1>
	<form on:submit|preventDefault={registerUser}>
		<label>
			ID:
			<input type="text" bind:value={id} required />
		</label>
		<label>
			Username:
			<input type="text" bind:value={username} required />
		</label>
		<label>
			Password:
			<input type="password" bind:value={password} required />
		</label>
		<label>
			Name:
			<input type="text" bind:value={name} required />
		</label>
		<label>
			Email:
			<input type="email" bind:value={email} required />
		</label>
		<label>
			Phone Number:
			<input type="tel" bind:value={phoneNumber} required />
		</label>
		<label>
			Apartment Number:
			<input type="text" bind:value={apartmentNumber} required />
		</label>
		<button type="submit">Register</button>
	</form>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
