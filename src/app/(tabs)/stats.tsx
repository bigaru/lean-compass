import inter from '@/assets/inter-medium.ttf'
import { deviceLocale } from '@/constants/locale'
import { useStore } from '@/store'
import { addDaysToDate } from '@/utils'
import { Text as SkiaText, useFont } from '@shopify/react-native-skia'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons-2'
import { Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import InfinitePager, { InfinitePagerImperativeApi, InfinitePagerPageProps } from 'react-native-infinite-pager'
import { Button, SizableText, XStack, YStack } from 'tamagui'
import { CartesianChart, StackedBar } from 'victory-native'

function formatDateRange(page: number) {
	const upperBoundInclusive = addDaysToDate(page * 7)
	const lowerBound = addDaysToDate(page * 7 - 6)

	const l = lowerBound.toLocaleDateString(deviceLocale, { day: '2-digit', month: 'short' })
	const u = upperBoundInclusive.toLocaleDateString(deviceLocale, { day: '2-digit', month: 'short' })
	return `${l} - ${u}`
}

const numberFormatter = new Intl.NumberFormat(deviceLocale, { notation: 'compact', maximumFractionDigits: 1 })

function formatLabelX(ms: number) {
	return new Date(ms).toLocaleDateString(deviceLocale, { weekday: 'short' })
}

function formatNumber(n: number) {
	return numberFormatter.format(n)
}

export default function StatsScreen() {
	const { selectChartPage } = useStore((state) => state)
	const localeDate = useStore((state) => formatDateRange(state.chartPage))
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
						<InfinitePager ref={pagerRef} PageComponent={ChartPage} pageBuffer={1} style={{ flex: 1 }} onPageChange={selectChartPage} />
					</GestureHandlerRootView>
				</YStack>
			</YStack>
		</>
	)
}

function ChartPage({ index }: InfinitePagerPageProps) {
	const { loadLastSeven } = useStore((state) => state)
	useEffect(() => {
		loadLastSeven(index)
	}, [])

	const chartData = useStore((state) => state.chartRecord[index]) ?? []
	const font = useFont(inter, 12)
	const maxY = Math.floor(Math.max(...chartData.map((d) => d.cal)) * 1.1)

	return (
		<YStack p="$3" height="100%">
			<CartesianChart
				data={chartData}
				padding={{ top: 30 }}
				yAxis={[{ font: font, formatYLabel: formatNumber }]}
				xAxis={{ font: font, tickValues: chartData.map((d) => d.createdAt), formatXLabel: (val) => formatLabelX(val) }}
				xKey="createdAt"
				yKeys={['fat', 'carb', 'protein']}
				domainPadding={{ left: 50, right: 50 }}
				domain={{ y: [0, maxY] }}
				renderOutside={({ chartBounds }) => (
					<>
						<SkiaText x={0} y={chartBounds.top - 15} font={font} text={'Calories'} />
					</>
				)}
			>
				{({ points, chartBounds }) => (
					<StackedBar points={[points.fat, points.carb, points.protein]} chartBounds={chartBounds} colors={['#E01A4F', '#F15946', '#F9C22E']} />
				)}
			</CartesianChart>
		</YStack>
	)
}
