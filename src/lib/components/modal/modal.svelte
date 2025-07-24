<script lang="ts">
	import { onMount, SvelteComponent } from 'svelte';
	import './modal.css'
	
	export let onClose: () => void;
	export let component: typeof SvelteComponent | null = null; // The component to render
    export let props: Record<string, any> = {}; // Props to pass to the component

	function handleKeyDown(event: KeyboardEvent) {
        console.log('Keydown event:', event.key);
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            console.log('Keydown triggered');
            onClose(); // Close the modal
        }
    }

	function handleBackdropClick(event: MouseEvent) {
		console.log('Backdrop clicked')
		onClose()
	}

	 onMount(() => {
        document.addEventListener('keydown', handleKeyDown);

		// Set active and focus on the modal content on mount so that no other DOM element can be activated by pressing space or enter
		const modalContent = document.querySelector('.modal-content');
		if (modalContent) {
			modalContent.setAttribute('tabindex', '-1'); // Make it focusable
			(modalContent as HTMLElement).focus();
		}

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

</script>

<modal>
	<div class="modal-container">
		<button class="backdrop" on:keydown={handleKeyDown} on:click={handleBackdropClick} />
		<div class="modal-content">
			<button class="close" on:click={onClose}>&times;</button>
			<slot></slot>
		</div>
	</div>
</modal>
