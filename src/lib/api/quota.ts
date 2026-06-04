import { API_BASE_URL } from '$lib/config'
import type { QuotaStatus } from '../../stores/quota'

const getAuthToken = () => localStorage.getItem('authToken')

export async function fetchMyQuotaStatus(): Promise<QuotaStatus> {
	const token = getAuthToken()
	if (!token) return { enabled: false }
	try {
		const response = await fetch(`${API_BASE_URL}/api/myQuotaStatus`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!response.ok) return { enabled: false }
		return response.json()
	} catch {
		return { enabled: false }
	}
}

export function periodLabel(periodType?: string, periodDays?: number): string {
	switch (periodType) {
		case 'month': return 'måneden'
		case 'quarter': return 'kvartalet'
		case 'year': return 'året'
		case 'days': return `${periodDays ?? 30} dager`
		default: return 'måneden'
	}
}
