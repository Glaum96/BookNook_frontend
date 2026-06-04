<script lang="ts">
	import { mySuspension } from '../../../stores/suspension'
	import { formatSuspensionDate } from '$lib/api/suspensions'
</script>

{#if $mySuspension}
	<div class="suspension-banner" role="alert">
		<span class="suspension-icon">⚠</span>
		<div class="suspension-text">
			<strong>Du er suspendert fra å opprette nye bookinger</strong>
			frem til {formatSuspensionDate($mySuspension.suspendedUntil)}.
			{#if $mySuspension.reason}
				<span class="suspension-reason">Årsak: {$mySuspension.reason}</span>
			{/if}
			Kontakt admin for spørsmål.
		</div>
	</div>
{/if}

<style>
	.suspension-banner {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.9rem 1.25rem;
		background: color-mix(in srgb, #e67e22 12%, var(--bg-card, white));
		border: 1px solid color-mix(in srgb, #e67e22 40%, transparent);
		border-radius: 8px;
		font-size: 0.9rem;
		color: var(--text-body);
	}

	.suspension-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
		margin-top: 0.05rem;
	}

	.suspension-text {
		line-height: 1.5;
	}

	.suspension-reason {
		display: block;
		margin-top: 0.2rem;
		font-style: italic;
		color: var(--text-secondary);
	}
</style>
