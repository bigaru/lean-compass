import FoodPage from '@/components/FoodPage'
import PagerNav from '@/components/PagerNav'
import { deviceLocale } from '@/constants/locale'
import { useStore } from '@/store'
import { CornerDownLeft } from '@tamagui/lucide-icons-2'
import { useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import InfinitePager, { InfinitePagerImperativeApi } from 'react-native-infinite-pager'
import { Button, Sheet, TextArea, XStack, YStack } from 'tamagui'

const LINE_HEIGHT = 30

function formatDate(d: Date) {
	return d.toLocaleDateString(deviceLocale, { weekday: 'short', day: '2-digit', month: 'short' })
}

export default function HomeScreen() {
	const { mainInput, setMainInput, isInputValid, isMatchesValid, addFood, selectPage, selectedFood, openSheet, deleteFood } = useStore((state) => state)
	const localeDate = useStore((state) => formatDate(state.currentDate))
	const pagerRef = useRef<InfinitePagerImperativeApi>(null)

	return (
		<YStack height={'100%'} bg="$gray5">
			<PagerNav pagerRef={pagerRef} localeDate={localeDate} />
			<YStack grow={1}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<InfinitePager ref={pagerRef} PageComponent={FoodPage} pageBuffer={1} style={{ flex: 1 }} onPageChange={selectPage} />
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
	)
}
