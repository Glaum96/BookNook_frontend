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
	//import '~@sb1/ffe-buttons/css/buttons.css'

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
	onMount(() => {
		const user = getUserFromLocalStorage()
		userName = user ? user.name : null
	})

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
		<a class="title" href="{base}/" on:click|preventDefault={() => navigateTo('/')}>
			<img src="{base}/booknook_full_logo.png" alt="BookNook Logo" />
		</a>
		{#if $isAuthenticated}
			<button id="toggleModalButton" on:click={toggleNewBookingModal}>
				<p>Ny booking</p>
				<span class="icon">+</span>
			</button>
			<a href="{base}/minside" on:click|preventDefault={() => navigateTo('/minside')}>{getUserNameText(userName)}</a>
			{#if $isAdminUser}
				<a href="{base}/admin" on:click|preventDefault={() => navigateTo('/admin')}>Admin</a>
			{/if}
			<button on:click={handleLogOut} class="nav-link">Logg ut</button>
		{:else}
			<a href="{base}/register" on:click|preventDefault={() => navigateTo('/register')}>Registrer</a>
			<a href="{base}/login" on:click|preventDefault={() => navigateTo('/login')}>Logg inn</a>
		{/if}
		<img id="info_img" src="{base}/info.png" alt="Info" on:click={toggleStaticInfoModal} />
	</nav>
</header>
