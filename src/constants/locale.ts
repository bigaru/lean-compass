import * as Localization from 'expo-localization'

const locale = Localization.getLocales()[0]

export const deviceLocale = locale.languageTag
