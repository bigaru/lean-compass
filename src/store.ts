import { create } from 'zustand'

interface State {
	mainInput: string
	setMainInput: (text: string) => void
}

const useStore = create<State>((set) => ({
	mainInput: '',
	setMainInput: (text) => set((state) => ({ ...state, mainInput: text })),
}))

export { useStore }
