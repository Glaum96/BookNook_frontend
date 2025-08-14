import { createViewDay, createViewWeek, createViewMonthGrid, createViewList } from "@schedule-x/calendar"

export const getFormattedDateOfFirstDayOfPreviousMonth = () => {
	const dateOfFirstDayOfPreviousMonth = new Date()
	dateOfFirstDayOfPreviousMonth.setDate(1)
	dateOfFirstDayOfPreviousMonth.setMonth(dateOfFirstDayOfPreviousMonth.getMonth() - 1)
	dateOfFirstDayOfPreviousMonth.setHours(0, 0, 0, 0)

	return dateOfFirstDayOfPreviousMonth.toISOString().split('T')[0]
}

export const getFormattedDateOfDayOneMonthFromToday = () => {
	const dateOfDayOneMonthFromToday = new Date()
	dateOfDayOneMonthFromToday.setDate(1)
	dateOfDayOneMonthFromToday.setMonth(dateOfDayOneMonthFromToday.getMonth() + 1)
	dateOfDayOneMonthFromToday.setHours(0, 0, 0, 0)

	return dateOfDayOneMonthFromToday.toISOString().split('T')[0]
}

export const getTimeOfDayConstraints = (): TimeOfDayConstraints => ({
	start: '06:00',
	end: '23:00',
})

export const getViews = () => {
	const views = [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewList()]
	if(!isNonEmptyArray(views)){
		throw new Error('No views provided to the calendar')
	} else {
		return views
	}
}

const isNonEmptyArray = <T>(arr: T[]): arr is [T, ...T[]] => {
	return Array.isArray(arr) && arr.length > 0
}

type TimeOfDayConstraints = {
	start: string
	end: string
}
