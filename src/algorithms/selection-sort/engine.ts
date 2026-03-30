// src/algorithms/selection-sort/engine.ts
export interface SelectionSortStep {
  type: 'scan' | 'new-min' | 'swap' | 'sorted' | 'done'
  array: number[]
  currentIndex: number
  minIndex: number
  scanningIndex: number | null
  sortedIndices: number[]
  description: string
}

export function computeSteps(initialArray: number[]): { steps: SelectionSortStep[] } {
  const steps: SelectionSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedIndices: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    // Initial state for this iteration
    steps.push({
      type: 'scan',
      array: [...arr],
      currentIndex: i,
      minIndex: i,
      scanningIndex: i,
      sortedIndices: [...sortedIndices],
      description: `Iniciando busca pelo menor elemento a partir da posição ${i}`,
    })

    for (let j = i + 1; j < n; j++) {
      // Scanning step
      steps.push({
        type: 'scan',
        array: [...arr],
        currentIndex: i,
        minIndex,
        scanningIndex: j,
        sortedIndices: [...sortedIndices],
        description: `Comparando arr[${j}]=${arr[j]} com mínimo atual arr[${minIndex}]=${arr[minIndex]}`,
      })

      if (arr[j] < arr[minIndex]) {
        minIndex = j
        steps.push({
          type: 'new-min',
          array: [...arr],
          currentIndex: i,
          minIndex,
          scanningIndex: j,
          sortedIndices: [...sortedIndices],
          description: `Novo mínimo encontrado: arr[${j}]=${arr[j]}`,
        })
      }
    }

    // Swap if needed
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      steps.push({
        type: 'swap',
        array: [...arr],
        currentIndex: i,
        minIndex,
        scanningIndex: null,
        sortedIndices: [...sortedIndices],
        description: `Trocando arr[${i}]=${arr[minIndex]} com arr[${minIndex}]=${arr[i]}`,
      })
    }

    // Mark position as sorted
    sortedIndices.push(i)
    steps.push({
      type: 'sorted',
      array: [...arr],
      currentIndex: i,
      minIndex: i,
      scanningIndex: null,
      sortedIndices: [...sortedIndices],
      description: `Elemento ${arr[i]} na posição ${i} está ordenado`,
    })
  }

  // Mark last element as sorted
  sortedIndices.push(n - 1)

  steps.push({
    type: 'done',
    array: [...arr],
    currentIndex: n - 1,
    minIndex: n - 1,
    scanningIndex: null,
    sortedIndices: [...sortedIndices],
    description: 'Array ordenado!',
  })

  return { steps }
}
