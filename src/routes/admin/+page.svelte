<script lang="ts">
	import type { User } from '../../types/User'
	import { onMount } from 'svelte'
	import './admin.css'
	import type { Booking } from '../../types/Booking'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { getDate, getTime } from '$lib/functions/dateFunctions.js'
	import { deleteBooking, fetchAllBookings } from '$lib/api/bookings'
	import { deleteUser, fetchAllUsers } from '$lib/api/users'
	import { fetchRules, toggleRule, type Rule } from '$lib/api/rules'
	import { isLoading } from '../../stores/loading'
	import Spinner from '$lib/components/spinner/Spinner.svelte'
	import { fetchCheckinImages, fetchCheckinSummary, type BookingCheckinSummary } from '$lib/api/checkin'
	import type { CheckinImage } from '../../types/CheckinImage'
	import { API_BASE_URL } from '$lib/config'

	const usersLoading = isLoading('users')
	const bookingsLoading = isLoading('bookings')
	const deleteBookingLoading = isLoading('deleteBooking')
	const deleteUserLoading = isLoading('deleteUser')

	let deletingBookingId: string | null = null
	let deletingUserId: string | null = null

	let imageModalOpen = false
	let imageModalTitle = ''
	let imageModalImages: CheckinImage[] = []
	let imageModalBlobUrls: Record<string, string> = {}

	async function openImageModal(bookingId: string, type: 'CHECK_IN' | 'CHECK_OUT', label: string) {
		const all = await fetchCheckinImages(bookingId)
		imageModalImages = all.filter((i) => i.type === type)
		imageModalTitle = label
		imageModalBlobUrls = {}
		imageModalOpen = true

		const token = localStorage.getItem('authToken')
		for (const img of imageModalImages) {
			try {
				const res = await fetch(`${API_BASE_URL}/api/images/${img.id}`, {
					headers: { Authorization: `Bearer ${token}` }
				})
				if (res.ok) {
					const blob = await res.blob()
					imageModalBlobUrls[img.id] = URL.createObjectURL(blob)
					imageModalBlobUrls = { ...imageModalBlobUrls }
				}
			} catch {
				// ignore
			}
		}
	}

	onMount(() => {
		globalOnMount()
	})

	let users: User[] = []
	let bookings: Booking[] = []
	let rules: Rule[] = []
	let checkinSummary: Map<string, BookingCheckinSummary> = new Map()

	onMount(async () => {
		;[bookings, users, rules] = await Promise.all([
			fetchAllBookings(),
			fetchAllUsers(),
			fetchRules()
		])
		const summary = await fetchCheckinSummary()
		checkinSummary = new Map(summary.map((s) => [s.bookingId, s]))
	})

	async function handleToggleRule(rule: Rule) {
		const newEnabled = !rule.enabled
		rules = rules.map((r) => (r.id === rule.id ? { ...r, enabled: newEnabled } : r))
		await toggleRule(rule.id, newEnabled)
	}

	const handleDeleteBooking = async (bookingId: string) => {
		deletingBookingId = bookingId
		await deleteBooking(bookingId)
		bookings = await fetchAllBookings()
		deletingBookingId = null
	}

	const handleDeleteUser = async (userId: string) => {
		deletingUserId = userId
		await deleteUser(userId)
		users = await fetchAllUsers()
		deletingUserId = null
	}
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Dette er admin-siden" />
</svelte:head>

