import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { useState } from 'react'
import { Button, Card, Text, TextArea, XStack, YStack } from 'tamagui'

function match(input: string, regex: RegExp): [boolean, string?] {
	const found = [...input.matchAll(regex)].map((i) => i[1])
	const exists = found.length === 1
	return [exists, found[0]]
}

function matchTrio(input: string): [boolean, [string?, string?, string?]] {
	const fat = /\b(\d+(?:\.\d+)?)f\b/g
	const carb = /\b(\d+(?:\.\d+)?)c\b/g
	const protein = /\b(\d+(?:\.\d+)?)p\b/g

	const regs = [fat, carb, protein].map((r) => match(input, r))
	const hasOne = regs.map((t) => t[0]).reduce((acc, val) => acc || val, false)
	const regValues = regs.map((t) => t[1]) as [string?, string?, string?]
	return [hasOne, regValues]
}

export default function () {
	const [items, setItems] = useState(['icon'])
	const [inputContent, setInputContent] = useState('')
	const [hasError, setError] = useState(false)

	const handleEnter = () => {
		const word = /\b(?!\d)\w+\b/g
		const weight = /\b(\d+(?:\.\d+)?)g\b/g
		const calorie = /\b(\d+(?:\.\d+)?)cal\b/g

		const anySuffix = /\b\d+(?:\.\d+)?(?!(?:g|f|c|p|cal)\b)[a-zA-Z]*\b/g

		const [hasTrio, trioValues] = matchTrio(inputContent)
		const [_, wordValue] = match(inputContent, word)
		const [hasWeight, weightValue] = match(inputContent, weight)
		const [hasCalorie, calorieValue] = match(inputContent, calorie)
		const [hasSuffix] = match(inputContent, anySuffix)

		const trioXORcalorie = hasCalorie !== hasTrio
		const isValid = hasWeight && !hasSuffix && trioXORcalorie
	}

	return (
		<YStack height={'100%'}>
			<YStack grow={1} m="$2" mt="$5">
				{items.map((i) => (
					<Card key={i} bg="pink">
						<Text>i</Text>
					</Card>
				))}
			</YStack>

			<XStack gap={'$2'} m="$2">
				<TextArea grow={1} height={30 * 3} placeholder="Enter your details..." value={inputContent} onChangeText={setInputContent} />
				<Button theme="blue_accent" onPress={handleEnter} height={'100%'} icon={CornerDownLeft}></Button>
			</XStack>
		</YStack>
	)
}
