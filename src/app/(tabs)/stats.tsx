import inter from '@/assets/inter-medium.ttf'
import { getLastSeven } from '@/db'
import { useStore } from '@/store'
import { Text as SkiaText, useFont } from '@shopify/react-native-skia'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons-2'
import * as Localization from 'expo-localization'
import { Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { InfinitePagerImperativeApi } from 'react-native-infinite-pager'
import { Button, SizableText, XStack, YStack } from 'tamagui'
import { Bar, CartesianChart } from 'victory-native'

function formatDate(d: Date) {
	const locale = Localization.getLocales()[0]
	return d.toLocaleDateString(locale.languageTag, { weekday: 'short', day: '2-digit', month: 'short' })
}
function formatX(ms: number) {
	const locale = Localization.getLocales()[0]
	return new Date(ms).toLocaleDateString(locale.languageTag, { weekday: 'short' })
}

export default function StatsScreen() {
	const {} = useStore((state) => state)
	const localeDate = useStore((state) => formatDate(state.currentDate))
	const pagerRef = useRef<InfinitePagerImperativeApi>(null)

	const [data, setData] = useState<any[]>([])
	const font = useFont(inter, 12)

	useEffect(() => {
		getLastSeven(0).then(setData)
	})

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
				<YStack grow={1} p="$3">
					<CartesianChart
						data={data}
						padding={{ top: 30 }}
						yAxis={[{ font: font }]}
						xAxis={{ font: font, tickValues: data.map((d) => d.createdAt), formatXLabel: (val) => formatX(val) }}
						xKey="createdAt"
						yKeys={['cal']}
						domainPadding={{ left: 40, right: 40 }}
						renderOutside={({ chartBounds }) => (
							<>
								<SkiaText x={0} y={chartBounds.top - 15} font={font} text={'Calories'} />
							</>
						)}
					>
						{({ points, chartBounds }) => <Bar points={points.cal} chartBounds={chartBounds} color="rgb(55, 55, 116)" />}
					</CartesianChart>
				</YStack>
			</YStack>
		</>
	)
}
