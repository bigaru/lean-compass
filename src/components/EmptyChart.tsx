import { CircleSlash2 } from '@tamagui/lucide-icons-2'
import { SizableText, XStack, YStack } from 'tamagui'

export default function EmptyFoods() {
	return (
		<YStack justify="center" items="center" height="100%">
			<XStack gap="$2">
				<SizableText mb="$4" size="$8" fontWeight={'bold'}>
					No Data
				</SizableText>
				<CircleSlash2 size="$3" />
			</XStack>
		</YStack>
	)
}
