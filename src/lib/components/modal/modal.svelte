<script lang="ts">
	import { onMount } from 'svelte';
	
	export let onClose: any

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
			<h2 id="modal-title">Modal Title</h2>
			<p>This is a modal dialog. Click outside to close it.</p>
			<p>Some text in the Modal..</p>
		</div>
	</div>
</modal>

<style>
	.modal-container {
		width: 100vw; /* Full viewport width */
		height: 100vh; /* Full viewport height */
	}

	/* Backdrop covers the entire container */
	.backdrop {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute; /* Positioned relative to .modal-container */
		background: rgba(0, 0, 0, 0.5);
		display: flex; /* Use flexbox to center the modal */
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	/* Modal content is centered */
	.modal-content {
        position: absolute; /* Positioned relative to .modal-container */
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* Center the modal */
        padding: 20px;
        border-radius: 10px;
        max-width: 400px;
        width: 90%; /* Ensure responsiveness */
        background: white;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000; /* Ensure modal content is above the backdrop */
	}

	    /* Close button styles */
		.close {
        position: absolute; /* Position the button relative to .modal-content */
        top: 10px; /* Distance from the top of the modal */
        right: 10px; /* Distance from the right of the modal */
        background: none; /* Remove default button background */
        border: none; /* Remove default button border */
        font-size: 20px; /* Make the button larger */
        cursor: pointer; /* Change cursor to pointer */
    }
</style>
