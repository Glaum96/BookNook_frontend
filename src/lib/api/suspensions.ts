import { API_BASE_URL } from '$lib/config'
import type { Booking } from '../../types/Booking'
import type { Suspension } from '../../types/Suspension'

const getAuthToken = () => localStorage.getItem('authToken')

export async function fetchMySuspension(): Promise<Suspension | null> {
	try {
		const token = getAuthToken()
		if (!token) return null
		const response = await fetch(`${API_BASE_URL}/api/mySuspension`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!response.ok) return null
		return await response.json()
	} catch {
		return null
	}
}

export async function createSuspension(
	userId: string,
	suspendedUntil: string,
	reason?: string
): Promise<{ success: boolean; suspension?: Suspension; affectedBookings?: Booking[]; error?: string }> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/users/${userId}/suspend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ suspendedUntil, reason: reason ?? null }),
		})
		const data = await response.json()
		if (response.ok) {
			return { success: true, suspension: data.suspension, affectedBookings: data.affectedBookings }
		}
		return { success: false, error: data.error ?? 'Kunne ikke opprette suspensjon.' }
	} catch {
		return { success: false, error: 'Kunne ikke koble til serveren.' }
	}
}

export async function deleteSuspension(userId: string): Promise<boolean> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/users/${userId}/suspend`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` },
		})
		return response.ok
	} catch {
		return false
	}
}

export async function updateSuspension(
	userId: string,
	suspendedUntil: string,
	reason?: string
): Promise<boolean> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/users/${userId}/suspend`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ suspendedUntil, reason: reason ?? null }),
		})
		return response.ok
	} catch {
		return false
	}
}

export async function fetchAllSuspensions(): Promise<Suspension[]> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/suspensions`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!response.ok) return []
		return await response.json()
	} catch {
		return []
	}
}

export function formatSuspensionDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('nb-NO', { dateStyle: 'long' })
}
