import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons-2'
import { RefObject } from 'react'
import { InfinitePagerImperativeApi } from 'react-native-infinite-pager'
import { Button, SizableText, XStack } from 'tamagui'

export default function PagerNav({ pagerRef, localeDate }: { pagerRef: RefObject<InfinitePagerImperativeApi | null>; localeDate: string }) {
	return (
		<XStack justify="space-between" items="center" my="$2">
			<Button
				circular
				chromeless
				size="$3"
				icon={ChevronLeft}
				onPress={() => {
					pagerRef.current?.decrementPage({ animated: true })
				}}
			/>
			<SizableText>{localeDate}</SizableText>
			<Button
				circular
				chromeless
				size="$3"
				icon={ChevronRight}
				onPress={() => {
					pagerRef.current?.incrementPage({ animated: true })
				}}
			/>
		</XStack>
	)
}
