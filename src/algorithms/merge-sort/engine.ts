export interface MergeSortStep {
  type: 'split' | 'compare' | 'place' | 'merge-complete' | 'done'
  array: number[]
  leftRange: [number, number] | null
  rightRange: [number, number] | null
  comparing: [number, number] | null
  placing: number | null
  mergedIndices: number[]
  sortedIndices: number[]
  depth: number
  description: string
}

export function computeSteps(initialArray: number[]): { steps: MergeSortStep[] } {
  const steps: MergeSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length

  function addStep(step: Omit<MergeSortStep, 'array'>) {
    steps.push({
      ...step,
      array: [...arr],
    })
  }

  function mergeSort(left: number, right: number, depth: number) {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)

    addStep({
      type: 'split',
      leftRange: [left, mid],
      rightRange: [mid + 1, right],
      comparing: null,
      placing: null,
      mergedIndices: [],
      sortedIndices: [],
      depth,
      description: `Dividindo [${left}..${right}] em [${left}..${mid}] e [${mid + 1}..${right}]`,
    })

    mergeSort(left, mid, depth + 1)
    mergeSort(mid + 1, right, depth + 1)

    // Merge phase
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)
    let i = 0
    let j = 0
    let k = left
    const mergedIndices: number[] = []

    while (i < leftArr.length && j < rightArr.length) {
      addStep({
        type: 'compare',
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        comparing: [left + i, mid + 1 + j],
        placing: null,
        mergedIndices: [...mergedIndices],
        sortedIndices: [],
        depth,
        description: `Comparando ${leftArr[i]} (esquerda) com ${rightArr[j]} (direita)`,
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        mergedIndices.push(k)
        addStep({
          type: 'place',
          leftRange: [left, mid],
          rightRange: [mid + 1, right],
          comparing: null,
          placing: k,
          mergedIndices: [...mergedIndices],
          sortedIndices: [],
          depth,
          description: `Colocando ${leftArr[i]} da esquerda na posição ${k}`,
        })
        i++
      } else {
        arr[k] = rightArr[j]
        mergedIndices.push(k)
        addStep({
          type: 'place',
          leftRange: [left, mid],
          rightRange: [mid + 1, right],
          comparing: null,
          placing: k,
          mergedIndices: [...mergedIndices],
          sortedIndices: [],
          depth,
          description: `Colocando ${rightArr[j]} da direita na posição ${k}`,
        })
        j++
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      mergedIndices.push(k)
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      mergedIndices.push(k)
      j++
      k++
    }

    addStep({
      type: 'merge-complete',
      leftRange: [left, mid],
      rightRange: [mid + 1, right],
      comparing: null,
      placing: null,
      mergedIndices: [...mergedIndices],
      sortedIndices: mergedIndices,
      depth,
      description: `Intercalação de [${left}..${right}] concluída: [${arr.slice(left, right + 1).join(', ')}]`,
    })
  }

  mergeSort(0, n - 1, 0)

  steps.push({
    type: 'done',
    array: [...arr],
    leftRange: null,
    rightRange: null,
    comparing: null,
    placing: null,
    mergedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    depth: 0,
    description: 'Array ordenado!',
  })

  return { steps }
}
