import { writable } from 'svelte/store'
import type { Suspension } from '../types/Suspension'

export const mySuspension = writable<Suspension | null>(null)
