<script lang="ts">
	import { ScheduleXCalendar } from '@schedule-x/svelte'
	import {
		createCalendar,
		createViewDay,
		createViewList,
		createViewMonthGrid,
		createViewWeek,
		viewWeek,
	} from '@schedule-x/calendar'
	import '@schedule-x/theme-default/dist/index.css'
	import {
		getFormattedDateOfDayOneMonthFromToday,
		getFormattedDateOfFirstDayOfPreviousMonth,
		getTimeOfDayConstraints,
	} from './utils'
	import { getBookings } from './getBookings'
	import { onMount } from 'svelte'
	import type { ScheduleXEvent } from '../../../types/ScheduleXEvent'

	let isLoading = true
	let bookings: ScheduleXEvent[] = [
		{
			id: '1',
			title: 'Event 1',
			start: '2025-07-17',
			end: '2025-07-17',
		},
		{
			id: '2',
			title: 'Event 2',
			start: '2025-07-18 15:00',
			end: '2025-07-18 18:00',
		},
	]

	const views: [any, ...any[]] = [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewList()]
	const darkMode = false

	let calendarConfig = {
		views: views,
		locale: 'nb-NO',
		isDark: darkMode,
		defaultView: viewWeek.name,
		showWeekNumbers: true,
		dayBoundaries: getTimeOfDayConstraints(),
		minDate: getFormattedDateOfFirstDayOfPreviousMonth(),
		maxDate: getFormattedDateOfDayOneMonthFromToday(),
		weekOptions: {
			eventWidth: 100,
			nDays: 7,
			eventOverlap: false,
		},
		events: bookings,
	}

	let calendarApp = createCalendar(calendarConfig) as ReturnType<typeof createCalendar>

	onMount(async () => {
		try {
			// Fetch bookings from the server
			const bookingsFromServer = await getBookings()
			bookings = [...bookings, ...bookingsFromServer]

			// Update calendar config with fetched bookings
			calendarConfig = { ...calendarConfig, events: bookings }

			// Create the calendar instance
			calendarApp = createCalendar(calendarConfig)

			// Mark loading as complete
			isLoading = false
		} catch (error) {
			console.error('Error fetching bookings:', error)
			isLoading = false // Ensure loading state is cleared even on error
		}
	})
</script>

{#if isLoading}
	<!-- Show a loading indicator while fetching bookings -->
	<div>Loading calendar...</div>
{:else}
	<!-- Render the calendar only after bookings are loaded -->
	<div>
		<ScheduleXCalendar {calendarApp} />
	</div>
{/if}
