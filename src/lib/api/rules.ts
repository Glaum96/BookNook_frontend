import { API_BASE_URL } from '$lib/config'
import { setLoading } from '../../stores/loading'

export interface Rule {
	id: string
	name: string
	description: string
	enabled: boolean
	value: number
	periodType?: string
	periodDays?: number
}

const getAuthToken = () => localStorage.getItem('authToken')

export async function fetchRules(): Promise<Rule[]> {
	const token = getAuthToken()
	setLoading('rules', true)
	try {
		const response = await fetch(`${API_BASE_URL}/api/rules`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		if (!response.ok) return []
		return response.json()
	} finally {
		setLoading('rules', false)
	}
}

export async function updateRule(ruleId: string, enabled: boolean, value?: number, periodType?: string, periodDays?: number): Promise<void> {
	const token = getAuthToken()
	await fetch(`${API_BASE_URL}/api/rules/${ruleId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ enabled, value, periodType, periodDays }),
	})
}
