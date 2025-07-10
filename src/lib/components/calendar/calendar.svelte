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

	type TimeOfDayConstraints = {
		start: string
		end: string
	}

	const views: [any, ...any[]] = [createViewWeek(), createViewDay(), createViewMonthGrid(), createViewList()]
	const darkMode = false
	const timeOfDayConstraints: TimeOfDayConstraints = {
		start: '06:00',
		end: '23:00',
	}

	const dateOfFirstDayOfPreviousMonth = new Date()
	dateOfFirstDayOfPreviousMonth.setDate(1)
	dateOfFirstDayOfPreviousMonth.setMonth(dateOfFirstDayOfPreviousMonth.getMonth() - 1)
	dateOfFirstDayOfPreviousMonth.setHours(0, 0, 0, 0)
	const formattedDateOfFirstDayOfPreviousMonth = dateOfFirstDayOfPreviousMonth.toISOString().split('T')[0]

	const dateOfDayOneMonthFromToday = new Date()
	dateOfDayOneMonthFromToday.setDate(1)
	dateOfDayOneMonthFromToday.setMonth(dateOfDayOneMonthFromToday.getMonth() + 1)
	dateOfDayOneMonthFromToday.setHours(0, 0, 0, 0)
	const formattedDateOfDayOneMonthFromToday = dateOfDayOneMonthFromToday.toISOString().split('T')[0]

	const calendarConfig = {
		views: views,
		locale: 'nb-NO',
		isDark: darkMode,
		defaultView: viewWeek.name,
		dayBoundaries: timeOfDayConstraints,
		minDate: formattedDateOfFirstDayOfPreviousMonth,
		maxDate: formattedDateOfDayOneMonthFromToday,
		weekOptions: {
			eventWidth: 100,
            nDays: 7,
            eventOverlap: false,
		},
		events: [
			{
				id: '1',
				title: 'Event 1',
				start: '2025-07-10',
				end: '2025-07-10',
			},
			{
				id: '2',
				title: 'Event 2',
				start: '2025-07-11 02:00',
				end: '2025-07-11 04:00',
			},
		],
	}

	const calendarApp = createCalendar(calendarConfig)
</script>

<div>
	<ScheduleXCalendar {calendarApp} />
</div>
