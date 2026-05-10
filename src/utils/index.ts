export function addDaysToDate(n: number) {
	const d = new Date()
	d.setHours(0, 0, 0, 0)
	d.setDate(d.getDate() + n)
	return d
}
