<script lang="ts">
	export let size: 'small' | 'medium' | 'large' = 'medium'
	export let label: string = ''
	export let inline: boolean = false
</script>

<span class="spinner-container" class:inline>
	<span class="spinner {size}"></span>
	{#if label}
		<span class="label">{label}</span>
	{/if}
</span>

<style>
	.spinner-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.spinner-container.inline {
		display: inline-flex;
	}

	.spinner {
		border: 2px solid #e0e0e0;
		border-top-color: #002776;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.spinner.small {
		width: 1rem;
		height: 1rem;
		border-width: 2px;
	}

	.spinner.medium {
		width: 2rem;
		height: 2rem;
		border-width: 3px;
	}

	.spinner.large {
		width: 3rem;
		height: 3rem;
		border-width: 4px;
	}

	.label {
		color: #333;
		font-size: 0.875rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
