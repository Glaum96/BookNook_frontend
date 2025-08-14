import { getIncludePastBookingsFromLocalStorage, includePastBookings } from '../../stores/includePastBookings'
import type { Booking } from '../../types/Booking'

const getAuthToken = () => {
	return localStorage.getItem('authToken')
}

export async function fetchAllBookings() {
	try {
		const token = getAuthToken()
		const response = await fetch('http://localhost:9090/api/bookings', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return (await (response ?? []).json()) as Booking[]
	} catch (error) {
		console.log(error)
		throw new Error('Failed to fetch bookings')
	}
}

export async function fetchMyBookings(userId: string, includePastBookings: boolean) {
	try {
		const token = getAuthToken()
		const response = await fetch('http://localhost:9090/api/myBookings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'User-Id': userId,
				"includePastBookings": includePastBookings.toString(),
				Authorization: `Bearer ${token}`,
			},
		})
		return await response.json()
	} catch (error) {
		console.log(error)
	}
}

export async function deleteBooking(bookingId: string) {
	try {
		const token = getAuthToken()
		const response = await fetch(`http://localhost:9090/api/deleteBooking/${bookingId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.ok) {
			console.log('Booking deleted successfully')
		} else {
			console.log('Failed to delete booking')
		}
	} catch (error) {
		console.log(error)
	}
}

export async function postBooking(newBooking: Booking) {
	try {
		const token = getAuthToken()
		const response = await fetch('http://localhost:9090/api/postBooking', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newBooking),
		})
		if (response.ok) {
			await fetchMyBookings(newBooking.userId, getIncludePastBookingsFromLocalStorage())
			console.log('Booking created successfully')
		}
	} catch (error) {
		console.log(error)
	}
}
