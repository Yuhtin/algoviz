import { create } from 'zustand'

export interface AnimationStep {
  index: number
  state: Record<string, unknown>
  description: string
}

interface AnimationState {
  steps: AnimationStep[]
  currentStep: number
  isPlaying: boolean
  speed: number // ms per step

  setSteps: (steps: AnimationStep[]) => void
  play: () => void
  pause: () => void
  reset: () => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (index: number) => void
  setSpeed: (speed: number) => void
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,

  setSteps: (steps) => set({ steps, currentStep: 0, isPlaying: false }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentStep: 0, isPlaying: false }),

  nextStep: () => {
    const { currentStep, steps } = get()
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 })
    } else {
      set({ isPlaying: false })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  goToStep: (index) => {
    const { steps } = get()
    if (index >= 0 && index < steps.length) {
      set({ currentStep: index })
    }
  },

  setSpeed: (speed) => set({ speed }),
}))
