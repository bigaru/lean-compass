import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import React from 'react'
import { useColorScheme } from 'react-native'

import AppTabs from '@/components/app-tabs'
import { TamaguiProvider } from '@tamagui/core'
import { Stack } from 'expo-router'
import { config } from '../../tamagui.config'

export default function RootLayout() {
	const colorScheme = useColorScheme()
	return (
		<TamaguiProvider config={config} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<AppTabs />
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</ThemeProvider>
		</TamaguiProvider>
	)
}
