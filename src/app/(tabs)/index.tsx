import { useStore } from '@/store'
import { ChevronLeft, ChevronRight, CornerDownLeft } from '@tamagui/lucide-icons-2'
import { Stack } from 'expo-router'
import { useRef } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import InfinitePager, { InfinitePagerImperativeApi } from 'react-native-infinite-pager'
import { Button, Card, SizableText, TextArea, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

function formatDate(d: Date) {
	return d.toLocaleDateString('de-CH', { weekday: 'short', day: '2-digit', month: 'short' })
}

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, isMatchesValid, addFood, selectPage } = useStore((state) => state)
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
						<InfinitePager ref={pagerRef} PageComponent={FoodList} style={{ flex: 1 }} onPageChange={selectPage} />
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
			</YStack>
		</>
	)
}

function FoodList({ index }: { index: number }) {
	const foods = useStore((state) => state.foods)

	return (
		<ScrollView style={{ height: '100%' }}>
			<YStack m="$2" mt="$0" mb="$4" gap="$2.5">
				{foods.map((item, idx) => (
					<Card key={idx} bg="white" px="$3" py="$3">
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
