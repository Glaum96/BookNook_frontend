<script lang="ts">
	import type { User } from '../../types/User'
	import { onMount } from 'svelte'
	import './admin.css'
	import type { Booking } from '../../types/Booking'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { getDate, getTime } from '$lib/functions/dateFunctions.js'
	import { deleteBooking, fetchAllBookings, updateBooking } from '$lib/api/bookings'
	import { deleteUser, fetchAllUsers, setUserAdmin, updateUser } from '$lib/api/users'
	import { fetchRules, updateRule, type Rule } from '$lib/api/rules'
	import { goto } from '$app/navigation'
	import { base } from '$app/paths'
	import { isLoading } from '../../stores/loading'
	import Spinner from '$lib/components/spinner/Spinner.svelte'
	import { fetchCheckinImages, fetchCheckinSummary, type BookingCheckinSummary } from '$lib/api/checkin'
	import type { CheckinImage } from '../../types/CheckinImage'
	import { API_BASE_URL } from '$lib/config'
	import { getUserFromLocalStorage } from '$lib/api/users'
	import {
		createSuspension,
		deleteSuspension,
		fetchAllSuspensions,
		formatSuspensionDate
	} from '$lib/api/suspensions'
	import type { Suspension } from '../../types/Suspension'
	import {
		fetchBlockedDates,
		addBlockedDate,
		deleteBlockedDate,
		type BlockedDate
	} from '$lib/api/blockedDates'

	const usersLoading = isLoading('users')
	const bookingsLoading = isLoading('bookings')
	const rulesLoading = isLoading('rules')
	const deleteBookingLoading = isLoading('deleteBooking')
	const deleteUserLoading = isLoading('deleteUser')

	// ── Collapsible panels ───────────────────────────────────────────────
	function loadCollapsed(key: string, defaultVal: boolean): boolean {
		try { return JSON.parse(localStorage.getItem(key) ?? String(defaultVal)) } catch { return defaultVal }
	}
	let rulesCollapsed = loadCollapsed('adminCollapsed_rules', false)
	let usersCollapsed = loadCollapsed('adminCollapsed_users', false)
	let bookingsCollapsed = loadCollapsed('adminCollapsed_bookings', false)
	let blockedDatesCollapsed = loadCollapsed('adminCollapsed_blockedDates', false)

	function toggleCollapse(key: string, current: boolean): boolean {
		const next = !current
		localStorage.setItem(key, String(next))
		return next
	}

	let deletingBookingId: string | null = null
	let deletingUserId: string | null = null

	const loggedInUserId = getUserFromLocalStorage()?.id ?? ''

	// ── Image modal ──────────────────────────────────────────────────────────────
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

	// ── Edit user modal ──────────────────────────────────────────────────────────
	let editUserModalOpen = false
	let editUserForm: User = { id: '', name: '', email: '', phoneNumber: '', apartmentNumber: '', admin: false }
	let editUserError = ''
	let editUserSuccess = ''
	let savingUser = false

	function openEditUserModal(user: User) {
		editUserForm = { ...user }
		editUserError = ''
		editUserSuccess = ''
		editUserModalOpen = true
	}

	async function handleSaveUser() {
		savingUser = true
		editUserError = ''
		editUserSuccess = ''
		try {
			await updateUser(editUserForm)
			editUserSuccess = 'Bruker oppdatert.'
			users = users.map((u) => (u.id === editUserForm.id ? { ...editUserForm } : u))
			setTimeout(() => {
				editUserModalOpen = false
				editUserSuccess = ''
			}, 1500)
		} catch {
			editUserError = 'Kunne ikke oppdatere bruker.'
		} finally {
			savingUser = false
		}
	}

	async function handleToggleAdmin(userId: string, isAdmin: boolean) {
		const result = await setUserAdmin(userId, isAdmin)
		if (result.success) {
			users = users.map((u) => (u.id === userId ? { ...u, admin: isAdmin } : u))
			editUserForm = { ...editUserForm, admin: isAdmin }
		} else {
			editUserError = result.error ?? 'Kunne ikke endre admin-status.'
		}
	}

	// ── Edit booking modal ───────────────────────────────────────────────────────
	let editBookingModalOpen = false
	let editBookingForm: Booking = {
		id: '',
		startTime: '',
		endTime: '',
		userId: '',
		responsibleName: '',
		responsibleNumber: ''
	}
	let editBookingDate = ''
	let editBookingStartTime = ''
	let editBookingEndTime = ''
	let editBookingError = ''
	let editBookingSuccess = ''
	let savingBooking = false

	$: editBookingEndBeforeStart = editBookingStartTime && editBookingEndTime && editBookingEndTime <= editBookingStartTime
	$: editBookingDurationHours = (editBookingStartTime && editBookingEndTime && !editBookingEndBeforeStart)
		? (new Date(`2000-01-01T${editBookingEndTime}:00`).getTime() - new Date(`2000-01-01T${editBookingStartTime}:00`).getTime()) / 3_600_000
		: 0
	$: maxDurationRule = rules.find((r) => r.id === 'MAX_BOOKING_DURATION_HOURS' && r.enabled)
	$: editBookingTooLong = !!maxDurationRule && editBookingDurationHours > maxDurationRule.value

	function toLocalDateString(isoString: string): string {
		const d = new Date(isoString)
		return d.toLocaleDateString('sv-SE') // yields YYYY-MM-DD
	}

	function toLocalTimeString(isoString: string): string {
		const d = new Date(isoString)
		return d.toTimeString().slice(0, 5) // HH:MM
	}

	function combineDateAndTime(date: string, time: string): string {
		return new Date(`${date}T${time}:00`).toISOString()
	}

	function openEditBookingModal(booking: Booking) {
		editBookingForm = { ...booking }
		editBookingDate = toLocalDateString(booking.startTime)
		editBookingStartTime = toLocalTimeString(booking.startTime)
		editBookingEndTime = toLocalTimeString(booking.endTime)
		editBookingError = ''
		editBookingSuccess = ''
		editBookingModalOpen = true
	}

	// ── Suspension modal ─────────────────────────────────────────────────────
	let suspensions: Suspension[] = []
	let suspendModalOpen = false
	let suspendTargetUser: User | null = null
	let suspendDays = ''
	let suspendUntilDate = ''
	let suspendReason = ''
	let suspendError = ''
	let savingSuspend = false
	let removingSuspensionUserId: string | null = null

	// Affected bookings modal
	let affectedModalOpen = false
	let affectedBookings: Booking[] = []
	let affectedTargetUserId = ''
	let deletingAffected = false



	function isSuspended(userId: string): boolean {
		return suspensions.some((s) => s.userId === userId)
	}

	function getSuspension(userId: string): Suspension | undefined {
		return suspensions.find((s) => s.userId === userId)
	}

	function openSuspendModal(user: User) {
		suspendTargetUser = user
		suspendDays = ''
		suspendUntilDate = ''
		suspendReason = ''
		suspendError = ''
		suspendModalOpen = true
	}

	function syncDaysToDate() {
		const n = parseInt(suspendDays)
		if (!isNaN(n) && n > 0) {
			const d = new Date()
			d.setDate(d.getDate() + n)
			suspendUntilDate = d.toLocaleDateString('sv-SE')
		}
	}

	function syncDateToDays() {
		if (suspendUntilDate) {
			const diff = new Date(suspendUntilDate).getTime() - Date.now()
			const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
			if (days > 0) suspendDays = String(days)
		}
	}

	async function handleCreateSuspension() {
		if (!suspendTargetUser || !suspendUntilDate) {
			suspendError = 'Velg en sluttdato for suspensjonen.'
			return
		}
		savingSuspend = true
		suspendError = ''
		const until = new Date(`${suspendUntilDate}T23:59:59`).toISOString()
		const result = await createSuspension(suspendTargetUser.id, until, suspendReason || undefined)
		savingSuspend = false
		if (!result.success) {
			suspendError = result.error ?? 'Kunne ikke opprette suspensjon.'
			return
		}
		if (result.suspension) suspensions = [...suspensions, result.suspension]
		suspendModalOpen = false
		if (result.affectedBookings && result.affectedBookings.length > 0) {
			affectedBookings = result.affectedBookings
			affectedTargetUserId = suspendTargetUser.id
			affectedModalOpen = true
		} else {
			location.reload()
		}
	}

	async function handleRemoveSuspension(userId: string) {
		removingSuspensionUserId = userId
		const ok = await deleteSuspension(userId)
		if (ok) {
			location.reload()
		} else {
			removingSuspensionUserId = null
		}
	}

	async function handleDeleteAffectedBookings() {
		deletingAffected = true
		for (const b of affectedBookings) {
			await deleteBooking(b.id)
		}
		location.reload()
	}

	async function handleSaveBooking() {
		if (editBookingEndBeforeStart || editBookingTooLong) return
		savingBooking = true
		editBookingError = ''
		editBookingSuccess = ''
		try {
			const payload: Booking = {
				...editBookingForm,
				startTime: combineDateAndTime(editBookingDate, editBookingStartTime),
				endTime: combineDateAndTime(editBookingDate, editBookingEndTime)
			}
			const result = await updateBooking(payload)
			if (!result.success) {
				editBookingError = result.errors?.join(', ') ?? 'Kunne ikke oppdatere booking.'
				return
			}
			editBookingSuccess = 'Booking oppdatert.'
			bookings = bookings.map((b) => (b.id === payload.id ? { ...payload } : b))
			setTimeout(() => {
				editBookingModalOpen = false
				editBookingSuccess = ''
			}, 1500)
		} catch {
			editBookingError = 'Kunne ikke koble til serveren.'
		} finally {
			savingBooking = false
		}
	}

	onMount(() => {
		globalOnMount()
	})

	let users: User[] = []
	let bookings: Booking[] = []
	let rules: Rule[] = []
	let checkinSummary: Map<string, BookingCheckinSummary> = new Map()
	let blockedDates: BlockedDate[] = []

	// ── Blocked dates form ───────────────────────────────────────────────
	let newBlockedDate = ''
	let newBlockedLabel = ''
	let addingBlockedDate = false
	let blockedDateError = ''

	async function handleAddBlockedDate() {
		if (!newBlockedDate) return
		addingBlockedDate = true
		blockedDateError = ''
		const result = await addBlockedDate(newBlockedDate, newBlockedLabel || undefined)
		if (result) {
			blockedDates = [...blockedDates, result]
			newBlockedDate = ''
			newBlockedLabel = ''
		} else {
			blockedDateError = 'Kunne ikke legge til dato.'
		}
		addingBlockedDate = false
	}

	async function handleDeleteBlockedDate(id: string) {
		const ok = await deleteBlockedDate(id)
		if (ok) blockedDates = blockedDates.filter((d) => d.id !== id)
	}

	onMount(async () => {
		;[bookings, users, rules, suspensions, blockedDates] = await Promise.all([
			fetchAllBookings(),
			fetchAllUsers(),
			fetchRules(),
			fetchAllSuspensions(),
			fetchBlockedDates()
		])
		const summary = await fetchCheckinSummary()
		checkinSummary = new Map(summary.map((s) => [s.bookingId, s]))
	})

	let ruleValues: Record<string, number> = {}
	let savedRuleValues: Record<string, number> = {}
	let savingRuleId: string | null = null
	let rulePeriodTypes: Record<string, string> = {}
	let rulePeriodDays: Record<string, number> = {}
	let savedRulePeriodTypes: Record<string, string> = {}
	let savedRulePeriodDays: Record<string, number> = {}

	$: if (rules.length && Object.keys(ruleValues).length === 0) {
		ruleValues = Object.fromEntries(rules.map((r) => [r.id, r.value]))
		savedRuleValues = { ...ruleValues }
		rulePeriodTypes = Object.fromEntries(rules.map((r) => [r.id, r.periodType ?? 'month']))
		rulePeriodDays = Object.fromEntries(rules.map((r) => [r.id, r.periodDays ?? 30]))
		savedRulePeriodTypes = { ...rulePeriodTypes }
		savedRulePeriodDays = { ...rulePeriodDays }
	}

	function getRuleDescription(rule: Rule): string {
		const v = ruleValues[rule.id] ?? rule.value
		const pt = rulePeriodTypes[rule.id] ?? rule.periodType ?? 'month'
		const pd = rulePeriodDays[rule.id] ?? rule.periodDays ?? 30
		switch (rule.id) {
			case 'MAX_ACTIVE_BOOKINGS': return `Maks antall aktive bookinger per bruker: ${v}`
			case 'MAX_BOOKING_FUTURE_DAYS': return `En booking kan maks opprettes ${v} dager frem i tid`
			case 'MAX_HOURS_PER_PERIOD': {
				const pLabel = pt === 'month' ? 'måneden' : pt === 'quarter' ? 'kvartalet' : pt === 'year' ? 'året' : `${pd} dager`
				return `Maks ${v} timer per ${pLabel}`
			}
			case 'MAX_BOOKING_DURATION_HOURS': return `En booking kan maks vare ${v} timer`
			default: return rule.description
		}
	}

	async function handleToggleRule(rule: Rule) {
		const newEnabled = !rule.enabled
		rules = rules.map((r) => (r.id === rule.id ? { ...r, enabled: newEnabled } : r))
		await updateRule(rule.id, newEnabled, rule.value, rule.periodType, rule.periodDays)
	}

	async function handleSaveRuleValue(rule: Rule) {
		const newValue = ruleValues[rule.id]
		if (!newValue || newValue < 1) return
		savingRuleId = rule.id
		const pt = rulePeriodTypes[rule.id]
		const pd = pt === 'days' ? rulePeriodDays[rule.id] : undefined
		rules = rules.map((r) => (r.id === rule.id ? { ...r, value: newValue, periodType: pt, periodDays: pd } : r))
		await updateRule(rule.id, rule.enabled, newValue, pt, pd)
		savedRuleValues[rule.id] = newValue
		savedRulePeriodTypes[rule.id] = pt
		if (pd != null) savedRulePeriodDays[rule.id] = pd
		savingRuleId = null
	}

	function isPeriodDirty(rule: Rule): boolean {
		if (rule.id !== 'MAX_HOURS_PER_PERIOD') return false
		if (rulePeriodTypes[rule.id] !== savedRulePeriodTypes[rule.id]) return true
		if (rulePeriodTypes[rule.id] === 'days' && rulePeriodDays[rule.id] !== savedRulePeriodDays[rule.id]) return true
		return false
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
	<!-- Page header -->
	<div class="page-header">
		<div>
			<h1 class="page-title">Administrasjon</h1>
			<p class="page-subtitle">Administrer bookinger, brukere og regler</p>
		</div>
		<a href="{base}/logg" on:click|preventDefault={() => goto(`${base}/logg`)} class="logg-link">
			Aktivitetslogg →
		</a>
	</div>

	<!-- Rules -->
	<section class="admin-panel">
		<button class="panel-header panel-header--toggle" on:click={() => (rulesCollapsed = toggleCollapse('adminCollapsed_rules', rulesCollapsed))}>
			<h2 class="panel-title">Regler</h2>
			<div class="panel-header-right">
				<span class="panel-count">{rules.length} regler</span>
				<span class="collapse-arrow" class:collapsed={rulesCollapsed}>▾</span>
			</div>
		</button>
		{#if !rulesCollapsed}
		{#if $rulesLoading && rules.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster regler..." />
			</div>
		{/if}
		<div class="rules-list">
			{#each rules as rule (rule.id)}
				<div class="rule-card">
					<div class="rule-info">
						<span class="rule-name">{rule.name}</span>
						<span class="rule-description">{getRuleDescription(rule)}</span>
					</div>
					<div class="rule-controls">
						<label class="toggle-switch">
							<input type="checkbox" checked={rule.enabled} on:change={() => handleToggleRule(rule)} />
							<span class="toggle-slider"></span>
						</label>
						<input
							class="rule-value-input"
							type="number"
							min="1"
							bind:value={ruleValues[rule.id]}
							disabled={!rule.enabled}
						/>
						{#if rule.id === 'MAX_HOURS_PER_PERIOD'}
							<select
								class="rule-period-select"
								bind:value={rulePeriodTypes[rule.id]}
								disabled={!rule.enabled}
							>
								<option value="month">Per måned</option>
								<option value="quarter">Per kvartal</option>
								<option value="year">Per år</option>
								<option value="days">Egendefinert</option>
							</select>
							{#if rulePeriodTypes[rule.id] === 'days'}
								<input
									class="rule-value-input"
									type="number"
									min="1"
									placeholder="dager"
									bind:value={rulePeriodDays[rule.id]}
									disabled={!rule.enabled}
								/>
							{/if}
						{/if}
						<button
							class="btn-icon rule-save-btn"
							disabled={!rule.enabled || savingRuleId === rule.id || (ruleValues[rule.id] === savedRuleValues[rule.id] && !isPeriodDirty(rule))}
							on:click={() => handleSaveRuleValue(rule)}
						>
							{#if savingRuleId === rule.id}
								<Spinner size="small" inline />
							{:else}
								Lagre
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
		{/if}
	</section>

	<!-- Users -->
	<section class="admin-panel">
		<button class="panel-header panel-header--toggle" on:click={() => (usersCollapsed = toggleCollapse('adminCollapsed_users', usersCollapsed))}>
			<h2 class="panel-title">Brukere</h2>
			<div class="panel-header-right">
				<span class="panel-count">{users.length} brukere</span>
				<span class="collapse-arrow" class:collapsed={usersCollapsed}>▾</span>
			</div>
		</button>
		{#if !usersCollapsed}
		{#if $usersLoading && users.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster brukere..." />
			</div>
		{:else}
			<table class="admin-table">
				<thead>
					<tr>
						<th>Navn</th>
						<th>E-post</th>
						<th>Leilighet</th>
						<th>Rolle</th>
						<th class="col-actions"></th>
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.id)}
						<tr>
							<td class="col-name">{user.name}</td>
							<td class="col-muted">{user.email}</td>
							<td>{user.apartmentNumber}</td>
							<td>
								{#if user.admin}
									<span class="badge-admin">Admin</span>
								{/if}
								{#if isSuspended(user.id)}
									<span class="badge-suspended" title="Suspendert frem til {formatSuspensionDate(getSuspension(user.id)?.suspendedUntil ?? '')}">Suspendert</span>
								{/if}
								{#if !user.admin && !isSuspended(user.id)}
									<span class="col-muted">—</span>
								{/if}
							</td>
							<td class="col-actions">
								<div class="action-group">
									<button class="btn-icon" on:click={() => openEditUserModal(user)}>Rediger</button>
									{#if isSuspended(user.id)}
										<button
											class="btn-icon btn-icon--warning"
											on:click={() => handleRemoveSuspension(user.id)}
											disabled={removingSuspensionUserId === user.id}
										>
											{#if removingSuspensionUserId === user.id}
												<Spinner size="small" inline />
											{:else}
												Fjern suspensjon
											{/if}
										</button>
									{:else}
										<button
											class="btn-icon"
											on:click={() => openSuspendModal(user)}
										>Suspender</button>
									{/if}
									<button
										class="btn-icon btn-icon--danger"
										on:click={() => handleDeleteUser(user.id)}
										disabled={$deleteUserLoading && deletingUserId === user.id}
									>
										{#if $deleteUserLoading && deletingUserId === user.id}
											<Spinner size="small" inline />
										{:else}
											Slett
										{/if}
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="empty-state">Ingen brukere funnet</td></tr>
					{/each}
				</tbody>
			</table>
		{/if}
		{/if}
	</section>

	<!-- Bookings -->
	<section class="admin-panel">
		<button class="panel-header panel-header--toggle" on:click={() => (bookingsCollapsed = toggleCollapse('adminCollapsed_bookings', bookingsCollapsed))}>
			<h2 class="panel-title">Bookinger</h2>
			<div class="panel-header-right">
				<span class="panel-count">{bookings.length} bookinger</span>
				<span class="collapse-arrow" class:collapsed={bookingsCollapsed}>▾</span>
			</div>
		</button>
		{#if !bookingsCollapsed}
		{#if $bookingsLoading && bookings.length === 0}
			<div class="loading-container">
				<Spinner size="medium" label="Laster bookinger..." />
			</div>
		{:else}
			<table class="admin-table">
				<thead>
					<tr>
						<th>Dato</th>
						<th>Tidspunkt</th>
						<th>Ansvarlig</th>
						<th>Telefon</th>
						<th class="col-actions"></th>
					</tr>
				</thead>
				<tbody>
					{#each bookings as booking (booking.id)}
						{@const summary = checkinSummary.get(booking.id)}
						{@const isRecent = summary !== undefined}
						{@const missingImages = isRecent && (!summary.hasCheckin || !summary.hasCheckout)}
						<tr class={missingImages ? 'row--missing-images' : ''}>
							<td class="col-date">{getDate(booking.startTime)}</td>
							<td class="col-time">{getTime(booking.startTime)}–{getTime(booking.endTime)}</td>
							<td>{booking.responsibleName}</td>
							<td class="col-muted">{booking.responsibleNumber}</td>
							<td class="col-actions">
								<div class="action-group">
									{#if isRecent}
										<button
											class="checkin-pill"
											class:checkin-pill--ok={summary.hasCheckin}
											class:checkin-pill--missing={!summary.hasCheckin}
											on:click={() => openImageModal(booking.id, 'CHECK_IN', `Check-in – ${getDate(booking.startTime)}`)}
											title={summary.hasCheckin ? 'Se check-in bilder' : 'Mangler check-in bilde'}
										>
											Inn {summary.hasCheckin ? '✓' : '⚠'}
										</button>
										<button
											class="checkin-pill"
											class:checkin-pill--ok={summary.hasCheckout}
											class:checkin-pill--missing={!summary.hasCheckout}
											on:click={() => openImageModal(booking.id, 'CHECK_OUT', `Check-out – ${getDate(booking.startTime)}`)}
											title={summary.hasCheckout ? 'Se check-out bilder' : 'Mangler check-out bilde'}
										>
											Ut {summary.hasCheckout ? '✓' : '⚠'}
										</button>
									{/if}
									<button class="btn-icon" on:click={() => openEditBookingModal(booking)}>Rediger</button>
									<button
										class="btn-icon btn-icon--danger"
										on:click={() => handleDeleteBooking(booking.id)}
										disabled={$deleteBookingLoading && deletingBookingId === booking.id}
									>
										{#if $deleteBookingLoading && deletingBookingId === booking.id}
											<Spinner size="small" inline />
										{:else}
											Slett
										{/if}
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="empty-state">Ingen bookinger funnet</td></tr>
					{/each}
				</tbody>
			</table>
		{/if}
		{/if}
	</section>

	<!-- Blocked dates -->
	<section class="admin-panel">
		<button class="panel-header panel-header--toggle" on:click={() => (blockedDatesCollapsed = toggleCollapse('adminCollapsed_blockedDates', blockedDatesCollapsed))}>
			<h2 class="panel-title">Reserverte datoer</h2>
			<div class="panel-header-right">
				<span class="panel-count">{blockedDates.length} datoer</span>
				<span class="collapse-arrow" class:collapsed={blockedDatesCollapsed}>▾</span>
			</div>
		</button>
		{#if !blockedDatesCollapsed}
		<div class="blocked-dates-body">
			<form class="blocked-date-form" on:submit|preventDefault={handleAddBlockedDate}>
				<input
					class="form-input"
					type="date"
					bind:value={newBlockedDate}
					required
					disabled={addingBlockedDate}
				/>
				<input
					class="form-input"
					type="text"
					bind:value={newBlockedLabel}
					placeholder="Etikett (valgfri, f.eks. 17. mai)"
					disabled={addingBlockedDate}
				/>
				<button class="btn-icon" type="submit" disabled={addingBlockedDate || !newBlockedDate}>
					{#if addingBlockedDate}<Spinner size="small" inline />{:else}Legg til{/if}
				</button>
			</form>
			{#if blockedDateError}
				<p class="blocked-date-error">{blockedDateError}</p>
			{/if}
			{#if blockedDates.length === 0}
				<p class="empty-state">Ingen reserverte datoer</p>
			{:else}
				<ul class="blocked-date-list">
					{#each blockedDates.sort((a, b) => a.date.localeCompare(b.date)) as bd (bd.id)}
						<li class="blocked-date-item">
							<span class="blocked-date-date">{bd.date}</span>
							{#if bd.label}<span class="blocked-date-label">{bd.label}</span>{/if}
							<button class="btn-icon btn-icon--danger" on:click={() => handleDeleteBlockedDate(bd.id)}>Fjern</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		{/if}
	</section>
</div>

<!-- Image modal -->
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

<!-- Edit user modal -->
{#if editUserModalOpen}
	<div class="modal-backdrop" on:click={() => (editUserModalOpen = false)} role="dialog" aria-modal="true">
		<div class="edit-modal" on:click|stopPropagation>
			<h3 class="modal-title">Rediger bruker</h3>
			{#if editUserError}
				<p class="feedback feedback--error">{editUserError}</p>
			{/if}
			{#if editUserSuccess}
				<p class="feedback feedback--success">{editUserSuccess}</p>
			{/if}
			<div class="form-grid">
				<div class="form-row-2">
					<label class="form-label">
						Navn
						<input class="form-input" type="text" bind:value={editUserForm.name} />
					</label>
					<label class="form-label">
						E-post
						<input class="form-input" type="email" bind:value={editUserForm.email} />
					</label>
				</div>
				<div class="form-row-2">
					<label class="form-label">
						Telefonnummer
						<input class="form-input" type="text" bind:value={editUserForm.phoneNumber} />
					</label>
					<label class="form-label">
						Leilighetsnummer
						<input class="form-input" type="text" bind:value={editUserForm.apartmentNumber} />
					</label>
				</div>
				{#if editUserForm.id !== loggedInUserId}
					<div class="admin-toggle-row">
						<div>
							<span class="form-label-text">Admin-tilgang</span>
							<p class="form-hint">Gir tilgang til dette admin-panelet</p>
						</div>
						<label class="toggle-switch">
							<input
								type="checkbox"
								checked={editUserForm.admin}
								on:change={() => handleToggleAdmin(editUserForm.id, !editUserForm.admin)}
							/>
							<span class="toggle-slider"></span>
						</label>
					</div>
				{/if}
			</div>
			<div class="modal-actions">
				<button class="cancel-button" on:click={() => (editUserModalOpen = false)}>Avbryt</button>
				<button class="save-button" on:click={handleSaveUser} disabled={savingUser}>
					{#if savingUser}<Spinner size="small" inline />{:else}Lagre endringer{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Edit booking modal -->
{#if editBookingModalOpen}
	<div class="modal-backdrop" on:click={() => (editBookingModalOpen = false)} role="dialog" aria-modal="true">
		<div class="edit-modal" on:click|stopPropagation>
			<h3 class="modal-title">Rediger booking</h3>
			{#if editBookingError}
				<p class="feedback feedback--error">{editBookingError}</p>
			{/if}
			{#if editBookingSuccess}
				<p class="feedback feedback--success">{editBookingSuccess}</p>
			{/if}
			<div class="form-grid">
				<label class="form-label">
					Dato
					<input class="form-input" type="date" bind:value={editBookingDate} />
				</label>
				<div class="form-row-2">
					<label class="form-label">
						Starttidspunkt
						<input class="form-input" type="time" bind:value={editBookingStartTime} />
					</label>
					<label class="form-label">
						Sluttidspunkt
						<input class="form-input" type="time" bind:value={editBookingEndTime} />
					</label>
				</div>
				{#if editBookingEndBeforeStart}
					<p class="feedback feedback--error">Sluttidspunkt må være etter starttidspunkt</p>
				{:else if editBookingTooLong}
					<p class="feedback feedback--error">Bookingen er for lang — maks {maxDurationRule?.value} timer</p>
				{/if}
				<div class="form-divider"></div>
				<label class="form-label">
					Ansvarlig bruker
					<select class="form-input" bind:value={editBookingForm.userId} on:change={() => {
						const u = users.find((u) => u.id === editBookingForm.userId)
						if (u) {
							editBookingForm.responsibleName = u.name
							editBookingForm.responsibleNumber = u.phoneNumber
						}
					}}>
						{#each users as u (u.id)}
							<option value={u.id}>{u.name} ({u.apartmentNumber})</option>
						{/each}
					</select>
				</label>
				<div class="form-row-2">
					<label class="form-label">
						Navn (overstyring)
						<input class="form-input" type="text" bind:value={editBookingForm.responsibleName} />
					</label>
					<label class="form-label">
						Telefon (overstyring)
						<input class="form-input" type="text" bind:value={editBookingForm.responsibleNumber} />
					</label>
				</div>
			</div>
			<div class="modal-actions">
				<button class="cancel-button" on:click={() => (editBookingModalOpen = false)}>Avbryt</button>
				<button class="save-button" on:click={handleSaveBooking} disabled={savingBooking || !!editBookingEndBeforeStart || editBookingTooLong}>
					{#if savingBooking}<Spinner size="small" inline />{:else}Lagre endringer{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Suspend user modal -->
{#if suspendModalOpen && suspendTargetUser}
	<div class="modal-backdrop" on:click={() => (suspendModalOpen = false)} role="dialog" aria-modal="true">
		<div class="edit-modal" on:click|stopPropagation>
			<h3 class="modal-title">Suspender {suspendTargetUser.name}</h3>
			{#if suspendError}
				<p class="feedback feedback--error">{suspendError}</p>
			{/if}
			<div class="form-grid">
				<p class="suspend-help">Velg hvor lenge brukeren skal være suspendert fra å opprette nye bookinger.</p>
				<div class="form-row-2">
					<label class="form-label">
						Antall dager
						<input
							class="form-input"
							type="number"
							min="1"
							bind:value={suspendDays}
							on:input={syncDaysToDate}
							placeholder="f.eks. 14"
						/>
					</label>
					<label class="form-label">
						Eller velg dato
						<input
							class="form-input"
							type="date"
							bind:value={suspendUntilDate}
							min={new Date().toLocaleDateString('sv-SE')}
							on:change={syncDateToDays}
						/>
					</label>
				</div>
				<label class="form-label">
					Årsak (valgfritt)
					<input class="form-input" type="text" bind:value={suspendReason} placeholder="Angis til brukeren" />
				</label>
			</div>
			<div class="modal-actions">
				<button class="cancel-button" on:click={() => (suspendModalOpen = false)}>Avbryt</button>
				<button class="save-button save-button--warning" on:click={handleCreateSuspension} disabled={savingSuspend}>
					{#if savingSuspend}<Spinner size="small" inline />{:else}Suspender{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Affected bookings modal -->
{#if affectedModalOpen}
	<div class="modal-backdrop" on:click={() => (affectedModalOpen = false)} role="dialog" aria-modal="true">
		<div class="edit-modal" on:click|stopPropagation>
			<h3 class="modal-title">Berørte bookinger</h3>
			<p class="suspend-help">
				Brukeren har <strong>{affectedBookings.length}</strong> booking{affectedBookings.length !== 1 ? 'er' : ''} som overlapper med suspensjonsperioden:
			</p>
			<ul class="affected-list">
				{#each affectedBookings as b (b.id)}
					<li>{getDate(b.startTime)} kl. {getTime(b.startTime)}–{getTime(b.endTime)}</li>
				{/each}
			</ul>
			<p class="suspend-help">Vil du slette disse bookingene?</p>
			<div class="modal-actions">
				<button class="cancel-button" on:click={() => location.reload()}>Behold dem</button>
				<button class="save-button save-button--danger" on:click={handleDeleteAffectedBookings} disabled={deletingAffected}>
					{#if deletingAffected}<Spinner size="small" inline />{:else}Slett bookinger{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ── Page header ─────────────────────────────────────────────────────── */
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.5rem 0 0.25rem;
	}

	.page-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-body);
		text-align: left;
	}

	.page-subtitle {
		margin: 0.2rem 0 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.logg-link {
		color: var(--color-primary);
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		padding: 0.45rem 0.9rem;
		border: 1.5px solid var(--color-primary);
		border-radius: 8px;
		white-space: nowrap;
		transition: background 0.12s;
	}

	.logg-link:hover {
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
		text-decoration: none;
	}

	/* ── Rules list ──────────────────────────────────────────────────────── */
	.rules-list {
		padding: 0.5rem 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rule-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border-separator);
		border-radius: 8px;
		background: var(--bg-page);
	}

	.rule-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.rule-name {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-body);
	}

	.rule-description {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	/* ── Toggle switch ───────────────────────────────────────────────────── */
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

	/* ── Table column tweaks ─────────────────────────────────────────────── */
	.col-name {
		font-weight: 600;
	}

	.col-muted {
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.col-date {
		font-weight: 600;
		white-space: nowrap;
	}

	.col-time {
		white-space: nowrap;
		color: var(--text-secondary);
	}

	/* ── Modal backdrop ──────────────────────────────────────────────────── */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: var(--shadow-overlay);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	/* ── Image modal ─────────────────────────────────────────────────────── */
	.image-modal {
		background: var(--bg-card);
		border-radius: 14px;
		padding: 2rem;
		max-width: 600px;
		width: 100%;
		max-height: 85vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-shadow: 0 8px 32px var(--shadow-md);
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
		gap: 0.3rem;
	}

	.modal-thumb {
		width: 130px;
		height: 130px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid var(--border-light);
		cursor: pointer;
	}

	.modal-thumb-placeholder {
		width: 130px;
		height: 130px;
		background: var(--bg-card-alt);
		border-radius: 8px;
		border: 1px solid var(--border-light);
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
		margin: 0;
	}

	.close-button {
		align-self: flex-end;
		background: var(--bg-card-alt);
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1.25rem;
		cursor: pointer;
		font-weight: 600;
		color: var(--text-body);
		font-size: 0.9rem;
	}

	/* ── Edit modal ──────────────────────────────────────────────────────── */
	.edit-modal {
		background: var(--bg-card);
		border-radius: 14px;
		padding: 2rem;
		max-width: 520px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: 0 8px 32px var(--shadow-md);
	}

	.modal-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-body);
	}

	/* ── Form ────────────────────────────────────────────────────────────── */
	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-row-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.form-divider {
		height: 1px;
		background: var(--border-separator);
	}

	.form-label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.form-label-text {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text-body);
	}

	.form-hint {
		margin: 0.15rem 0 0;
		font-size: 0.75rem;
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
		color: var(--text-muted);
	}

	.form-input {
		padding: 0.5rem 0.7rem;
		border: 1.5px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 400;
		background: var(--bg-page);
		color: var(--text-body);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--focus-ring);
	}

	.admin-toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: var(--bg-card-alt);
		border-radius: 8px;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding-top: 0.25rem;
		border-top: 1px solid var(--border-separator);
	}

	.cancel-button {
		background: transparent;
		border: 1.5px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem 1.25rem;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-body);
	}

	.cancel-button:hover {
		background: var(--hover-bg);
	}

	.save-button {
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1.4rem;
		cursor: pointer;
		font-weight: 700;
		font-size: 0.9rem;
		min-width: 130px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
	}

	.save-button:hover {
		opacity: 0.9;
	}

	.save-button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.save-button--warning {
		background: #e67e22;
	}

	.save-button--danger {
		background: var(--color-danger-text, #c0392b);
	}

	.btn-icon--warning {
		border-color: color-mix(in srgb, #e67e22 50%, transparent);
		color: #a04000;
	}

	.btn-icon--warning:hover {
		background: color-mix(in srgb, #e67e22 10%, transparent);
		color: #a04000;
	}

	.suspend-help {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.affected-list {
		margin: 0;
		padding: 0 0 0 1.2rem;
		font-size: 0.9rem;
		color: var(--text-body);
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	/* ── Feedback messages ───────────────────────────────────────────────── */
	.feedback {
		padding: 0.6rem 0.85rem;
		border-radius: 8px;
		font-size: 0.85rem;
		margin: 0;
	}

	.feedback--error {
		background: var(--color-error-bg);
		color: var(--color-error);
		border: 1px solid var(--color-error-border);
	}

	.feedback--success {
		background: color-mix(in srgb, #27ae60 10%, transparent);
		color: var(--color-success);
		border: 1px solid color-mix(in srgb, #27ae60 30%, transparent);
	}

	/* ── Responsive ──────────────────────────────────────────────────────── */
	@media (max-width: 600px) {
		.form-row-2 {
			grid-template-columns: 1fr;
		}
	}

	/* keep existing loading-container in case spinner needs it here */
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

	.rule-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	.rule-value-input {
		width: 70px;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		font-size: 1rem;
		text-align: center;
		background-color: var(--bg-input);
		color: var(--text-body);
	}

	.rule-value-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.rule-save-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.rule-period-select {
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		font-size: 0.9rem;
		background-color: var(--bg-input);
		color: var(--text-body);
	}

	.rule-period-select:disabled {
		opacity: 0.4;
		cursor: not-allowed;
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

	.edit-button {
		background-color: var(--bg-card-alt);
		color: var(--text-body);
		border: 1px solid var(--border-color, #ccc);
		border-radius: 5px;
		padding: 0.3rem 0.7rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		margin-right: 0.25rem;
		white-space: nowrap;
	}

	.edit-button:hover {
		opacity: 0.8;
	}

	.admin-top-bar {
		display: flex;
		justify-content: flex-end;
	}

	.logg-link {
		color: var(--color-primary);
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--color-primary);
		border-radius: 6px;
	}

	.logg-link:hover {
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
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

	.edit-modal {
		background: var(--bg-card);
		border-radius: 12px;
		padding: 2rem;
		max-width: 480px;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.modal-title {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.1rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.form-label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-body);
	}

	.form-label-text {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-body);
	}

	.form-input {
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--border-color, #ccc);
		border-radius: 6px;
		font-size: 0.95rem;
		background: var(--bg-card-alt);
		color: var(--text-body);
	}

	.admin-toggle-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.cancel-button {
		background: var(--bg-card-alt);
		border: none;
		border-radius: 6px;
		padding: 0.5rem 1.2rem;
		cursor: pointer;
		font-weight: 600;
		color: var(--text-body);
	}

	.save-button {
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.5rem 1.4rem;
		cursor: pointer;
		font-weight: 600;
		min-width: 80px;
	}

	.save-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.feedback {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin: 0;
	}

	.feedback--error {
		background: color-mix(in srgb, #c0392b 12%, transparent);
		color: #c0392b;
		border: 1px solid color-mix(in srgb, #c0392b 30%, transparent);
	}

	.feedback--success {
		background: color-mix(in srgb, #27ae60 12%, transparent);
		color: #1a7a40;
		border: 1px solid color-mix(in srgb, #27ae60 30%, transparent);
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
