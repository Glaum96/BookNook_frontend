<script lang="ts">
	import { isAuthenticated, logOut } from '../stores/auth'
	import { goto } from '$app/navigation'

	function navigateTo(url: string) {
		console.log('Navigating to:', url) // Debugging
		goto(url)
	}

	// Function to handle logout
	function handleLogOut() {
		logOut()
		navigateTo('/login')
	}
</script>

<header>
	<nav>
		<a href="/" on:click|preventDefault={() => navigateTo('/')}>Seilduksgata 6B</a>
		{#if $isAuthenticated}
			<a href="/minside" on:click|preventDefault={() => navigateTo('/minside')}>Min side</a>
			<a href="/admin" on:click|preventDefault={() => navigateTo('/admin')}>Admin</a>
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
