<script lang="ts">
	import { writable } from 'svelte/store'
	import { goto } from '$app/navigation'
	import { addUserToLocalStorage } from '$lib/api/users'

	let userId = '673f11a096afef5bf6502318' // TODO: Use the actual userId
	let username = ''
	let password = ''
	let errorMessage = writable('')

	async function handleLogin() {
		try {
			const response = await fetch('http://localhost:9090/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
				credentials: 'include', // Include credentials if needed
			})

			if (response.ok) {
				const data = await response.json()
				localStorage.setItem('authToken', data['authToken'])
				console.log('DATA', data['message'])
				goto('/') // Redirect to the home page or another protected route

				addUserToLocalStorage(userId)
			} else {
				errorMessage.set('Invalid username or password')
			}
		} catch (error) {
			errorMessage.set('An error occurred. Please try again.')
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<h1>Login</h1>
		<form on:submit|preventDefault={handleLogin}>
			<div class="input-group">
				<input type="text" bind:value={username} placeholder="Username" required />
			</div>
			<div class="input-group">
				<input type="password" bind:value={password} placeholder="Password" required />
			</div>
			<button type="submit">Login</button>
		</form>
		{#if $errorMessage}
			<p class="error">{$errorMessage}</p>
		{/if}
	</div>
</div>

<style>
	body {
		font-family: 'Arial', sans-serif;
		background: #f0f2f5;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.login-card {
		background: #fff;
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		max-width: 400px;
		width: 100%;
		text-align: center;
	}

	h1 {
		margin-bottom: 1.5rem;
		color: #333;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	input[type='text'],
	input[type='password'] {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 1rem;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		border: none;
		border-radius: 5px;
		background: #007bff;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	button:hover {
		background: #0056b3;
	}

	.error {
		color: red;
		margin-top: 1rem;
	}
</style>
