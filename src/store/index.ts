import * as DB from '@/db'
import { create } from 'zustand'
import { createHomeSlice, HomeState } from './homeSlice'
import { createStatsSlice, StatsState } from './statsSlice'

export type MainState = HomeState & StatsState

export const useStore = create<MainState>()((...args) => {
	DB.init()

	return {
		...createHomeSlice(...args),
		...createStatsSlice(...args),
	}
})
