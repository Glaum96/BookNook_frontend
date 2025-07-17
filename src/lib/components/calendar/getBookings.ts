import { fetchAllBookings } from '$lib/api/bookings'
import type { Booking } from '../../../types/Booking'
import type { ScheduleXEvent } from '../../../types/ScheduleXEvent'

export const getBookings = async (): Promise<ScheduleXEvent[]> => {
	const bookings = fetchAllBookings().then((data) => {
		return data.map((booking) => ({
			id: booking.id,
			startTime: booking.startTime,
			endTime: booking.endTime,
			userId: booking.userId,
			responsibleName: booking.responsibleName,
			responsibleNumber: booking.responsibleNumber,
		}))
	})

	const bookingsResult = (await bookings).map((booking) => ({
		id: booking.id,
		start: formatDate(booking.startTime),
		end: formatDate(booking.endTime),
		title: getBookingTitle(booking),
		location: 'Takterrassen i Seilduken, bby',
		people: [booking.userId],
		_options: {
			disableDND: false,
			disableResize: false,
		},
	}))

	return bookingsResult
}

const getBookingTitle = (booking: Booking): string => {
	return `${booking.responsibleName}: (${booking.startTime} - ${booking.endTime})`
}

const formatDate = (dateString: string): string => {
	const date = new Date(dateString)

	// Format the date as "YYYY-MM-DD HH:mm:ss"
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${year}-${month}-${day} ${hours}:${minutes}`
}
