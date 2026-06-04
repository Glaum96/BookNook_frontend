<script lang="ts">
	import { mySuspension } from '../../../stores/suspension'
	import { formatSuspensionDate } from '$lib/api/suspensions'
</script>

{#if $mySuspension}
	<div class="suspension-subheader" role="alert">
		<span class="suspension-icon">⚠</span>
		<span class="suspension-text">
			<strong>Du er suspendert</strong> frem til {formatSuspensionDate($mySuspension.suspendedUntil)}.
			{#if $mySuspension.reason}
				Årsak: <em>{$mySuspension.reason}</em>.
			{/if}
			Kontakt admin for spørsmål.
		</span>
	</div>
{/if}

<style>
	.suspension-subheader {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.6rem 1.5rem;
		background: color-mix(in srgb, #e67e22 18%, var(--bg-card, white));
		border-bottom: 2px solid color-mix(in srgb, #e67e22 55%, transparent);
		font-size: 0.9rem;
		color: var(--text-body);
		box-sizing: border-box;
	}

	.suspension-icon {
		font-size: 1rem;
		flex-shrink: 0;
	}

	.suspension-text {
		line-height: 1.4;
	}
</style>
