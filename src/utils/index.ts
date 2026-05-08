import { Food, FoodWithTotal } from '@/types'

//per gram
const CAL_OF_FAT = 9
const CAL_OF_CARB = 4
const CAL_OF_PROTEIN = 4

export function addTotalCal(food: Food): FoodWithTotal {
	const calPer100 = food.calories ? food.calories : CAL_OF_FAT * food.fat + CAL_OF_CARB * food.carb + CAL_OF_PROTEIN * food.protein
	return {
		...food,
		totalCalories: calPer100 * (food.weight / 100),
	}
}

export function addDaysToDate(n: number) {
	const d = new Date()
	d.setHours(0, 0, 0, 0)
	d.setDate(d.getDate() + n)
	return d
}
