<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { API_BASE_URL } from '$lib/config'
	import { isLoading, setLoading } from '../../stores/loading'
	import Spinner from '$lib/components/spinner/Spinner.svelte'

	let password = ''
	let name = ''
	let email = ''
	let phoneNumber = ''
	let apartmentNumber = ''

	const dispatch = createEventDispatcher()
	const registerLoading = isLoading('register')

	async function registerUser() {
		setLoading('register', true)
		try {
			const user = {
				password,
				name,
				email,
				phoneNumber,
				apartmentNumber,
			}

			const response = await fetch(`${API_BASE_URL}/api/postUser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})

			if (response.ok) {
				const result = await response.json()
				dispatch('registerSuccess', result)
			} else {
				const error = await response.text()
				dispatch('registerError', error)
				console.log('Error registering user:', JSON.parse(error))
			}
		} finally {
			setLoading('register', false)
		}
	}
</script>

<main>
	<h1>Register</h1>
	<form on:submit|preventDefault={registerUser}>
		<label>
			Fullt navn:
			<input type="text" bind:value={name} required disabled={$registerLoading} />
		</label>
		<label>
			E-post:
			<input type="email" bind:value={email} required disabled={$registerLoading} />
		</label>
		<label>
			Passord:
			<input type="password" bind:value={password} required disabled={$registerLoading} />
		</label>
		<label>
			Tlf-nummer:
			<input type="tel" bind:value={phoneNumber} required disabled={$registerLoading} />
		</label>
		<label>
			Leilighetsnummer:
			<input type="text" bind:value={apartmentNumber} required disabled={$registerLoading} />
		</label>
		<button type="submit" disabled={$registerLoading}>
			{#if $registerLoading}
				<Spinner size="small" inline />
				Registrerer...
			{:else}
				Register
			{/if}
		</button>
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
