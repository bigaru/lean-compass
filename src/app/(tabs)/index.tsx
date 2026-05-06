import { useStore } from '@/store'
import { Stack } from 'expo-router'

import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { Button, Card, ScrollView, SizableText, TextArea, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, foods, addFood } = useStore((state) => state)

	return (
		<>
			<Stack.Screen options={{ title: 'Today', headerShown: true }} />
			<YStack height={'100%'} bg="#f2f2f2">
				<ScrollView>
					<YStack grow={1} m="$2" mt="$4" gap="$2.5">
						{foods.map((item, idx) => (
							<Card key={idx} bg="white" px="$4" py="$3">
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

				<XStack gap={'$2'} m="$2">
					<TextArea
						grow={1}
						bg="white"
						height={LINE_HEIGHT * 3}
						focusStyle={{ borderColor: isInputValid ? 'gray' : 'red' }}
						placeholder="..."
						value={mainInput}
						textAlignVertical="top"
						onChangeText={setMainInput}
					/>
					<Button disabled={!isInputValid} theme={isInputValid ? 'blue_accent' : 'gray'} onPress={addFood} height={'100%'} icon={CornerDownLeft}></Button>
				</XStack>
			</YStack>
		</>
	)
}
