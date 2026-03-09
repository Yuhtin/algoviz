// src/algorithms/bubble-sort/engine.ts
export interface BubbleSortStep {
  type: 'compare' | 'swap' | 'sorted' | 'done'
  array: number[]
  comparing: [number, number] | null
  swapping: boolean
  sortedIndices: number[]
  description: string
}

export function computeSteps(initialArray: number[]): { steps: BubbleSortStep[] } {
  const steps: BubbleSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedIndices: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      steps.push({
        type: 'compare',
        array: [...arr],
        comparing: [j, j + 1],
        swapping: false,
        sortedIndices: [...sortedIndices],
        description: `Comparando arr[${j}]=${arr[j]} com arr[${j + 1}]=${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        // Swap step
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true

        steps.push({
          type: 'swap',
          array: [...arr],
          comparing: [j, j + 1],
          swapping: true,
          sortedIndices: [...sortedIndices],
          description: `Trocando ${arr[j + 1]} ↔ ${arr[j]}`,
        })
      }
    }

    // Mark last element of this pass as sorted
    sortedIndices.unshift(n - i - 1)
    steps.push({
      type: 'sorted',
      array: [...arr],
      comparing: null,
      swapping: false,
      sortedIndices: [...sortedIndices],
      description: `Elemento ${arr[n - i - 1]} na posicao correta`,
    })

    if (!swapped) break
  }

  // Mark remaining as sorted
  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) {
      sortedIndices.push(i)
    }
  }
  sortedIndices.sort((a, b) => a - b)

  steps.push({
    type: 'done',
    array: [...arr],
    comparing: null,
    swapping: false,
    sortedIndices: [...sortedIndices],
    description: 'Array ordenado!',
  })

  return { steps }
}
