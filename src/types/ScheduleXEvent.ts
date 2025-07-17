export type ScheduleXEvent = {
	id: string | number
	start: string
	end: string
	title?: string
	description?: string
	location?: string
	people?: string[]
	calendarId?: string
	_options?: { disableDND?: boolean; disableResize?: boolean; additionalClasses?: string[] }
}
