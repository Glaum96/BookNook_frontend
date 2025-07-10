<script>
	import Header from '../lib/components/header/header.svelte'
	import Footer from '../lib/components/footer/footer.svelte'
	import Modal from '$lib/components/modal/modal.svelte'
	import '../app.css'
	import { showModal } from '../stores/modal'
</script>

<div class="app">
	<Header />

	<main>
		<slot />
		{#if $showModal}
			<Modal onClose={() => showModal.set(false)} />
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
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
