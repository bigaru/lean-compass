import { Coffee } from '@tamagui/lucide-icons-2'
import { SizableText, View, XStack, YStack } from 'tamagui'

export default function EmptyFoods() {
	return (
		<YStack justify="center" items="center" height="100%">
			<View grow={1} />
			<XStack gap="$2">
				<SizableText mb="$4" size="$8" fontWeight={'bold'}>
					Fasting Mode
				</SizableText>
				<Coffee size="$3" />
			</XStack>
			<YStack>
				<SizableText size="$4">For example, try entering:</SizableText>

				<SizableText
					bg="white"
					px="$4"
					py="$2"
					size="$6"
					borderTopRightRadius="$2"
					borderBottomRightRadius="$2"
					borderTopLeftRadius="$2"
					borderBottomLeftRadius="$2"
				>
					SuperFood 100g 2f 3c 4p
				</SizableText>
				<SizableText size="$4" mt="$1">
					where f = fat, c = carbs and p = protein in grams.
				</SizableText>
			</YStack>
			<View grow={2} />
		</YStack>
	)
}
