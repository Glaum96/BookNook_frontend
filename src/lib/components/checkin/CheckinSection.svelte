<script lang="ts">
	import { onMount } from 'svelte'
	import type { Booking } from '../../../types/Booking'
	import type { CheckinImage } from '../../../types/CheckinImage'
	import { fetchCheckinImages, uploadCheckinImage, deleteCheckinImage } from '$lib/api/checkin'
	import { API_BASE_URL } from '$lib/config'
	import Spinner from '../spinner/Spinner.svelte'

	export let booking: Booking
	export let isLatestBooking: boolean = false

	let checkinImages: CheckinImage[] = []
	let checkoutImages: CheckinImage[] = []
	let uploadingCheckin = false
	let uploadingCheckout = false
	let deletingImageId: string | null = null
	let checkinError = ''
	let checkoutError = ''
	let checkinSuccess = ''
	let checkoutSuccess = ''
	let blobUrls: Record<string, string> = {}

	const currentUserId = () => localStorage.getItem('userId') ?? ''

	function showSuccess(type: 'CHECK_IN' | 'CHECK_OUT', msg: string) {
		if (type === 'CHECK_IN') {
			checkinSuccess = msg
			setTimeout(() => (checkinSuccess = ''), 3000)
		} else {
			checkoutSuccess = msg
			setTimeout(() => (checkoutSuccess = ''), 3000)
		}
	}

	const FIVE_MINUTES = 5 * 60 * 1000

	$: canCheckin = new Date() <= new Date(new Date(booking.startTime).getTime() + FIVE_MINUTES)
	$: canCheckout = isLatestBooking && new Date() >= new Date(new Date(booking.endTime).getTime() - FIVE_MINUTES)
	$: showSection = canCheckin || canCheckout

	onMount(async () => {
		const images = await fetchCheckinImages(booking.id)
		checkinImages = images.filter((i) => i.type === 'CHECK_IN')
		checkoutImages = images.filter((i) => i.type === 'CHECK_OUT')
		await loadImagePreviews(images)
	})

	async function loadImagePreviews(images: CheckinImage[]) {
		const token = localStorage.getItem('authToken')
		for (const img of images) {
			if (blobUrls[img.id]) continue
			try {
				const res = await fetch(`${API_BASE_URL}/api/images/${img.id}`, {
					headers: { Authorization: `Bearer ${token}` }
				})
				if (res.ok) {
					const blob = await res.blob()
					blobUrls[img.id] = URL.createObjectURL(blob)
					blobUrls = { ...blobUrls }
				}
			} catch {
				// bilde ikke tilgjengelig
			}
		}
	}

	async function handleUpload(type: 'CHECK_IN' | 'CHECK_OUT', event: Event) {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]
		if (!file) return

		if (type === 'CHECK_IN') {
			uploadingCheckin = true
			checkinError = ''
		} else {
			uploadingCheckout = true
			checkoutError = ''
		}

		const result = await uploadCheckinImage(booking.id, type, file)

		if (result.success) {
			const images = await fetchCheckinImages(booking.id)
			const newImages = images.filter((i) => i.type === type && !blobUrls[i.id])
			checkinImages = images.filter((i) => i.type === 'CHECK_IN')
			checkoutImages = images.filter((i) => i.type === 'CHECK_OUT')
			await loadImagePreviews(newImages)
			showSuccess(type, 'Bildet ble lastet opp.')
		} else {
			if (type === 'CHECK_IN') checkinError = result.error ?? 'Feil ved opplasting.'
			else checkoutError = result.error ?? 'Feil ved opplasting.'
		}

		if (type === 'CHECK_IN') uploadingCheckin = false
		else uploadingCheckout = false

		input.value = ''
	}

	async function handleDelete(img: CheckinImage) {
		deletingImageId = img.id
		const result = await deleteCheckinImage(img.id)
		if (result.success) {
			if (blobUrls[img.id]) URL.revokeObjectURL(blobUrls[img.id])
			const { [img.id]: _, ...rest } = blobUrls
			blobUrls = rest
			checkinImages = checkinImages.filter((i) => i.id !== img.id)
			checkoutImages = checkoutImages.filter((i) => i.id !== img.id)
		} else {
			if (img.type === 'CHECK_IN') checkinError = result.error ?? 'Sletting feilet.'
			else checkoutError = result.error ?? 'Sletting feilet.'
		}
		deletingImageId = null
	}
</script>

