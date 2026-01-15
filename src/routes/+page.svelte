<script lang="ts">
	import MineBookinger from '$lib/components/myBookings/myBookings.svelte'
	import { onMount } from 'svelte'
	import './page.css'
	import { globalOnMount } from '$lib/api/globalOnMount'
	import { isAuthenticated } from '../stores/auth'
	import type { User } from '../types/User'
	import type { Booking } from '../types/Booking'
	import Calendar from '$lib/components/calendar/calendar.svelte'
	import { base } from '$app/paths'
	onMount(async () => {
		const { user: fetchedUser, bookings: fetchedBookings } = await globalOnMount()
		user = fetchedUser
		bookings = fetchedBookings
	})

	let user = {
		id: '',
		name: '',
		phoneNumber: '',
		email: '',
		apartmentNumber: '',
	} as User

	let bookings: Booking[] = []
</script>

<svelte:head>
	<title>BookNook</title>
	<a href={base}>Home-test</a>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $isAuthenticated}
	<div class="main-container">
		<section class="calendar-section">
			<Calendar />
		</section>
		<section class="your-bookings">
			<MineBookinger userId={user.id} {bookings} />
		</section>
	</div>
{/if}
