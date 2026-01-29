import { writable, derived } from 'svelte/store'

type LoadingKeys =
	| 'bookings'
	| 'myBookings'
	| 'users'
	| 'login'
	| 'register'
	| 'calendar'
	| 'postBooking'
	| 'deleteBooking'
	| 'updateUser'
	| 'deleteUser'

const loadingStates = writable<Record<LoadingKeys, boolean>>({
	bookings: false,
	myBookings: false,
	users: false,
	login: false,
	register: false,
	calendar: false,
	postBooking: false,
	deleteBooking: false,
	updateUser: false,
	deleteUser: false,
})

export function setLoading(key: LoadingKeys, value: boolean) {
	loadingStates.update((state) => ({ ...state, [key]: value }))
}

export function isLoading(key: LoadingKeys) {
	return derived(loadingStates, ($states) => $states[key])
}

export const isAnyLoading = derived(loadingStates, ($states) => Object.values($states).some((v) => v))
