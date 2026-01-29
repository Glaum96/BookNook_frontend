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
		getViews,
	} from './utils'
	import { getBookings } from './getBookings'
	import { onMount } from 'svelte'
	import type { ScheduleXEvent } from '../../../types/ScheduleXEvent'
	import Spinner from '../spinner/Spinner.svelte'
	import { isLoading } from '../../../stores/loading'

	const calendarLoading = isLoading('bookings')
	let initialLoadComplete = false
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

	const darkMode = false

	let calendarConfig = {
		views: getViews(),
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
			initialLoadComplete = true
		} catch (error) {
			console.error('Error fetching bookings:', error)
			initialLoadComplete = true
		}
	})
</script>

{#if $calendarLoading || !initialLoadComplete}
	<div class="loading-container">
		<Spinner size="large" label="Laster kalender..." />
	</div>
{:else}
	<div>
		<ScheduleXCalendar {calendarApp} />
	</div>
{/if}

<style>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
	}

	/* ScheduleX event styling - must use :global() for library classes */
	:global(.sx__time-grid-event) {
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	:global(.booking-event) {
		background-color: #002776 !important;
		border-left: 4px solid #0056b3;
	}

	:global(.sx__time-grid-event-title) {
		font-size: 0.95rem;
		font-weight: 600;
	}

	:global(.sx__time-grid-event-people) {
		font-size: 0.8rem;
		opacity: 0.85;
		margin-top: 2px;
	}

	:global(.sx__time-grid-event-location) {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	/* Month grid events */
	:global(.sx__month-grid-event) {
		border-radius: 4px;
	}

	:global(.sx__month-grid-event.booking-event) {
		background-color: #002776 !important;
	}

	/* Date grid events */
	:global(.sx__date-grid-event.booking-event) {
		background-color: #002776 !important;
		border-radius: 4px;
	}
</style>
