import { useStore } from '@/store'
import { addDaysToDate } from '@/utils'
import { ChevronLeft, ChevronRight, Coffee, CornerDownLeft } from '@tamagui/lucide-icons-2'
import * as Localization from 'expo-localization'
import { Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import InfinitePager, { InfinitePagerImperativeApi, InfinitePagerPageProps } from 'react-native-infinite-pager'
import { Button, Card, Sheet, SizableText, TextArea, View, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

function formatDate(d: Date) {
	const locale = Localization.getLocales()[0]
	return d.toLocaleDateString(locale.languageTag, { weekday: 'short', day: '2-digit', month: 'short' })
}

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, isMatchesValid, addFood, selectPage, selectedFood, openSheet, deleteFood } = useStore((state) => state)
	const localeDate = useStore((state) => formatDate(state.currentDate))
	const pagerRef = useRef<InfinitePagerImperativeApi>(null)

	return (
		<>
			<Stack.Screen />
			<YStack height={'100%'} bg="$gray5">
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
				<YStack grow={1}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<InfinitePager ref={pagerRef} PageComponent={FoodList} pageBuffer={1} style={{ flex: 1 }} onPageChange={selectPage} />
					</GestureHandlerRootView>
				</YStack>

				<XStack gap={'$2'} p="$2" py="$3" bg="$black6">
					<TextArea
						grow={1}
						bg={isInputValid ? 'white' : '$red4'}
						maxH={LINE_HEIGHT * 3}
						placeholder="..."
						value={mainInput}
						textAlignVertical="top"
						onChangeText={setMainInput}
					/>
					<Button disabled={!isMatchesValid} theme={isMatchesValid ? 'blue_accent' : 'gray'} onPress={addFood} height={'100%'} icon={CornerDownLeft}></Button>
				</XStack>
				<Sheet open={!!selectedFood} snapPoints={[25]} snapPointsMode="percent" dismissOnSnapToBottom onOpenChange={() => openSheet(null)}>
					<Sheet.Overlay bg="$shadow6" transition="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
					<Sheet.Handle />
					<Sheet.Frame justify="center" p="$3">
						<Button theme="red_accent" onPress={deleteFood}>
							Delete
						</Button>
					</Sheet.Frame>
				</Sheet>
			</YStack>
		</>
	)
}

function FoodList({ index }: InfinitePagerPageProps) {
	const pageDate = addDaysToDate(index).valueOf()
	const data = useStore((state) => state.pageRecord[pageDate]) ?? []
	const loadPage = useStore((state) => state.loadPage)
	const openSheet = useStore((state) => state.openSheet)

	useEffect(() => {
		loadPage(pageDate)
	}, [])

	if (data.length === 0) {
		return <EmptyState />
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

function EmptyState() {
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
