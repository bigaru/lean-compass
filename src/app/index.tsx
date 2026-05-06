import { useStore } from '@/store'
import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { useMemo } from 'react'
import { Button, Card, Text, TextArea, XStack, YStack } from 'tamagui'
import { useDebounce } from 'use-debounce'

function matchNumbers(input: string, regex: RegExp): number | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return found.length === 1 ? Number(found[0]) : undefined
}

function match(input: string, regex: RegExp, acceptMany: boolean = false): string | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return acceptMany || found.length === 1 ? found[0] : undefined
}

const LINE_HEIGHT = 30

const word = /\b(?!\d)(\w+)\b/g
const weight = /\b(\d+(?:\.\d+)?)g\b/g
const calories = /\b(\d+(?:\.\d+)?)cal\b/g
const fat = /\b(\d+(?:\.\d+)?)f\b/g
const carb = /\b(\d+(?:\.\d+)?)c\b/g
const protein = /\b(\d+(?:\.\d+)?)p\b/g
const other = /\b(\d+(?:\.\d+)?(?!(?:g|f|c|p|cal)\b))[a-zA-Z]*\b/g
const allRegexes: Record<string, RegExp> = { weight, calories, fat, carb, protein }

export default function HomeScreen() {
	const { mainInput, setMainInput, foods, addFood } = useStore((state) => state)
	const [debouncedInput] = useDebounce(mainInput, 500)

	const matches = useMemo(() => {
		const entries = Object.keys(allRegexes).map((k) => [k, matchNumbers(debouncedInput, allRegexes[k])])
		entries.push(['word', match(debouncedInput, word)])
		entries.push(['other', match(debouncedInput, other, true)])
		return Object.fromEntries(entries)
	}, [debouncedInput])

	const hasTrio = matches.fat != null || matches.carb != null || matches.protein != null
	const hasCaloricValue = (matches.calories != null) !== hasTrio
	const isValid = !mainInput.trim() || (matches.weight != null && hasCaloricValue && !matches.other)

	return (
		<YStack height={'100%'}>
			<YStack grow={1} m="$2" mt="$5">
				{foods.map((i) => (
					<Card key={i.name} bg="pink">
						<Text>
							{i.name} - {i.totalCalories}
						</Text>
					</Card>
				))}
			</YStack>

			<XStack gap={'$2'} m="$2">
				<TextArea
					grow={1}
					height={LINE_HEIGHT * 3}
					focusStyle={{ borderColor: isValid ? 'gray' : 'red' }}
					placeholder="..."
					value={mainInput}
					textAlignVertical="top"
					onChangeText={setMainInput}
				/>
				<Button disabled={!isValid} theme={isValid ? 'blue_accent' : 'gray'} onPress={() => addFood(matches)} height={'100%'} icon={CornerDownLeft}></Button>
			</XStack>
		</YStack>
	)
}
