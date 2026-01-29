import { getIncludePastBookingsFromLocalStorage, includePastBookings } from '../../stores/includePastBookings'
import { setLoading } from '../../stores/loading'
import type { Booking } from '../../types/Booking'
import { API_BASE_URL } from '$lib/config'

const getAuthToken = () => {
	return localStorage.getItem('authToken')
}

export async function fetchAllBookings() {
	setLoading('bookings', true)
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/bookings`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return (await (response ?? []).json()) as Booking[]
	} catch (error) {
		console.log(error)
		throw new Error('Failed to fetch bookings')
	} finally {
		setLoading('bookings', false)
	}
}

export async function fetchMyBookings(userId: string, includePastBookings: boolean) {
	setLoading('myBookings', true)
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/myBookings`, {
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
	} finally {
		setLoading('myBookings', false)
	}
}

export async function deleteBooking(bookingId: string) {
	setLoading('deleteBooking', true)
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/deleteBooking/${bookingId}`, {
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
	} finally {
		setLoading('deleteBooking', false)
	}
}

export async function postBooking(newBooking: Booking) {
	setLoading('postBooking', true)
	try {
		const token = getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/postBooking`, {
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
	} finally {
		setLoading('postBooking', false)
	}
}
