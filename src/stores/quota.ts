import { writable } from 'svelte/store'

export interface QuotaStatus {
	enabled: boolean
	usedHours?: number
	maxHours?: number
	periodType?: string
	periodDays?: number
	periodStart?: string
}

export const myQuotaStatus = writable<QuotaStatus | null>(null)
