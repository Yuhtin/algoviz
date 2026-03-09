// tests/algorithms/bubble-sort/engine.test.ts
import { describe, it, expect } from 'vitest'
import { computeSteps } from '@/algorithms/bubble-sort/engine'

describe('Bubble Sort Engine', () => {
  it('sorts array correctly', () => {
    const { steps } = computeSteps([5, 3, 8, 4, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.array).toEqual([2, 3, 4, 5, 8])
  })

  it('marks comparing indices correctly', () => {
    const { steps } = computeSteps([3, 1])
    // First step should compare indices 0 and 1
    expect(steps[0].comparing).toEqual([0, 1])
  })

  it('marks swapping correctly', () => {
    const { steps } = computeSteps([3, 1])
    // First comparison 3 > 1 should trigger swap
    const swapStep = steps.find(s => s.swapping)
    expect(swapStep).toBeDefined()
  })

  it('tracks sorted portion correctly', () => {
    const { steps } = computeSteps([3, 1, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.sortedIndices.length).toBe(3)
  })
})
