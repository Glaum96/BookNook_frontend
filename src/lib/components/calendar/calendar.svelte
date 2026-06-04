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
		getScrollTarget,
		getViews,
	} from './utils'
	import { getBookings } from './getBookings'
	import { onMount } from 'svelte'
	import type { ScheduleXEvent } from '../../../types/ScheduleXEvent'
	import Spinner from '../spinner/Spinner.svelte'
	import { isLoading } from '../../../stores/loading'
	import { theme } from '../../../stores/theme'
	import { browser } from '$app/environment'

	const calendarLoading = isLoading('bookings')
	let initialLoadComplete = false
	let bookings: ScheduleXEvent[] = []

	function getEffectiveIsDark(t: string): boolean {
		if (t === 'dark') return true
		if (t === 'light') return false
		if (browser) return window.matchMedia('(prefers-color-scheme: dark)').matches
		return false
	}

	function buildCalendarConfig(isDark: boolean, events: ScheduleXEvent[]) {
		return {
			views: getViews(),
			locale: 'nb-NO',
			isDark,
			defaultView: viewWeek.name,
			showWeekNumbers: true,
			dayBoundaries: getTimeOfDayConstraints(),
			minDate: getFormattedDateOfFirstDayOfPreviousMonth(),
			maxDate: getFormattedDateOfDayOneMonthFromToday(),
			weekOptions: {
				eventWidth: 100,
				nDays: 7,
				eventOverlap: false,
				gridHeight: 600,
			},
			plugins: [createScrollControllerPlugin({ initialScroll: getScrollTarget() })],
			events,
		}
	}

	let calendarApp = createCalendar(buildCalendarConfig(false, [])) as ReturnType<typeof createCalendar>

	onMount(async () => {
		try {
			const bookingsFromServer = await getBookings()
			bookings = bookingsFromServer

			const isDark = getEffectiveIsDark($theme)
			calendarApp = createCalendar(buildCalendarConfig(isDark, bookings))
			initialLoadComplete = true
		} catch (error) {
			console.error('Error fetching bookings:', error)
			initialLoadComplete = true
		}

		const unsubscribeTheme = theme.subscribe((t) => {
			if (initialLoadComplete) {
				const isDark = getEffectiveIsDark(t)
				calendarApp = createCalendar(buildCalendarConfig(isDark, bookings))
			}
		})

		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = () => {
			if ($theme === 'system' && initialLoadComplete) {
				const isDark = mq.matches
				calendarApp = createCalendar({ ...calendarConfig, isDark, events: bookings })
			}
		}
		mq.addEventListener('change', handler)

		return () => {
			unsubscribeTheme()
			mq.removeEventListener('change', handler)
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

	/* Override brand color for calendar chrome */
	.calendar-wrapper :global(.sx__calendar-wrapper) {
		--sx-color-primary: var(--color-primary);
		--sx-color-on-primary: #fff;
		--sx-color-primary-container: var(--color-primary-bg-light);
		--sx-color-on-primary-container: var(--text-body);
	}

	/* Event pill styling */
	:global(.sx__time-grid-event) {
		border-radius: 6px;
		box-shadow: 0 1px 3px var(--shadow-md);
	}

	:global(.booking-event) {
		background-color: var(--color-primary) !important;
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
		background-color: var(--color-primary) !important;
		color: #fff !important;
		border-radius: 4px;
	}

	/* Date/list grid events */
	:global(.sx__date-grid-event.booking-event) {
		background-color: var(--color-primary) !important;
		color: #fff !important;
		border-radius: 4px;
	}
</style>
