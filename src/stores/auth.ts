import { getUserFromLocalStorage } from '$lib/api/users'
import { writable } from 'svelte/store'

export const isAuthenticated = writable(false)
export const isAdminUser = writable(false)

export function checkAuth() {
	const token = localStorage.getItem('authToken')
	isAuthenticated.set(!!token)
}

export function redirectToLoginIfNotAuthenticated() {
	isAuthenticated.subscribe((value) => {
		if (!value) {
			window.location.href = '/login'
		}
	})
}

export function checkAdminUser() {
	const userIsAdmin = getUserFromLocalStorage()?.admin
	isAdminUser.set(!!userIsAdmin)
}

export async function logOut() {
	// Sends a post request to the logout end point in the backend and then redicrects to the login page
	await fetch('http://localhost:9090/api/logout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Include credentials if needed
	})

	localStorage.removeItem('authToken')
	localStorage.removeItem('user')
	localStorage.removeItem('userId')
	isAuthenticated.set(false)
}
