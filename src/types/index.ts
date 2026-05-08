export interface Food {
	id: number
	name: string
	createdAt: number
	weight: number
	cal: number
	fat: number
	carb: number
	protein: number
}

export interface FoodWithTotal extends Food {
	totalCalories: number
}
