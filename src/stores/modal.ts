import { writable } from 'svelte/store'
import type { SvelteComponent } from 'svelte'

type ModalContent = {
    component: typeof SvelteComponent | null
    props: Record<string, any>
}

export const modalContent = writable<ModalContent>({ component: null, props: {} })

export const showModal = writable(false)
