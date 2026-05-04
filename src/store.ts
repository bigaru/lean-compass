import { create } from 'zustand'

interface State {
	mainInput: string
	debouncedInput: string
	setMainInput: (text: string) => void
	setDebouncedInput: (text: string) => void
}

const useStore = create<State>((set) => ({
	mainInput: '',
	debouncedInput: '',
	setMainInput: (text) => set((state) => ({ ...state, mainInput: text })),
	setDebouncedInput: (text) => set((state) => ({ ...state, debouncedInput: text })),
}))

export { useStore }