<div class="admin-container">
	<section class="rules-panel">
		<h3 class="admin-heading">Regler</h3>
		{#each rules as rule (rule.id)}
			<div class="rule-card">
				<div class="rule-info">
					<span class="rule-name">{rule.name}</span>
					<span class="rule-description">{rule.description}</span>
				</div>
				<label class="toggle-switch">
					<input type="checkbox" checked={rule.enabled} on:change={() => handleToggleRule(rule)} />
					<span class="toggle-slider"></span>
				</label>
			</div>
		{/each}
	</section>
	<section class="users-admin-panel">
		<h3 class="admin-heading">Alle brukere:</h3>
		{#if $usersLoading && users.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster brukere..." />
			</div>
		{:else}
			<table class="admin-user-table">
				<thead>
					<tr>
						<th>Navn</th>
						<th>Epost</th>
						<th>Leilighetsnummer</th>
						<th>Bruker-id</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.id)}
						<tr>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.apartmentNumber}</td>
							<td>{user.id}</td>
							<td class="button-container">
								<button
									class="delete-button"
									on:click={() => handleDeleteUser(user.id)}
									disabled={$deleteUserLoading && deletingUserId === user.id}
								>
									{#if $deleteUserLoading && deletingUserId === user.id}
										<Spinner size="small" inline />
									{:else}
										Slett
									{/if}
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="no-users">Ingen brukere funnet</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
	<section class="bookings">
		<h3 class="heading">Alle bookinger:</h3>
		{#if $bookingsLoading && bookings.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster bookinger..." />
			</div>
		{:else}
			<table class="admin-booking-table">
				<thead>
					<tr>
						<th>Dato</th>
						<th>Tidspunkt</th>
						<th>Ansvarlig</th>
						<th>Telefonnummer</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each bookings as booking (booking.id)}
						{@const summary = checkinSummary.get(booking.id)}
						{@const isRecent = summary !== undefined}
						{@const missingImages = isRecent && (!summary.hasCheckin || !summary.hasCheckout)}
						<tr class={missingImages ? 'row--missing-images' : ''}>
							<td>{getDate(booking.startTime)}</td>
							<td>{getTime(booking.startTime)} - {getTime(booking.endTime)}</td>
							<td>{booking.responsibleName}</td>
							<td>{booking.responsibleNumber}</td>
							<td class="button-container">
								{#if isRecent}
									<button
										class="image-button"
										class:image-button--missing={!summary.hasCheckin}
										on:click={() => openImageModal(booking.id, 'CHECK_IN', `Check-in bilder – ${getDate(booking.startTime)}`)}
										title={summary.hasCheckin ? 'Se check-in bilder' : 'Mangler check-in bilde'}
									>
										Inn {summary.hasCheckin ? '' : '⚠'}
									</button>
									<button
										class="image-button"
										class:image-button--missing={!summary.hasCheckout}
										on:click={() => openImageModal(booking.id, 'CHECK_OUT', `Check-out bilder – ${getDate(booking.startTime)}`)}
										title={summary.hasCheckout ? 'Se check-out bilder' : 'Mangler check-out bilde'}
									>
										Ut {summary.hasCheckout ? '' : '⚠'}
									</button>
								{/if}
								<button
									class="delete-button"
									on:click={() => handleDeleteBooking(booking.id)}
									disabled={$deleteBookingLoading && deletingBookingId === booking.id}
								>
									{#if $deleteBookingLoading && deletingBookingId === booking.id}
										<Spinner size="small" inline />
									{:else}
										Slett
									{/if}
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="no-bookings">Ingen bookinger funnet</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>

{#if imageModalOpen}
	<div class="modal-backdrop" on:click={() => (imageModalOpen = false)} role="dialog" aria-modal="true">
		<div class="image-modal" on:click|stopPropagation>
			<h3 class="modal-title">{imageModalTitle}</h3>
			{#if imageModalImages.length === 0}
				<p class="no-images">Ingen bilder lastet opp.</p>
			{:else}
				<div class="modal-image-grid">
					{#each imageModalImages as img (img.id)}
						<div class="modal-image-card">
							{#if imageModalBlobUrls[img.id]}
								<a href={imageModalBlobUrls[img.id]} download={img.filename} target="_blank">
									<img src={imageModalBlobUrls[img.id]} alt="Bilde" class="modal-thumb" />
								</a>
								<p class="img-timestamp">{new Date(img.uploadedAt).toLocaleString('nb-NO')}</p>
								<a href={imageModalBlobUrls[img.id]} download={img.filename} class="download-link">Last ned</a>
							{:else}
								<div class="modal-thumb-placeholder" />
								<p class="img-timestamp">Laster...</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<button class="close-button" on:click={() => (imageModalOpen = false)}>Lukk</button>
		</div>
	</div>
{/if}

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.rules-panel {
		margin: 0 10px;
		background-color: var(--bg-card);
		padding: 32px;
		border-radius: 10px;
	}

	.rule-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border: 1px solid var(--bg-card-alt);
		border-radius: 8px;
		margin-bottom: 0.75rem;
	}

	.rule-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.rule-name {
		font-weight: 600;
		color: var(--text-body);
	}

	.rule-description {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 26px;
		flex-shrink: 0;
	}

	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		inset: 0;
		background-color: var(--border-color);
		border-radius: 26px;
		transition: background-color 0.2s;
	}

	.toggle-slider::before {
		content: '';
		position: absolute;
		height: 20px;
		width: 20px;
		left: 3px;
		bottom: 3px;
		background-color: var(--bg-card);
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.toggle-switch input:checked + .toggle-slider {
		background-color: var(--color-primary);
	}

	.toggle-switch input:checked + .toggle-slider::before {
		transform: translateX(22px);
	}

	.row--missing-images {
		background-color: color-mix(in srgb, #e67e22 8%, transparent);
	}

	.image-button {
		background-color: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: 5px;
		padding: 0.3rem 0.6rem;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		margin-right: 0.25rem;
	}

	.image-button:hover {
		opacity: 0.85;
	}

	.image-button--missing {
		background-color: #e67e22;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.image-modal {
		background: var(--bg-card);
		border-radius: 12px;
		padding: 2rem;
		max-width: 600px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-title {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.1rem;
	}

	.modal-image-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.modal-image-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.modal-thumb {
		width: 120px;
		height: 120px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid var(--border-color, #ddd);
		cursor: pointer;
	}

	.modal-thumb-placeholder {
		width: 120px;
		height: 120px;
		background: var(--bg-card-alt, #eee);
		border-radius: 8px;
		border: 1px solid var(--border-color, #ddd);
	}

	.img-timestamp {
		margin: 0;
		font-size: 0.72rem;
		color: var(--text-secondary);
	}

	.download-link {
		font-size: 0.75rem;
		color: var(--color-primary);
		text-decoration: none;
	}

	.download-link:hover {
		text-decoration: underline;
	}

	.no-images {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.close-button {
		align-self: flex-end;
		background: var(--bg-card-alt);
		border: none;
		border-radius: 6px;
		padding: 0.5rem 1.2rem;
		cursor: pointer;
		font-weight: 600;
	}
</style>
