import { defaultConfig } from '@tamagui/config/v5'
import { animations } from '@tamagui/config/v5-reanimated'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
	...defaultConfig,
	animations,
	media: {
		...defaultConfig.media,
	},
})

type OurConfig = typeof config

declare module 'tamagui' {
	interface TamaguiCustomConfig extends OurConfig {}
}
