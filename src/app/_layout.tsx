import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import React from 'react'
import { useColorScheme } from 'react-native'

import { TamaguiProvider } from '@tamagui/core'
import { Stack } from 'expo-router'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { config } from '../../tamagui.config'

export default function RootLayout() {
	const colorScheme = useColorScheme()
	return (
		<KeyboardProvider>
			<TamaguiProvider config={config} defaultTheme={colorScheme!}>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					</Stack>
				</ThemeProvider>
			</TamaguiProvider>
		</KeyboardProvider>
	)
}
