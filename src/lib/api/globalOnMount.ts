import { goto } from '$app/navigation'
import { checkAuth, isAuthenticated, logOut } from '../../stores/auth'
import type { Booking } from '../../types/Booking'
import type { User } from '../../types/User'
import { fetchMyBookings } from './bookings'
import { addUserToLocalStorage, getUserFromLocalStorage } from './users'

interface IGlobalOnMountResult {
	user: User
	bookings: Booking[]
}

export const globalOnMount = async (): Promise<IGlobalOnMountResult> => {
	checkAuth()
	if (!isAuthenticated) {
		goto('/login')
	}
	let userFromLocalStorage = getUserFromLocalStorage()
	const userId = localStorage.getItem('userId')
	if (!userFromLocalStorage || !userId) {
		if (!userId) {
			logOut()
			goto('/login')
			throw new Error('No user id found in local storage')
		} else {
			addUserToLocalStorage(userId)
			userFromLocalStorage = getUserFromLocalStorage()
			if (!userFromLocalStorage) {
				logOut()
				goto('/login')
				throw new Error('No user found in local storage')
			} else {
				return {
					user: userFromLocalStorage,
					bookings: (await fetchMyBookings(userId)) as Booking[],
				}
			}
		}
	} else {
		return {
			user: userFromLocalStorage,
			bookings: (await fetchMyBookings(userId)) as Booking[],
		}
	}
}