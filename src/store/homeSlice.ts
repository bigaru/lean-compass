import * as DB from '@/db'
import { Food } from '@/types'
import { addDaysToDate } from '@/utils'
import debounce from 'lodash.debounce'
import { StateCreator } from 'zustand'
import { MainState } from './index'
import { computeMatches, validateMatches } from './input'

export interface HomeState {
	mainInput: string
	matches: Record<string, any>
	isInputValid: boolean
	isMatchesValid: boolean
	pageRecord: Record<number, Food[]>
	currentDate: Date
	selectedFood: number | null
	setMainInput: (text: string) => void
	selectPage: (n: number) => void
	addFood: () => void
	deleteFood: () => void
	loadPage: (n: number) => void
	openSheet: (id: number | null) => void
}

export const createHomeSlice: StateCreator<MainState, [], [], HomeState> = (set, get) => {
	const debounceInput = debounce((input: string) => {
		const matches = computeMatches(input)
		const validation = validateMatches(matches)
		set((state) => ({ ...state, matches, isInputValid: !state.mainInput.trim() || validation, isMatchesValid: validation }))
	}, 500)

	const loadPage = async (pageDateVal: number) => {
		const foodList = await DB.loadAllByDate(pageDateVal)

		set((state) => {
			const newPageRecord = { ...state.pageRecord, [pageDateVal]: foodList }
			return { ...state, pageRecord: newPageRecord }
		})
	}

	const currentDate = addDaysToDate(0)

	return {
		mainInput: '',
		matches: {},
		pageRecord: {},
		isInputValid: true,
		isMatchesValid: false,
		currentDate,
		selectedFood: null,
		setMainInput: (text) =>
			set((state) => {
				debounceInput(text)
				return { ...state, mainInput: text }
			}),
		loadPage,
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
		deleteFood: async () => {
			const id = get().selectedFood
			if (id) {
				await DB!.remove(id)
				loadPage(get().currentDate.valueOf())
				set((state) => ({ ...state, selectedFood: null }))
			}
		},
		selectPage: async (n) => {
			const pageDate = addDaysToDate(n)

			set((state) => {
				return { ...state, currentDate: pageDate }
			})
		},
		openSheet: (id: number | null) => set((state) => ({ ...state, selectedFood: id })),
	}
}
