<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { base } from '$app/paths'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { fetchAuditLogs, formatAction, type AuditLog } from '$lib/api/audit'
	import { isAdminUser } from '../../stores/auth'
	import Spinner from '$lib/components/spinner/Spinner.svelte'

	let logs: AuditLog[] = []
	let loading = true

	onMount(async () => {
		await globalOnMount()
		if (!$isAdminUser) {
			goto(`${base}/`)
			return
		}
		logs = await fetchAuditLogs()
		loading = false
	})

	function formatTimestamp(ts: string): string {
		return new Date(ts).toLocaleString('nb-NO', {
			dateStyle: 'short',
			timeStyle: 'medium'
		})
	}
</script>

<svelte:head>
	<title>Aktivitetslogg</title>
</svelte:head>

<div class="logg-container">
	<div class="logg-header">
		<h2 class="logg-title">Aktivitetslogg</h2>
		<a href="{base}/admin" on:click|preventDefault={() => goto(`${base}/admin`)} class="back-link">
			← Tilbake til admin
		</a>
	</div>

	{#if loading}
		<div class="loading-container">
			<Spinner size="medium" label="Laster logg..." />
		</div>
	{:else if logs.length === 0}
		<p class="empty">Ingen hendelser registrert ennå.</p>
	{:else}
		<div class="log-table-wrapper">
			<table class="log-table">
				<thead>
					<tr>
						<th>Tidspunkt</th>
						<th>Hendelse</th>
						<th>Utført av</th>
						<th>Detaljer</th>
					</tr>
				</thead>
				<tbody>
					{#each logs as log (log.id)}
						<tr class="log-row log-row--{log.action.toLowerCase()}">
							<td class="col-time">{formatTimestamp(log.timestamp)}</td>
							<td class="col-action">
								<span class="action-badge action-badge--{log.action.toLowerCase()}">
									{formatAction(log.action)}
								</span>
							</td>
							<td class="col-user">{log.performedByName || '—'}</td>
							<td class="col-details">{log.details}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.logg-container {
		padding: 1.5rem;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.logg-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.logg-title {
		margin: 0;
		color: var(--color-primary);
	}

	.back-link {
		font-size: 0.9rem;
		color: var(--color-primary);
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		padding: 3rem;
	}

	.empty {
		color: var(--text-secondary);
		text-align: center;
		padding: 2rem;
	}

	.log-table-wrapper {
		background: var(--bg-card);
		border-radius: 10px;
		overflow-x: auto;
	}

	.log-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.log-table th {
		background: var(--bg-card-alt);
		color: var(--text-body);
		padding: 0.65rem 0.85rem;
		text-align: left;
		white-space: nowrap;
		border-bottom: 1px solid var(--border-color, #ddd);
	}

	.log-table td {
		padding: 0.6rem 0.85rem;
		border-bottom: 1px solid var(--border-color, #eee);
		vertical-align: top;
	}

	.log-row:last-child td {
		border-bottom: none;
	}

	.col-time {
		white-space: nowrap;
		color: var(--text-secondary);
		font-size: 0.82rem;
	}

	.col-user {
		white-space: nowrap;
		font-weight: 500;
	}

	.col-details {
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.action-badge {
		display: inline-block;
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
		background: var(--bg-card-alt);
		color: var(--text-body);
	}

	.action-badge--booking_created {
		background: color-mix(in srgb, #27ae60 15%, transparent);
		color: #1a7a40;
	}

	.action-badge--booking_deleted {
		background: color-mix(in srgb, #c0392b 15%, transparent);
		color: #c0392b;
	}

	.action-badge--user_registered {
		background: color-mix(in srgb, var(--color-primary) 15%, transparent);
		color: var(--color-primary);
	}

	.action-badge--user_updated {
		background: color-mix(in srgb, #2980b9 15%, transparent);
		color: #2980b9;
	}

	.action-badge--user_deleted {
		background: color-mix(in srgb, #c0392b 15%, transparent);
		color: #c0392b;
	}

	.action-badge--checkin_image_uploaded,
	.action-badge--checkout_image_uploaded {
		background: color-mix(in srgb, #e67e22 15%, transparent);
		color: #a04000;
	}

	.action-badge--checkin_image_deleted {
		background: color-mix(in srgb, #7f8c8d 15%, transparent);
		color: #555;
	}

	.action-badge--booking_updated {
		background: color-mix(in srgb, #2980b9 15%, transparent);
		color: #2980b9;
	}

	.action-badge--user_admin_changed {
		background: color-mix(in srgb, #8e44ad 15%, transparent);
		color: #6c3483;
	}

	.action-badge--user_suspended {
		background: color-mix(in srgb, #e67e22 15%, transparent);
		color: #a04000;
	}

	.action-badge--user_unsuspended {
		background: color-mix(in srgb, #7f8c8d 15%, transparent);
		color: #555;
	}
</style>
