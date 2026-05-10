import ChartPage from '@/components/ChartPage'
import PagerNav from '@/components/PagerNav'
import { deviceLocale } from '@/constants/locale'
import { useStore } from '@/store'
import { addDaysToDate } from '@/utils'
import { useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import InfinitePager, { InfinitePagerImperativeApi } from 'react-native-infinite-pager'
import { YStack } from 'tamagui'

function formatDateRange(page: number) {
	const upperBoundInclusive = addDaysToDate(page * 7)
	const lowerBound = addDaysToDate(page * 7 - 6)

	const l = lowerBound.toLocaleDateString(deviceLocale, { day: '2-digit', month: 'short' })
	const u = upperBoundInclusive.toLocaleDateString(deviceLocale, { day: '2-digit', month: 'short' })
	return `${l} - ${u}`
}

export default function StatsScreen() {
	const { selectChartPage } = useStore((state) => state)
	const localeDate = useStore((state) => formatDateRange(state.chartPage))
	const pagerRef = useRef<InfinitePagerImperativeApi>(null)

	return (
		<YStack height={'100%'} bg="$gray5">
			<PagerNav pagerRef={pagerRef} localeDate={localeDate} />
			<YStack grow={1}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<InfinitePager ref={pagerRef} PageComponent={ChartPage} pageBuffer={1} style={{ flex: 1 }} onPageChange={selectChartPage} />
				</GestureHandlerRootView>
			</YStack>
		</YStack>
	)
}
