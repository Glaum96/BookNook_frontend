<script lang="ts">
	import Header from '../lib/components/header/header.svelte'
	import Footer from '../lib/components/footer/footer.svelte'
	import Modal from '$lib/components/modal/modal.svelte'
	import SuspensionBanner from '$lib/components/suspension/SuspensionBanner.svelte'
	import QuotaBanner from '$lib/components/quota/QuotaBanner.svelte'
	import '../app.css'
	import { showModal, modalContent } from '../stores/modal'
	import type { User } from '../types/User'
	import type { Booking } from '../types/Booking'
	import { onMount } from 'svelte'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import NewBooking from '$lib/components/newBooking/newBooking.svelte'
	import { browser } from '$app/environment'
	import { theme } from '../stores/theme'
	import type { Theme } from '../stores/theme'

	let bookings: Booking[] = []

	function getSystemPreference(): 'light' | 'dark' {
		if (!browser) return 'light'
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	function applyTheme(t: Theme) {
		if (!browser) return
		const effective = t === 'system' ? getSystemPreference() : t
		document.documentElement.setAttribute('data-theme', effective)
	}

	$: if (browser) applyTheme($theme)

	onMount(async () => {
		applyTheme($theme)
		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = () => {
			if ($theme === 'system') applyTheme('system')
		}
		mq.addEventListener('change', handler)

		const { user: fetchedUser, bookings: fetchedBookings } = await globalOnMount()
		user = fetchedUser
		bookings = fetchedBookings

		return () => mq.removeEventListener('change', handler)
	})

	// Handle body scrolling when modal is shown
	onMount(() => {
		const unsubscribe = showModal.subscribe((value) => {
			if (value) {
				document.body.style.overflow = 'hidden'
			} else {
				document.body.style.overflow = ''
			}
		})

		return () => {
			unsubscribe()
		}
	})

	let user = {
		id: '',
		name: '',
		phoneNumber: '',
		email: '',
		apartmentNumber: '',
	} as User
</script>

<div class="app">
	<Header />
	<SuspensionBanner />
	<QuotaBanner />

	<main>
		<slot />
		{#if $showModal}
			<Modal onClose={() => showModal.set(false)}>
				{#if $modalContent.component}
					<svelte:component this={$modalContent.component} {...$modalContent.props} />
				{/if}
			</Modal>
		{/if}
	</main>
	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
