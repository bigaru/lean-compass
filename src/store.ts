import debounce from 'lodash.debounce'
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

interface State {
	mainInput: string
	matches: Record<string, any>
	isInputValid: boolean
	foods: Food[]
	setMainInput: (text: string) => void
	addFood: () => void
}

const useStore = create<State>((set) => {
	const debounceInput = debounce((input: string) => {
		const matches = computeMatches(input)
		set((state) => ({ ...state, matches, isInputValid: !state.mainInput.trim() || validateMatches(matches) }))
	}, 500)

	return {
		mainInput: '',
		matches: {},
		foods: [],
		isInputValid: true,
		setMainInput: (text) =>
			set((state) => {
				debounceInput(text)
				return { ...state, mainInput: text }
			}),
		addFood: () =>
			set((state) => {
				const { other, ...rest } = state.matches

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
	}
})

export { useStore }
