export const getDate = (time: string) => {
	const date = new Date(time)
	return date.toLocaleDateString()
}

export const getTime = (time: string) => {
	const date = new Date(time)
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
