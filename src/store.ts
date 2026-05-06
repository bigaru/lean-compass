import { create } from 'zustand'

interface Food {
	name: string
	weight: number
	calories: number
	fat: number
	carb: number
	protein: number
	totalCalories: number
}

interface State {
	mainInput: string
	foods: Food[]
	setMainInput: (text: string) => void
	addFood: (matches: Record<string, any>) => void
}

//per gram
const CAL_OF_FAT = 9
const CAL_OF_CARB = 4
const CAL_OF_PROTEIN = 4

const useStore = create<State>((set) => ({
	mainInput: '',
	foods: [],
	setMainInput: (text) => set((state) => ({ ...state, mainInput: text })),
	addFood: (matches: Record<string, any>) =>
		set((state) => {
			const { other, ...rest } = matches

			const fat = rest.fat ?? 0
			const carb = rest.carb ?? 0
			const protein = rest.protein ?? 0

			const calPer100 = rest.calories ? rest.calories : CAL_OF_FAT * fat + CAL_OF_CARB * carb + CAL_OF_PROTEIN * protein

			const newFood = {
				...rest,
				name: rest.word ?? '',
				fat,
				carb,
				protein,
				calories: rest.calories ?? 0,
				totalCalories: calPer100 * (rest.weight / 100),
			} as Food

			return { ...state, mainInput: '', foods: [...state.foods, newFood] }
		}),
}))

export { useStore }
