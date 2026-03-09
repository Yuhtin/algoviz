import { describe, it, expect, beforeEach } from 'vitest'
import { useAnimationStore } from '@/stores/animation-store'

describe('useAnimationStore', () => {
  beforeEach(() => {
    useAnimationStore.setState({
      steps: [],
      currentStep: 0,
      isPlaying: false,
      speed: 500,
    })
  })

  it('should initialize with default values', () => {
    const state = useAnimationStore.getState()
    expect(state.steps).toEqual([])
    expect(state.currentStep).toBe(0)
    expect(state.isPlaying).toBe(false)
    expect(state.speed).toBe(500)
  })

  it('should set steps and reset state', () => {
    const steps = [
      { index: 0, state: { value: 1 }, description: 'Step 1' },
      { index: 1, state: { value: 2 }, description: 'Step 2' },
    ]

    useAnimationStore.getState().setSteps(steps)

    const state = useAnimationStore.getState()
    expect(state.steps).toEqual(steps)
    expect(state.currentStep).toBe(0)
    expect(state.isPlaying).toBe(false)
  })

  it('should navigate to next step', () => {
    const steps = [
      { index: 0, state: {}, description: 'Step 1' },
      { index: 1, state: {}, description: 'Step 2' },
    ]
    useAnimationStore.getState().setSteps(steps)

    useAnimationStore.getState().nextStep()

    expect(useAnimationStore.getState().currentStep).toBe(1)
  })

  it('should stop playing at last step', () => {
    const steps = [{ index: 0, state: {}, description: 'Step 1' }]
    useAnimationStore.getState().setSteps(steps)
    useAnimationStore.getState().play()

    useAnimationStore.getState().nextStep()

    expect(useAnimationStore.getState().isPlaying).toBe(false)
  })

  it('should go to specific step', () => {
    const steps = [
      { index: 0, state: {}, description: 'Step 1' },
      { index: 1, state: {}, description: 'Step 2' },
      { index: 2, state: {}, description: 'Step 3' },
    ]
    useAnimationStore.getState().setSteps(steps)

    useAnimationStore.getState().goToStep(2)

    expect(useAnimationStore.getState().currentStep).toBe(2)
  })
})
