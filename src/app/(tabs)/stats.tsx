import { useStore } from '@/store'
import { Stack } from 'expo-router'
import { YStack } from 'tamagui'

export default function StatsScreen() {
	const {} = useStore((state) => state)

	return (
		<>
			<Stack.Screen />
			<YStack height={'100%'} bg="$gray5"></YStack>
		</>
	)
}
