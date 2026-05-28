export interface CheckinImage {
	id: string
	bookingId: string
	userId: string
	type: 'CHECK_IN' | 'CHECK_OUT'
	uploadedAt: string
	filename: string
	contentType: string
}
