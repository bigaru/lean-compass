import { useStore } from '@/store'
import { addDaysToDate } from '@/utils'
import { useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { InfinitePagerPageProps } from 'react-native-infinite-pager'
import { Card, SizableText, XStack, YStack } from 'tamagui'
import EmptyFoods from './EmptyFoods'

export default function FoodPage({ index }: InfinitePagerPageProps) {
	const pageDate = addDaysToDate(index).valueOf()
	const data = useStore((state) => state.pageRecord[pageDate]) ?? []
	const loadPage = useStore((state) => state.loadPage)
	const openSheet = useStore((state) => state.openSheet)

	useEffect(() => {
		loadPage(pageDate)
	}, [])

	if (data.length === 0) {
		return <EmptyFoods />
	}

	return (
		<ScrollView style={{ height: '100%' }}>
			<YStack m="$2" mt="$0" mb="$4" gap="$2.5">
				{data.map((item) => (
					<Card key={item.id} bg="white" px="$3" py="$3" onLongPress={() => openSheet(item.id)}>
						<YStack>
							<XStack justify="space-between">
								<SizableText size="$6">{item.name}</SizableText>
								<SizableText size="$6" fontWeight="bold">
									{item.totalCalories} cal
								</SizableText>
							</XStack>
							<XStack justify="flex-end">
								<SizableText>
									{item.fat} f / {item.carb} c / {item.protein} p
								</SizableText>
							</XStack>
							<XStack justify="flex-end">
								<SizableText>{item.weight} g</SizableText>
							</XStack>
						</YStack>
					</Card>
				))}
			</YStack>
		</ScrollView>
	)
}
