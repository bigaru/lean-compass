import { useStore } from '@/store'
import { ChevronLeft, ChevronRight, CornerDownLeft } from '@tamagui/lucide-icons-2'
import { Stack } from 'expo-router'
import PagerView from 'react-native-pager-view'

import { Button, Card, ScrollView, SizableText, TextArea, XStack, YStack } from 'tamagui'

const formatOpt: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' }
const LINE_HEIGHT = 30

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, isMatchesValid, addFood } = useStore((state) => state)
	const totalCount = useStore((state) => state.foods.reduce((acc, item) => acc + item.totalCalories, 0))

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Today',
					headerShown: true,
					headerRight: () => (
						<SizableText pr="$4" size="$6" fontWeight={'bold'}>
							{totalCount} cal
						</SizableText>
					),
				}}
			/>
			<YStack height={'100%'} bg="$gray5">
				<XStack justify="space-between" items="center" my="$2">
					<Button circular chromeless size="$3" icon={ChevronLeft} />
					<SizableText>{new Date().toLocaleDateString('de-CH', formatOpt)}</SizableText>
					<Button circular chromeless size="$3" icon={ChevronRight} />
				</XStack>
				<YStack grow={1}>
					<PagerView initialPage={0} style={{ flex: 1 }}>
						<FoodList key={2} />
						<FoodList key={1} />
					</PagerView>
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

function FoodList() {
	const { foods } = useStore((state) => state)

	return (
		<ScrollView height="100%">
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
