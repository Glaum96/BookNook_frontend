import { API_BASE_URL } from '$lib/config'

export interface BlockedDate {
	id: string
	date: string
	label?: string
}

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
	const res = await fetch(`${API_BASE_URL}/api/blockedDates`)
	if (!res.ok) return []
	return res.json()
}

export async function addBlockedDate(date: string, label?: string): Promise<BlockedDate | null> {
	const token = localStorage.getItem('authToken')
	const res = await fetch(`${API_BASE_URL}/api/blockedDates`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ date, label: label || undefined })
	})
	if (!res.ok) return null
	return res.json()
}

export async function deleteBlockedDate(id: string): Promise<boolean> {
	const token = localStorage.getItem('authToken')
	const res = await fetch(`${API_BASE_URL}/api/blockedDates/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	})
	return res.ok
}
