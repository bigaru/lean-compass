export interface Food {
	id: number
	name: string
	createdAt: number
	weight: number
	cal: number
	fat: number
	carb: number
	protein: number
	totalCalories: number
}

export interface CalDay {
	createdAt: number
	cal: number
	fat: number
	carb: number
	protein: number

	[key: string]: number
}
