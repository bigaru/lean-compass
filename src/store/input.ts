const word = /\b(?!\d)(\w+)\b/g
const weight = /\b(\d+(?:\.\d+)?)g\b/g
const calories = /\b(\d+(?:\.\d+)?)cal\b/g
const fat = /\b(\d+(?:\.\d+)?)f\b/g
const carb = /\b(\d+(?:\.\d+)?)c\b/g
const protein = /\b(\d+(?:\.\d+)?)p\b/g
const other = /\b(\d+(?:\.\d+)?(?!(?:g|f|c|p|cal)\b))[a-zA-Z]*\b/g
const allRegexes: Record<string, RegExp> = { weight, calories, fat, carb, protein }

function matchNumbers(input: string, regex: RegExp): number | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return found.length === 1 ? Number(found[0]) : undefined
}

function match(input: string, regex: RegExp, acceptMany: boolean = false): string | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return acceptMany || found.length === 1 ? found[0] : undefined
}

export function computeMatches(input: string) {
	const entries = Object.keys(allRegexes).map((k) => [k, matchNumbers(input, allRegexes[k])])
	entries.push(['word', match(input, word)])
	entries.push(['other', match(input, other, true)])
	return Object.fromEntries(entries)
}

export function validateMatches(matches: Record<string, any>) {
	const hasTrio = matches.fat != null || matches.carb != null || matches.protein != null
	const hasCaloricValue = (matches.calories != null) !== hasTrio
	return matches.weight != null && hasCaloricValue && !matches.other
}
