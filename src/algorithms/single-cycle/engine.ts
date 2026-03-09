// src/algorithms/single-cycle/engine.ts
export interface SingleCycleStep {
  type: 'jump' | 'result'
  from: number
  to: number | null
  jump: number | null
  visitedIndices: Set<number>
  stepNumber: number
  description: string
  result?: boolean
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export function computeSteps(arr: number[]): { steps: SingleCycleStep[]; result: boolean } {
  const steps: SingleCycleStep[] = []
  const visited = new Set<number>()
  let currentIndex = 0
  const n = arr.length

  for (let i = 0; i < n; i++) {
    const jump = arr[currentIndex]
    const nextIndex = mod(currentIndex + jump, n)

    steps.push({
      type: 'jump',
      from: currentIndex,
      to: nextIndex,
      jump,
      visitedIndices: new Set(visited),
      stepNumber: i,
      description: `i=${currentIndex} → salto ${jump > 0 ? '+' : ''}${jump} → i=${nextIndex}`,
    })

    visited.add(currentIndex)
    currentIndex = nextIndex
  }

  const isSingleCycle = currentIndex === 0 && visited.size === n

  steps.push({
    type: 'result',
    from: currentIndex,
    to: null,
    jump: null,
    visitedIndices: new Set(visited),
    stepNumber: steps.length,
    description: isSingleCycle ? 'Ciclo Unico!' : 'Nao e Ciclo Unico',
    result: isSingleCycle,
  })

  return { steps, result: isSingleCycle }
}
