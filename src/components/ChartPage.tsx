import inter from '@/assets/inter-medium.ttf'
import { deviceLocale } from '@/constants/locale'
import { useStore } from '@/store'
import { addDaysToDate } from '@/utils'
import { Text as SkiaText, useFont } from '@shopify/react-native-skia'
import { useEffect } from 'react'
import { InfinitePagerPageProps } from 'react-native-infinite-pager'
import { SizableText, View, XStack, YStack } from 'tamagui'
import { CartesianChart, StackedBar } from 'victory-native'
import EmptyChart from './EmptyChart'

const numberFormatter = new Intl.NumberFormat(deviceLocale, { notation: 'compact', maximumFractionDigits: 1 })
const fatColor = '#E01A4F'
const carbColor = '#F15946'
const proteinColor = '#F9C22E'

function formatXLabel(ms: number) {
	return new Date(ms).toLocaleDateString(deviceLocale, { weekday: 'short' })
}

function formatYLabel(n: number) {
	return numberFormatter.format(n)
}

const range = (start: number, end: number) => Array.from({ length: end - start }, (_, i) => start + i)

export default function ChartPage({ index }: InfinitePagerPageProps) {
	const upperBound = addDaysToDate(index * 7 + 1).valueOf()
	const lowerBound = addDaysToDate(index * 7 - 6).valueOf()

	const { loadLastSeven } = useStore((state) => state)
	const hasChangedInRange = useStore((state) => {
		return Object.entries(state.pageRecord)
			.filter(([key]) => lowerBound <= Number(key) && Number(key) < upperBound)
			.reduce((acc, [_key, item]) => acc + item.length, 0)
	})

	useEffect(() => {
		loadLastSeven(index)
	}, [hasChangedInRange])

	const tickValues = range(index * 7 - 6, index * 7 + 1).map((k) => addDaysToDate(k).valueOf())
	const chartData = useStore((state) => state.chartRecord[index]) ?? []
	const font = useFont(inter, 12)
	const maxY = Math.floor(Math.max(...chartData.map((d) => d.cal)) * 1.1)

	if (chartData.length === 0) {
		return <EmptyChart />
	}

	return (
		<YStack p="$3" height="100%">
			<CartesianChart
				data={chartData}
				padding={{ top: 30 }}
				yAxis={[{ font: font, formatYLabel }]}
				xAxis={{ font: font, tickValues, tickCount: tickValues.length, formatXLabel }}
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
					<StackedBar points={[points.fat, points.carb, points.protein]} chartBounds={chartBounds} barWidth={40} colors={[fatColor, carbColor, proteinColor]} />
				)}
			</CartesianChart>
			<XStack gap="$5" justify="center" mt="$4">
				{[
					[fatColor, 'Fat'],
					[carbColor, 'Carb'],
					[proteinColor, 'Protein'],
				].map(([color, text]) => (
					<XStack items="center" gap="$2" key={text}>
						<View
							bg={color as any}
							borderTopRightRadius="$5"
							borderBottomRightRadius="$5"
							borderTopLeftRadius="$5"
							borderBottomLeftRadius="$5"
							height={20}
							width={20}
						/>
						<SizableText size="$5">{text}</SizableText>
					</XStack>
				))}
			</XStack>
		</YStack>
	)
}
