import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import React from 'react'
import { useColorScheme } from 'react-native'

import { AnimatedSplashOverlay } from '@/components/animated-icon'
import AppTabs from '@/components/app-tabs'
import { TamaguiProvider } from '@tamagui/core'
import { config } from '../../tamagui.config'

export default function TabLayout() {
	const colorScheme = useColorScheme()
	return (
		<TamaguiProvider config={config} defaultTheme={colorScheme!}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<AnimatedSplashOverlay />
				<AppTabs />
			</ThemeProvider>
		</TamaguiProvider>
	)
}