{#if showSection}
	<div class="checkin-section">
		{#if canCheckin}
			<div class="checkin-block">
				<p class="checkin-label">Check-in bilder ({checkinImages.length})</p>
				{#if checkinImages.length === 0}
					<p class="feedback feedback--warning">&#x26A0; Ingen check-in bilder lastet opp ennå.</p>
				{:else}
					<div class="image-row">
						{#each checkinImages as img (img.id)}
							<div class="image-wrapper">
								{#if blobUrls[img.id]}
									<a href={blobUrls[img.id]} download={img.filename} target="_blank">
										<img
											src={blobUrls[img.id]}
											alt="Check-in bilde"
											class="thumbnail"
											title={new Date(img.uploadedAt).toLocaleString('nb-NO')}
										/>
									</a>
								{:else}
									<div class="thumbnail-placeholder" />
								{/if}
								{#if img.userId === currentUserId()}
									<button
										class="delete-img-btn"
										title="Slett bilde"
										disabled={deletingImageId === img.id}
										on:click={() => handleDelete(img)}
									>
										{#if deletingImageId === img.id}
											<Spinner size="small" inline />
										{:else}
											&#x2715;
										{/if}
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
				{#if checkinError}
					<p class="feedback feedback--error">&#x26A0; {checkinError}</p>
				{:else if checkinSuccess}
					<p class="feedback feedback--success">&#x2713; {checkinSuccess}</p>
				{/if}
				<label class="upload-label">
					{#if uploadingCheckin}
						<Spinner size="small" inline />
						Laster opp...
					{:else}
						+ Last opp check-in bilde
						<input
							type="file"
							accept="image/*"
							class="file-input"
							on:change={(e) => handleUpload('CHECK_IN', e)}
							disabled={uploadingCheckin}
						/>
					{/if}
				</label>
			</div>
		{/if}

		{#if canCheckout}
			<div class="checkin-block">
				<p class="checkin-label">Check-out bilder ({checkoutImages.length})</p>
				{#if checkoutImages.length === 0}
					<p class="feedback feedback--warning">&#x26A0; Ingen check-out bilder lastet opp ennå.</p>
				{:else}
					<div class="image-row">
						{#each checkoutImages as img (img.id)}
							<div class="image-wrapper">
								{#if blobUrls[img.id]}
									<a href={blobUrls[img.id]} download={img.filename} target="_blank">
										<img
											src={blobUrls[img.id]}
											alt="Check-out bilde"
											class="thumbnail"
											title={new Date(img.uploadedAt).toLocaleString('nb-NO')}
										/>
									</a>
								{:else}
									<div class="thumbnail-placeholder" />
								{/if}
								{#if img.userId === currentUserId()}
									<button
										class="delete-img-btn"
										title="Slett bilde"
										disabled={deletingImageId === img.id}
										on:click={() => handleDelete(img)}
									>
										{#if deletingImageId === img.id}
											<Spinner size="small" inline />
										{:else}
											&#x2715;
										{/if}
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
				{#if checkoutError}
					<p class="feedback feedback--error">&#x26A0; {checkoutError}</p>
				{:else if checkoutSuccess}
					<p class="feedback feedback--success">&#x2713; {checkoutSuccess}</p>
				{/if}
				<label class="upload-label">
					{#if uploadingCheckout}
						<Spinner size="small" inline />
						Laster opp...
					{:else}
						+ Last opp check-out bilde
						<input
							type="file"
							accept="image/*"
							class="file-input"
							on:change={(e) => handleUpload('CHECK_OUT', e)}
							disabled={uploadingCheckout}
						/>
					{/if}
				</label>
			</div>
		{/if}
	</div>
{/if}

<style>
	.checkin-section {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color, #e0e0e0);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.checkin-block {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.checkin-label {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-secondary, #666);
	}

	.image-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.image-wrapper {
		position: relative;
		display: inline-block;
	}

	.delete-img-btn {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: var(--color-danger-text, #c0392b);
		color: #fff;
		font-size: 0.65rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.image-wrapper:hover .delete-img-btn {
		opacity: 1;
	}

	.delete-img-btn:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.thumbnail {
		width: 64px;
		height: 64px;
		object-fit: cover;
		border-radius: 6px;
		border: 1px solid var(--border-color, #ddd);
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.thumbnail:hover {
		opacity: 0.8;
	}

	.thumbnail-placeholder {
		width: 64px;
		height: 64px;
		background: var(--bg-card, #eee);
		border-radius: 6px;
		border: 1px solid var(--border-color, #ddd);
	}

	.upload-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		color: var(--color-primary);
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.4rem 0.75rem;
		border: 1px dashed var(--color-primary);
		border-radius: 6px;
		width: fit-content;
		transition: background-color 0.15s;
	}

	.upload-label:hover {
		background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
	}

	.file-input {
		display: none;
	}

	.feedback {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 500;
		padding: 0.4rem 0.65rem;
		border-radius: 6px;
		width: fit-content;
	}

	.feedback--error {
		background-color: color-mix(in srgb, var(--color-danger-text, #c0392b) 12%, transparent);
		color: var(--color-danger-text, #c0392b);
		border: 1px solid color-mix(in srgb, var(--color-danger-text, #c0392b) 30%, transparent);
	}

	.feedback--success {
		background-color: color-mix(in srgb, #27ae60 12%, transparent);
		color: #1a7a40;
		border: 1px solid color-mix(in srgb, #27ae60 30%, transparent);
	}

	.feedback--warning {
		background-color: color-mix(in srgb, #e67e22 12%, transparent);
		color: #a04000;
		border: 1px solid color-mix(in srgb, #e67e22 30%, transparent);
	}
</style>
