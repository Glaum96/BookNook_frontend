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
	import { theme } from '../../../stores/theme'
	import type { Theme } from '../../../stores/theme'
	import { mySuspension } from '../../../stores/suspension'
	import { formatSuspensionDate } from '$lib/api/suspensions'

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

	const themeOrder: Theme[] = ['system', 'light', 'dark']
	const themeLabels: Record<Theme, string> = {
		system: 'Systemvalg',
		light: 'Lys modus',
		dark: 'Mørk modus',
	}

	const cycleTheme = () => {
		const i = themeOrder.indexOf($theme)
		theme.set(themeOrder[(i + 1) % themeOrder.length])
	}
</script>

<header class="global-header">
	<nav>
		<a class="title" href="{base}/" on:click|preventDefault={() => { navigateTo('/'); closeNav(); }}>
			<img src="{base}/booknook_full_logo.png" alt="BookNook Logo" />
		</a>

		{#if $isAuthenticated}
			<button
				id="toggleModalButton"
				on:click={toggleNewBookingModal}
				disabled={$mySuspension !== null}
				title={$mySuspension ? `Suspendert frem til ${formatSuspensionDate($mySuspension.suspendedUntil)}` : undefined}
			>
				<p>Ny booking</p>
				<span class="icon">+</span>
			</button>
		{/if}

		<div class="nav-items" class:open={mobileNavOpen}>
			{#if $isAuthenticated}
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

		<button class="theme-toggle" on:click={cycleTheme} title={themeLabels[$theme]} aria-label={themeLabels[$theme]}>
			{#if $theme === 'light'}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<circle cx="12" cy="12" r="5"/>
					<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
				</svg>
			{:else if $theme === 'dark'}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
				</svg>
			{:else}
				<svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="9" fill="none"/>
					<path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>
				</svg>
			{/if}
		</button>

		<button class="hamburger" aria-label="Åpne meny" on:click|stopPropagation={() => (mobileNavOpen = !mobileNavOpen)}>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</nav>
</header>
