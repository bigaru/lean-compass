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
	pageRecord: Record<number, FoodWithTotal[]>
	currentDate: Date
	setMainInput: (text: string) => void
	addFood: () => void
	selectPage: (n: number) => void
	loadPage: (n: number) => void
}

const useStore = create<State>((set, get) => {
	const debounceInput = debounce((input: string) => {
		const matches = computeMatches(input)
		const validation = validateMatches(matches)
		set((state) => ({ ...state, matches, isInputValid: !state.mainInput.trim() || validation, isMatchesValid: validation }))
	}, 500)

	const loadPage = async (pageDateVal: number) => {
		const foodList = await DB.loadAllByDate(pageDateVal)

		set((state) => {
			const newPageRecord = { ...state.pageRecord, [pageDateVal]: foodList.map(addTotalCal) }
			return { ...state, pageRecord: newPageRecord }
		})
	}

	const currentDate = addDaysToDate(0)
	DB.init().then(() => loadPage(0))

	return {
		mainInput: '',
		matches: {},
		pageRecord: {},
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
			const createdAt = get().currentDate.valueOf()

			const newFood = {
				...rest,
				id: 0,
				name: rest.word ?? '',
				createdAt,
				fat: rest.fat ?? 0,
				carb: rest.carb ?? 0,
				protein: rest.protein ?? 0,
				cal: rest.calories ?? 0,
			} as Food

			await DB.add(newFood)
			set((state) => ({ ...state, mainInput: '', isMatchesValid: false }))
			loadPage(createdAt)
		},
		selectPage: async (n) => {
			const pageDate = addDaysToDate(n)

			set((state) => {
				return { ...state, currentDate: pageDate }
			})
		},
		loadPage,
	}
})

export { useStore }
