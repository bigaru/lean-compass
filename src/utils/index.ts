import { Food, FoodWithTotal } from '@/types'

//per gram
export const CAL_OF_FAT = 9
export const CAL_OF_CARB = 4
export const CAL_OF_PROTEIN = 4

export function addTotalCal(food: Food): FoodWithTotal {
	const calPer100 = food.cal ? food.cal : CAL_OF_FAT * food.fat + CAL_OF_CARB * food.carb + CAL_OF_PROTEIN * food.protein
	return {
		...food,
		totalCalories: Math.round(calPer100 * (food.weight / 100)),
	}
}

export function addDaysToDate(n: number) {
	const d = new Date()
	d.setHours(0, 0, 0, 0)
	d.setDate(d.getDate() + n)
	return d
}
