export interface InsertionSortStep {
  type: 'select' | 'compare' | 'shift' | 'insert' | 'sorted' | 'done'
  array: number[]
  currentIndex: number
  keyValue: number | null
  comparingIndex: number | null
  shiftingIndex: number | null
  insertPosition: number | null
  sortedIndices: number[]
  description: string
}

export function computeSteps(initialArray: number[]): { steps: InsertionSortStep[] } {
  const steps: InsertionSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedIndices: number[] = [0] // First element is already "sorted"

  for (let i = 1; i < n; i++) {
    const key = arr[i]

    steps.push({
      type: 'select',
      array: [...arr],
      currentIndex: i,
      keyValue: key,
      comparingIndex: null,
      shiftingIndex: null,
      insertPosition: null,
      sortedIndices: [...sortedIndices],
      description: `Selecionando chave arr[${i}]=${key} para inserir na parte ordenada`,
    })

    let j = i - 1

    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'compare',
        array: [...arr],
        currentIndex: i,
        keyValue: key,
        comparingIndex: j,
        shiftingIndex: null,
        insertPosition: null,
        sortedIndices: [...sortedIndices],
        description: `Comparando arr[${j}]=${arr[j]} > chave ${key}`,
      })

      arr[j + 1] = arr[j]

      steps.push({
        type: 'shift',
        array: [...arr],
        currentIndex: i,
        keyValue: key,
        comparingIndex: null,
        shiftingIndex: j,
        insertPosition: null,
        sortedIndices: [...sortedIndices],
        description: `Deslocando ${arr[j]} da posição ${j} para ${j + 1}`,
      })

      j--
    }

    if (j >= 0 && j < i - 1) {
      steps.push({
        type: 'compare',
        array: [...arr],
        currentIndex: i,
        keyValue: key,
        comparingIndex: j,
        shiftingIndex: null,
        insertPosition: null,
        sortedIndices: [...sortedIndices],
        description: `arr[${j}]=${arr[j]} ≤ chave ${key}, encontrou posição`,
      })
    }

    arr[j + 1] = key
    sortedIndices.push(i)

    steps.push({
      type: 'insert',
      array: [...arr],
      currentIndex: i,
      keyValue: key,
      comparingIndex: null,
      shiftingIndex: null,
      insertPosition: j + 1,
      sortedIndices: [...sortedIndices],
      description: `Inserindo chave ${key} na posição ${j + 1}`,
    })
  }

  steps.push({
    type: 'done',
    array: [...arr],
    currentIndex: n - 1,
    keyValue: null,
    comparingIndex: null,
    shiftingIndex: null,
    insertPosition: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: 'Array ordenado!',
  })

  return { steps }
}
