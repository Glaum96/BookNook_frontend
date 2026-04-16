import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'booknook-theme'

function createThemeStore() {
	const stored = browser ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null
	const initial: Theme = stored ?? 'system'
	const { subscribe, set } = writable<Theme>(initial)

	return {
		subscribe,
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem(STORAGE_KEY, value)
			}
			set(value)
		},
	}
}

export const theme = createThemeStore()
