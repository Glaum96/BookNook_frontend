import { writable } from 'svelte/store'

export const includePastBookings = writable(false)

export const checkIncludePastBookings = () => {
    const localStorageValue = localStorage.getItem('includePastBookings')
    includePastBookings.set(localStorageValue === 'true')
}

export const getIncludePastBookingsFromLocalStorage = () => {
    return localStorage.getItem('includePastBookings') === 'true'
}

export const setIncludePastBookings = (value: boolean) => {
    includePastBookings.set(value)
    localStorage.setItem('includePastBookings', value.toString())
}