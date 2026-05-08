import * as DB from '@/db'
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

const useStore = create<State>((set, get) => {
	const debounceInput = debounce((input: string) => {
		const matches = computeMatches(input)
		const validation = validateMatches(matches)
		set((state) => ({ ...state, matches, isInputValid: !state.mainInput.trim() || validation, isMatchesValid: validation }))
	}, 500)

	const currentDate = addDaysToDate(0)

	DB.init().then(async () => {
		const foodList = await DB.loadAllByDate(currentDate)
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
		addFood: async () => {
			const { other, ...rest } = get().matches
			const newFood = {
				...rest,
				id: 0,
				name: rest.word ?? '',
				createdAt: get().currentDate.valueOf(),
				fat: rest.fat ?? 0,
				carb: rest.carb ?? 0,
				protein: rest.protein ?? 0,
				cal: rest.calories ?? 0,
			} as Food

			const lastInsertId = await DB.add(newFood)
			newFood.id = lastInsertId
			set((state) => ({ ...state, mainInput: '', foods: [...state.foods, addTotalCal(newFood)] }))
		},
		selectPage: async (n) => {
			const newDate = addDaysToDate(n)
			set((state) => ({ ...state, currentDate: newDate }))

			const foodList = await DB.loadAllByDate(newDate)
			set((state) => ({ ...state, foods: foodList.map(addTotalCal) }))
		},
	}
})

export { useStore }
