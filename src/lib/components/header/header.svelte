<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { isAdminUser, isAuthenticated, logOut } from '../../../stores/auth'
	import { getUserFromLocalStorage } from '$lib/api/users'
	import './header.css'

	const navigateTo = (url: string) => {
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
		<a class="title" href="/" on:click|preventDefault={() => navigateTo('/')}>BookNook</a>
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
