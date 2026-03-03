import { API_BASE_URL } from '$lib/config'

export interface Rule {
	id: string
	name: string
	description: string
	enabled: boolean
	value: number
}

const getAuthToken = () => localStorage.getItem('authToken')

export async function fetchRules(): Promise<Rule[]> {
	const token = getAuthToken()
	const response = await fetch(`${API_BASE_URL}/api/rules`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) return []
	return response.json()
}

export async function toggleRule(ruleId: string, enabled: boolean): Promise<void> {
	const token = getAuthToken()
	await fetch(`${API_BASE_URL}/api/rules/${ruleId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ enabled }),
	})
}
