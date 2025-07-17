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
	import { getFormattedDateOfDayOneMonthFromToday, getFormattedDateOfFirstDayOfPreviousMonth, getTimeOfDayConstraints } from './utils'



	const views: [any, ...any[]] = [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewList()]
	const darkMode = false


	const calendarConfig = {
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
