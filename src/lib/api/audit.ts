import { API_BASE_URL } from '$lib/config'

export interface AuditLog {
	id: string
	timestamp: string
	action: string
	performedByUserId: string
	performedByName: string
	targetId: string
	details: string
}

const ACTION_LABELS: Record<string, string> = {
	BOOKING_CREATED: 'Booking opprettet',
	BOOKING_UPDATED: 'Booking endret',
	BOOKING_DELETED: 'Booking slettet',
	USER_REGISTERED: 'Bruker registrert',
	USER_UPDATED: 'Bruker oppdatert',
	USER_ADMIN_CHANGED: 'Admin-status endret',
	USER_DELETED: 'Bruker slettet',
	CHECKIN_IMAGE_UPLOADED: 'Check-in bilde lastet opp',
	CHECKOUT_IMAGE_UPLOADED: 'Check-out bilde lastet opp',
	CHECKIN_IMAGE_DELETED: 'Bilde slettet',
	USER_SUSPENDED: 'Bruker suspendert',
	USER_UNSUSPENDED: 'Suspensjon fjernet'
}

export function formatAction(action: string): string {
	return ACTION_LABELS[action] ?? action
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
	try {
		const token = localStorage.getItem('authToken')
		const response = await fetch(`${API_BASE_URL}/api/audit`, {
			headers: { Authorization: `Bearer ${token}` }
		})
		if (!response.ok) return []
		return await response.json()
	} catch {
		return []
	}
}
