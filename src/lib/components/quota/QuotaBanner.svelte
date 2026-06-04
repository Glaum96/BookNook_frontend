<script lang="ts">
	import { myQuotaStatus } from '../../../stores/quota'
	import { periodLabel } from '$lib/api/quota'

	$: q = $myQuotaStatus
	$: pct = q?.enabled && q.maxHours ? Math.min((q.usedHours ?? 0) / q.maxHours * 100, 100) : 0
	$: barColor = pct >= 100 ? 'var(--color-error, #c0392b)' : pct >= 80 ? '#e67e22' : 'var(--color-primary)'
	$: usedRounded = q?.usedHours != null ? Math.round(q.usedHours * 10) / 10 : 0
</script>

{#if q?.enabled}
	<div class="quota-subheader">
		<span class="quota-label">
			Kvote {periodLabel(q.periodType, q.periodDays)}:
			<strong>{usedRounded} / {q.maxHours}t</strong>
		</span>
		<div class="quota-bar-track">
			<div class="quota-bar-fill" style="width: {pct}%; background: {barColor}"></div>
		</div>
		<span class="quota-pct" style="color: {barColor}">{Math.round(pct)}%</span>
	</div>
{/if}

<style>
	.quota-subheader {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.45rem 1.5rem;
		background: var(--bg-card);
		border-bottom: 1px solid var(--border-separator);
		font-size: 0.875rem;
		color: var(--text-body);
		box-sizing: border-box;
	}

	.quota-label {
		white-space: nowrap;
		flex-shrink: 0;
	}

	.quota-bar-track {
		flex: 1;
		height: 8px;
		background: var(--bg-card-alt, #e8e8e8);
		border-radius: 4px;
		overflow: hidden;
		min-width: 80px;
	}

	.quota-bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease, background 0.3s ease;
	}

	.quota-pct {
		font-weight: 600;
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 3rem;
		text-align: right;
	}
</style>
