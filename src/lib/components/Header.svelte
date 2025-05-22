<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { isAdminUser, isAuthenticated, logOut } from '../../stores/auth'
	import { getUserFromLocalStorage } from '$lib/api/users'

	const navigateTo = (url: string) => {
		console.log('Navigating to:', url) // Debugging
		goto(url)
	}

	// Function to handle logout
	const handleLogOut = () => {
		logOut()
		navigateTo('/login')
	}

	const getUserNameText = (userName: string | null) => {
		if (!userName) {
			return 'Min side'
		}

		if (userName.endsWith('s')) {
			return `${userName}' side`
		} else {
			return `${userName}s side`
		}
	}

	let userName: string | null = null
	onMount(() => {
		const user = getUserFromLocalStorage()
		userName = user ? user.name : null
	})
</script>

<header>
	<nav>
		<a href="/" on:click|preventDefault={() => navigateTo('/')}>BookNook</a>
		{#if $isAuthenticated}
			<a href="/minside" on:click|preventDefault={() => navigateTo('/minside')}>{getUserNameText(userName)}</a>
			{#if $isAdminUser}
				<a href="/admin" on:click|preventDefault={() => navigateTo('/admin')}>Admin</a>
			{/if}
			<button on:click={handleLogOut} class="nav-link">Logg ut</button>
		{:else}
			<a href="/register" on:click|preventDefault={() => navigateTo('/register')}>Registrer</a>
			<a href="/login" on:click|preventDefault={() => navigateTo('/login')}>Logg inn</a>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: white;
	}

	nav {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	nav a:first-child {
		margin-right: auto;
		font-size: 1.5rem;
		font-weight: bold;
		color: #525a8a;
	}

	nav a,
	nav button {
		text-decoration: none;
		font-size: 1rem;
		font-weight: bold;
		margin-right: 1.5rem;
		color: #525a8a;
		background: none;
		border: none;
		cursor: pointer;
	}

	nav button {
		padding: 0;
	}
</style>
