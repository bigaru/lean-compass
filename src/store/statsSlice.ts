import * as DB from '@/db'
import { CalDay } from '@/types'
import { StateCreator } from 'zustand'
import { MainState } from './index'

export interface StatsState {
	chartRecord: Record<number, CalDay[]>
	chartPage: number
	loadLastSeven: (n: number) => void
	selectChartPage: (n: number) => void
}

export const createStatsSlice: StateCreator<MainState, [], [], StatsState> = (set) => {
	return {
		chartRecord: {},
		chartPage: 0,
		loadLastSeven: async (n: number) => {
			const data = await DB.getLastSeven(n)
			set((state) => ({ ...state, chartRecord: { ...state.chartRecord, [n]: data } }))
		},
		selectChartPage: (n) => set((state) => ({ ...state, chartPage: n })),
	}
}
