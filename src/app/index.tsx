import { useStore } from '@/store'
import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { Button, Card, Text, TextArea, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, foods, addFood } = useStore((state) => state)

	return (
		<YStack height={'100%'}>
			<YStack grow={1} m="$2" mt="$5">
				{foods.map((i) => (
					<Card key={i.name} bg="pink">
						<Text>
							{i.name} - {i.totalCalories}
						</Text>
					</Card>
				))}
			</YStack>

			<XStack gap={'$2'} m="$2">
				<TextArea
					grow={1}
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
	)
}
