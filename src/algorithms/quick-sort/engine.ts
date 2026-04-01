export interface QuickSortStep {
  type: 'partition-start' | 'compare' | 'swap' | 'pivot-place' | 'sorted' | 'done'
  array: number[]
  pivotIndex: number | null
  comparing: number | null
  swapIndices: [number, number] | null
  partitionRange: [number, number]
  sortedIndices: number[]
  iPointer: number
  description: string
}

export function computeSteps(initialArray: number[]): { steps: QuickSortStep[] } {
  const steps: QuickSortStep[] = []
  const arr = [...initialArray]
  const sortedIndices: number[] = []

  function addStep(step: Omit<QuickSortStep, 'array' | 'sortedIndices'>) {
    steps.push({
      ...step,
      array: [...arr],
      sortedIndices: [...sortedIndices],
    })
  }

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) {
        sortedIndices.push(low)
        addStep({
          type: 'sorted',
          pivotIndex: low,
          comparing: null,
          swapIndices: null,
          partitionRange: [low, high],
          iPointer: low,
          description: `Elemento ${arr[low]} na posição ${low} está ordenado (partição unitária)`,
        })
      }
      return
    }

    const pivot = arr[high]

    addStep({
      type: 'partition-start',
      pivotIndex: high,
      comparing: null,
      swapIndices: null,
      partitionRange: [low, high],
      iPointer: low,
      description: `Particionando [${low}..${high}] com pivô ${pivot} na posição ${high}`,
    })

    let i = low

    for (let j = low; j < high; j++) {
      addStep({
        type: 'compare',
        pivotIndex: high,
        comparing: j,
        swapIndices: null,
        partitionRange: [low, high],
        iPointer: i,
        description: `Comparando arr[${j}]=${arr[j]} com pivô ${pivot}`,
      })

      if (arr[j] <= pivot) {
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          addStep({
            type: 'swap',
            pivotIndex: high,
            comparing: null,
            swapIndices: [i, j],
            partitionRange: [low, high],
            iPointer: i + 1,
            description: `Trocando arr[${i}]=${arr[j]} com arr[${j}]=${arr[i]}`,
          })
        }
        i++
      }
    }

    ;[arr[i], arr[high]] = [arr[high], arr[i]]
    sortedIndices.push(i)

    addStep({
      type: 'pivot-place',
      pivotIndex: i,
      comparing: null,
      swapIndices: [i, high],
      partitionRange: [low, high],
      iPointer: i,
      description: `Pivô ${pivot} colocado na posição final ${i}`,
    })

    quickSort(low, i - 1)
    quickSort(i + 1, high)
  }

  quickSort(0, arr.length - 1)

  steps.push({
    type: 'done',
    array: [...arr],
    pivotIndex: null,
    comparing: null,
    swapIndices: null,
    partitionRange: [0, arr.length - 1],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    iPointer: 0,
    description: 'Array ordenado!',
  })

  return { steps }
}
