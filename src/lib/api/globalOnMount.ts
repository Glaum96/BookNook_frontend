import { goto } from '$app/navigation'
import { base } from '$app/paths'
import { checkAdminUser, checkAuth, isAuthenticated, logOut } from '../../stores/auth'
import { checkIncludePastBookings, getIncludePastBookingsFromLocalStorage } from '../../stores/includePastBookings'
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
	checkAdminUser()
	checkIncludePastBookings()
	if (!isAuthenticated) {
		goto(`${base}/login`)
	}
	let userFromLocalStorage = getUserFromLocalStorage()
	const userId = localStorage.getItem('userId')
	const includePastBookings = getIncludePastBookingsFromLocalStorage()
	if (!userFromLocalStorage || !userId) {
		if (!userId) {
			logOut()
			goto(`${base}/login`)
			throw new Error('No user id found in local storage')
		} else {
			addUserToLocalStorage(userId)
			userFromLocalStorage = getUserFromLocalStorage()
			if (!userFromLocalStorage) {
				logOut()
				goto(`${base}/login`)
				throw new Error('No user found in local storage')
			} else {
				return {
					user: userFromLocalStorage,
					bookings: (await fetchMyBookings(userId, includePastBookings)) as Booking[],
				}
			}
		}
	} else {
		return {
			user: userFromLocalStorage,
			bookings: (await fetchMyBookings(userId, includePastBookings)) as Booking[],
		}
	}
}
