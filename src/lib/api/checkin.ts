import { API_BASE_URL } from '$lib/config'
import type { CheckinImage } from '../../types/CheckinImage'

const getAuthToken = () => localStorage.getItem('authToken')
const getUserId = () => localStorage.getItem('userId') ?? ''

export async function fetchCheckinImages(bookingId: string): Promise<CheckinImage[]> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/images`, {
			headers: { Authorization: `Bearer ${token}` }
		})
		if (!response.ok) return []
		return await response.json()
	} catch {
		return []
	}
}

export async function uploadCheckinImage(
	bookingId: string,
	type: 'CHECK_IN' | 'CHECK_OUT',
	file: File
): Promise<{ success: boolean; error?: string }> {
	try {
		const token = getAuthToken()
		const userId = getUserId()
		const formData = new FormData()
		formData.append('file', file)

		const endpoint = type === 'CHECK_IN' ? 'checkin' : 'checkout'
		const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/${endpoint}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'User-Id': userId
			},
			body: formData
		})

		if (response.ok) return { success: true }
		const data = await response.json().catch(() => ({}))
		return { success: false, error: data.error ?? 'Opplasting feilet.' }
	} catch {
		return { success: false, error: 'Kunne ikke koble til serveren.' }
	}
}

export interface BookingCheckinSummary {
	bookingId: string
	hasCheckin: boolean
	hasCheckout: boolean
}

export async function fetchCheckinSummary(): Promise<BookingCheckinSummary[]> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/bookings/checkin-summary`, {
			headers: { Authorization: `Bearer ${token}` }
		})
		if (!response.ok) return []
		return await response.json()
	} catch {
		return []
	}
}

export async function deleteCheckinImage(imageId: string): Promise<{ success: boolean; error?: string }> {
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		})
		if (response.ok) return { success: true }
		const data = await response.json().catch(() => ({}))
		return { success: false, error: data.error ?? 'Sletting feilet.' }
	} catch {
		return { success: false, error: 'Kunne ikke koble til serveren.' }
	}
}
