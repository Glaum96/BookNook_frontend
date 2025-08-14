<script lang="ts">
	import Header from '../lib/components/header/header.svelte'
	import Footer from '../lib/components/footer/footer.svelte'
	import Modal from '$lib/components/modal/modal.svelte'
	import '../app.css'
	import { showModal, modalContent } from '../stores/modal'
	import type { User } from '../types/User'
	import type { Booking } from '../types/Booking'
	import { onMount } from 'svelte'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import NewBooking from '$lib/components/newBooking/newBooking.svelte'

	let bookings: Booking[] = []

	onMount(async () => {
		const { user: fetchedUser, bookings: fetchedBookings } = await globalOnMount()
		user = fetchedUser
		bookings = fetchedBookings
	})

	// Handle body scrolling when modal is shown
	onMount(() => {
		const unsubscribe = showModal.subscribe((value) => {
			if (value) {
				document.body.style.overflow = 'hidden' // Disable scrolling
			} else {
				document.body.style.overflow = '' // Restore scrolling
			}
		})

		return () => {
			unsubscribe() // Cleanup subscription when component is destroyed
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
