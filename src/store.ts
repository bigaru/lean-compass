import { Food, FoodWithTotal } from '@/types'
import debounce from 'lodash.debounce'
import { create } from 'zustand'
import { loadFoods } from './db'

//per gram
const CAL_OF_FAT = 9
const CAL_OF_CARB = 4
const CAL_OF_PROTEIN = 4

function matchNumbers(input: string, regex: RegExp): number | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return found.length === 1 ? Number(found[0]) : undefined
}

function match(input: string, regex: RegExp, acceptMany: boolean = false): string | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return acceptMany || found.length === 1 ? found[0] : undefined
}

const word = /\b(?!\d)(\w+)\b/g
const weight = /\b(\d+(?:\.\d+)?)g\b/g
const calories = /\b(\d+(?:\.\d+)?)cal\b/g
const fat = /\b(\d+(?:\.\d+)?)f\b/g
const carb = /\b(\d+(?:\.\d+)?)c\b/g
const protein = /\b(\d+(?:\.\d+)?)p\b/g
const other = /\b(\d+(?:\.\d+)?(?!(?:g|f|c|p|cal)\b))[a-zA-Z]*\b/g
const allRegexes: Record<string, RegExp> = { weight, calories, fat, carb, protein }

function computeMatches(input: string) {
	const entries = Object.keys(allRegexes).map((k) => [k, matchNumbers(input, allRegexes[k])])
	entries.push(['word', match(input, word)])
	entries.push(['other', match(input, other, true)])
	return Object.fromEntries(entries)
}

function validateMatches(matches: Record<string, any>) {
	const hasTrio = matches.fat != null || matches.carb != null || matches.protein != null
	const hasCaloricValue = (matches.calories != null) !== hasTrio
	return matches.weight != null && hasCaloricValue && !matches.other
}

function addTotalCal(food: Food): FoodWithTotal {
	const calPer100 = food.calories ? food.calories : CAL_OF_FAT * food.fat + CAL_OF_CARB * food.carb + CAL_OF_PROTEIN * food.protein
	return {
		...food,
		totalCalories: calPer100 * (food.weight / 100),
	}
}

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

	const currentDate = new Date()
	currentDate.setHours(0, 0, 0, 0)

	loadFoods(currentDate).then((loaded) => set((state) => ({ ...state, foods: loaded.map(addTotalCal) })))

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
		selectPage: (n) =>
			set((state) => {
				const d = new Date()
				d.setHours(0, 0, 0, 0)
				d.setDate(d.getDate() + n)
				return { ...state, currentDate: d }
			}),
	}
})

export { addTotalCal, useStore }
