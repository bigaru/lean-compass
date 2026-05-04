import { useStore } from '@/store'
import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { useMemo } from 'react'
import { Button, Card, Text, TextArea, XStack, YStack } from 'tamagui'

function match(input: string, regex: RegExp, acceptMany: boolean = false): string | undefined {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	return acceptMany || found.length === 1 ? found[0] : undefined
}

const LINE_HEIGHT = 30

const word = /\b(?!\d)(\w+)\b/g
const weight = /\b(\d+(?:\.\d+)?)g\b/g
const calorie = /\b(\d+(?:\.\d+)?)cal\b/g
const fat = /\b(\d+(?:\.\d+)?)f\b/g
const carb = /\b(\d+(?:\.\d+)?)c\b/g
const protein = /\b(\d+(?:\.\d+)?)p\b/g
const other = /\b(\d+(?:\.\d+)?(?!(?:g|f|c|p|cal)\b))[a-zA-Z]*\b/g
const allRegexes: Record<string, RegExp> = { word, weight, calorie, fat, carb, protein }

export default function HomeScreen() {
	const { mainInput, setMainInput, setDebouncedInput } = useStore((state) => state)

	const matches = useMemo(() => {
		const entries = Object.keys(allRegexes).map((k) => [k, match(mainInput, allRegexes[k])])
		entries.push(['other', match(mainInput, other, true)])
		return Object.fromEntries(entries)
	}, [mainInput])

	const hasTrio = !!matches.fat || !!matches.carb || !!matches.protein
	const hasCaloricValue = !!matches.calorie !== hasTrio
	const isValid = !!matches.weight && hasCaloricValue && !matches.other

	return (
		<YStack height={'100%'}>
			<YStack grow={1} m="$2" mt="$5">
				{['icon'].map((i) => (
					<Card key={i} bg="pink">
						<Text>{i}</Text>
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
					onChangeText={setMainInput}
				/>
				<Button
					disabled={!isValid}
					theme={isValid ? 'blue_accent' : 'gray'}
					onPress={() => console.log('>eee>>')}
					height={'100%'}
					icon={CornerDownLeft}
				></Button>
			</XStack>
		</YStack>
	)
}
