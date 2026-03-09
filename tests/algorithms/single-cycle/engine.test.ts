// tests/algorithms/single-cycle/engine.test.ts
import { describe, it, expect } from 'vitest'
import { computeSteps } from '@/algorithms/single-cycle/engine'

describe('Single Cycle Engine', () => {
  it('returns true for valid single cycle', () => {
    const { steps, result } = computeSteps([2, 3, 1, -4, -4, 2])
    expect(result).toBe(true)
    expect(steps.length).toBeGreaterThan(0)
  })

  it('returns false for invalid cycle', () => {
    const { steps, result } = computeSteps([1, 1, 1, 1, 2])
    expect(result).toBe(false)
  })

  it('tracks visited indices correctly', () => {
    const { steps } = computeSteps([2, 3, 1, -4, -4, 2])
    const lastStep = steps[steps.length - 1]
    expect(lastStep.visitedIndices.size).toBe(6)
  })

  it('computes correct jump destinations', () => {
    const { steps } = computeSteps([2, 3, 1, -4, -4, 2])
    // First step: index 0, value 2, next = (0+2) % 6 = 2
    expect(steps[0].from).toBe(0)
    expect(steps[0].to).toBe(2)
    expect(steps[0].jump).toBe(2)
  })
})
