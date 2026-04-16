<script lang="ts">
	import { goto } from '$app/navigation'
	import { base } from '$app/paths'
	import { onMount, SvelteComponent } from 'svelte'
	import { isAdminUser, isAuthenticated, logOut } from '../../../stores/auth'
	import { getUserFromLocalStorage } from '$lib/api/users'
	import { showModal, modalContent } from '../../../stores/modal'
	import './header.css'
	import NewBooking from '../newBooking/newBooking.svelte'
	import StaticInfo from '../staticInfo/staticInfo.svelte'

	const navigateTo = (url: string) => {
		goto(`${base}${url}`)
	}

	// Function to handle logout
	const handleLogOut = () => {
		logOut()
		navigateTo(`${base}/login`)
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
	let mobileNavOpen = false

	onMount(() => {
		const user = getUserFromLocalStorage()
		userName = user ? user.name : null
	})

	const closeNav = () => {
		mobileNavOpen = false
	}

	const toggleNewBookingModal = () => {
		showModal.set(!$showModal)
		modalContent.set({
			component: NewBooking as typeof SvelteComponent,
			props: {
				onClose: () => showModal.set(false),
				user: getUserFromLocalStorage(),
			},
		})
	}

	const toggleStaticInfoModal = () => {
		showModal.set(!$showModal)
		modalContent.set({
			component: StaticInfo as typeof SvelteComponent,
			props: {},
		})
	}
</script>

<header class="global-header">
	<nav>
		<a class="title" href="{base}/" on:click|preventDefault={() => { navigateTo('/'); closeNav(); }}>
			<img src="{base}/booknook_full_logo.png" alt="BookNook Logo" />
		</a>

		<div class="nav-items" class:open={mobileNavOpen}>
			{#if $isAuthenticated}
				<button id="toggleModalButton" on:click={() => { toggleNewBookingModal(); closeNav(); }}>
					<p>Ny booking</p>
					<span class="icon">+</span>
				</button>
				<a href="{base}/minside" on:click|preventDefault={() => { navigateTo('/minside'); closeNav(); }}>{getUserNameText(userName)}</a>
				{#if $isAdminUser}
					<a href="{base}/admin" on:click|preventDefault={() => { navigateTo('/admin'); closeNav(); }}>Admin</a>
				{/if}
				<button on:click={() => { handleLogOut(); closeNav(); }} class="nav-link">Logg ut</button>
			{:else}
				<a href="{base}/register" on:click|preventDefault={() => { navigateTo('/register'); closeNav(); }}>Registrer</a>
				<a href="{base}/login" on:click|preventDefault={() => { navigateTo('/login'); closeNav(); }}>Logg inn</a>
			{/if}
		</div>

		<img id="info_img" src="{base}/info.png" alt="Info" on:click={() => { toggleStaticInfoModal(); closeNav(); }} />

		<button class="hamburger" aria-label="Åpne meny" on:click|stopPropagation={() => (mobileNavOpen = !mobileNavOpen)}>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</nav>
</header>
