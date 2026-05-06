import { useStore } from '@/store'
import { Stack } from 'expo-router'

import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { Button, Card, ScrollView, SizableText, TextArea, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, isMatchesValid, foods, addFood } = useStore((state) => state)
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
			<YStack height={'100%'} bg="$gray6">
				<ScrollView>
					<YStack grow={1} m="$2" my="$4" gap="$2.5">
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
