export interface Food {
	name: string
	weight: number
	calories: number
	fat: number
	carb: number
	protein: number
}

export interface FoodWithTotal extends Food {
	totalCalories: number
}
