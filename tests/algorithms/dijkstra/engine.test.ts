import { describe, it, expect } from 'vitest'
import { computeSteps, type GraphData } from '@/algorithms/dijkstra/engine'

describe('Dijkstra Engine', () => {
  const simpleGraph: GraphData = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      ['A', 'B', 1],
      ['A', 'C', 4],
      ['B', 'C', 2],
      ['B', 'D', 6],
      ['C', 'D', 3],
    ],
    start: 'A',
  }

  it('generates steps for a simple graph', () => {
    const { steps, finalDistances } = computeSteps(simpleGraph)

    expect(steps.length).toBeGreaterThan(0)
    expect(steps[0].type).toBe('init')
    expect(steps[steps.length - 1].type).toBe('done')
  })

  it('calculates correct shortest distances', () => {
    const { finalDistances } = computeSteps(simpleGraph)

    expect(finalDistances.get('A')).toBe(0)
    expect(finalDistances.get('B')).toBe(1) // A -> B
    expect(finalDistances.get('C')).toBe(3) // A -> B -> C
    expect(finalDistances.get('D')).toBe(6) // A -> B -> C -> D
  })

  it('handles linear graph', () => {
    const linearGraph: GraphData = {
      nodes: ['A', 'B', 'C'],
      edges: [
        ['A', 'B', 2],
        ['B', 'C', 3],
      ],
      start: 'A',
    }

    const { finalDistances } = computeSteps(linearGraph)

    expect(finalDistances.get('A')).toBe(0)
    expect(finalDistances.get('B')).toBe(2)
    expect(finalDistances.get('C')).toBe(5)
  })

  it('includes all step types', () => {
    const { steps } = computeSteps(simpleGraph)

    const stepTypes = new Set(steps.map((s) => s.type))

    expect(stepTypes.has('init')).toBe(true)
    expect(stepTypes.has('select')).toBe(true)
    expect(stepTypes.has('visit')).toBe(true)
    expect(stepTypes.has('done')).toBe(true)
  })
})
