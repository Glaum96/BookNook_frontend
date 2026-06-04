export interface Suspension {
	id: string
	userId: string
	suspendedFrom: string
	suspendedUntil: string
	reason: string | null
	createdByUserId: string
	createdAt: string
}
