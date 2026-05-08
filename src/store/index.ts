import { initDB, loadFoods } from '@/db'
import { Food, FoodWithTotal } from '@/types'
import { addDaysToDate, addTotalCal } from '@/utils'
import debounce from 'lodash.debounce'
import { create } from 'zustand'
import { computeMatches, validateMatches } from './input'

interface State {
	mainInput: string
	matches: Record<string, any>
	isInputValid: boolean
	isMatchesValid: boolean
	foods: FoodWithTotal[]
	currentDate: Date
	setMainInput: (text: string) => void
	addFood: () => void
	selectPage: (n: number) => void
}

const useStore = create<State>((set) => {
	const debounceInput = debounce((input: string) => {
		const matches = computeMatches(input)
		const validation = validateMatches(matches)
		set((state) => ({ ...state, matches, isInputValid: !state.mainInput.trim() || validation, isMatchesValid: validation }))
	}, 500)

	const currentDate = addDaysToDate(0)

	initDB().then(async () => {
		const foodList = await loadFoods(currentDate)
		set((state) => ({ ...state, foods: foodList.map(addTotalCal) }))
	})

	return {
		mainInput: '',
		matches: {},
		foods: [],
		isInputValid: true,
		isMatchesValid: false,
		currentDate,
		setMainInput: (text) =>
			set((state) => {
				debounceInput(text)
				return { ...state, mainInput: text }
			}),
		addFood: () =>
			set((state) => {
				const { other, ...rest } = state.matches
				const newFood = {
					...rest,
					name: rest.word ?? '',
					fat: rest.fat ?? 0,
					carb: rest.carb ?? 0,
					protein: rest.protein ?? 0,
					calories: rest.calories ?? 0,
				} as Food

				return { ...state, mainInput: '', foods: [...state.foods, addTotalCal(newFood)] }
			}),
		selectPage: async (n) => {
			const newDate = addDaysToDate(n)
			set((state) => ({ ...state, currentDate: newDate }))

			const foodList = await loadFoods(newDate)
			set((state) => ({ ...state, foods: foodList.map(addTotalCal) }))
		},
	}
})

export { useStore }
