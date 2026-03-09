// tests/algorithms/two-sum/engine.test.ts
import { describe, it, expect } from 'vitest'
import { computeSteps } from '@/algorithms/two-sum/engine'

describe('Two Sum Engine', () => {
  it('finds correct pair', () => {
    const { steps, result } = computeSteps([2, 7, 11, 15], 9)
    expect(result).toEqual([0, 1])
  })

  it('returns null when no pair exists', () => {
    const { result } = computeSteps([1, 2, 3], 10)
    expect(result).toBeNull()
  })

  it('tracks hash map correctly', () => {
    const { steps } = computeSteps([2, 7, 11, 15], 9)
    // After first element, hash map should have 2 -> 0
    expect(steps[0].hashMap.get(2)).toBe(0)
  })

  it('identifies complement correctly', () => {
    const { steps } = computeSteps([2, 7, 11, 15], 9)
    // When checking 7, complement is 9-7=2, which exists
    const foundStep = steps.find(s => s.found !== null)
    expect(foundStep).toBeDefined()
    expect(foundStep?.complement).toBe(2)
  })
})
