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
	import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
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
	let bookings: ScheduleXEvent[] = []

	const now = new Date()
	const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

	const scrollController = createScrollControllerPlugin({ initialScroll: currentTime })

	const calendarConfig = {
		views: getViews(),
		locale: 'nb-NO',
		isDark: false,
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
		plugins: [scrollController],
		events: bookings,
	}

	let calendarApp = createCalendar(calendarConfig) as ReturnType<typeof createCalendar>

	onMount(async () => {
		try {
			const bookingsFromServer = await getBookings()
			bookings = bookingsFromServer

			calendarApp = createCalendar({ ...calendarConfig, events: bookings })
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
	<div class="calendar-wrapper">
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

	/* Override brand color for calendar chrome (today highlight, selected date, etc.) */
	.calendar-wrapper :global(.sx__calendar-wrapper) {
		--sx-color-primary: #525a8a;
		--sx-color-on-primary: #fff;
		--sx-color-primary-container: #e8eaf6;
		--sx-color-on-primary-container: #1a1f4b;
	}

	/* Event pill styling */
	:global(.sx__time-grid-event) {
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
	}

	:global(.booking-event) {
		background-color: #525a8a !important;
		border-left: 4px solid #3a4169 !important;
		color: #fff !important;
	}

	:global(.booking-event *) {
		color: #fff !important;
	}

	:global(.sx__time-grid-event-title) {
		font-size: 0.9rem;
		font-weight: 600;
	}

	:global(.sx__time-grid-event-description) {
		font-size: 0.8rem;
		opacity: 0.9;
		margin-top: 2px;
	}

	:global(.sx__time-grid-event-location) {
		font-size: 0.75rem;
		opacity: 0.75;
	}

	/* Month grid events */
	:global(.sx__month-grid-event.booking-event) {
		background-color: #525a8a !important;
		color: #fff !important;
		border-radius: 4px;
	}

	/* Date/list grid events */
	:global(.sx__date-grid-event.booking-event) {
		background-color: #525a8a !important;
		color: #fff !important;
		border-radius: 4px;
	}
</style>
