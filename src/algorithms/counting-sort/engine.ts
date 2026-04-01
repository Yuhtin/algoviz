export interface CountingSortStep {
  type: 'find-max' | 'count' | 'cumulate' | 'place' | 'done'
  array: number[]
  countArray: number[]
  outputArray: number[]
  currentIndex: number | null
  currentValue: number | null
  placingAt: number | null
  phase: 'counting' | 'cumulative' | 'placing' | 'done'
  sortedIndices: number[]
  description: string
}

export function computeSteps(initialArray: number[]): { steps: CountingSortStep[] } {
  const steps: CountingSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length

  if (n === 0) {
    steps.push({
      type: 'done',
      array: [],
      countArray: [],
      outputArray: [],
      currentIndex: null,
      currentValue: null,
      placingAt: null,
      phase: 'done',
      sortedIndices: [],
      description: 'Array vazio!',
    })
    return { steps }
  }

  const maxVal = Math.max(...arr)

  steps.push({
    type: 'find-max',
    array: [...arr],
    countArray: [],
    outputArray: [],
    currentIndex: null,
    currentValue: maxVal,
    placingAt: null,
    phase: 'counting',
    sortedIndices: [],
    description: `Valor máximo encontrado: ${maxVal}. Criando array de contagem com ${maxVal + 1} posições.`,
  })

  const count = new Array(maxVal + 1).fill(0)
  const output = new Array(n).fill(0)

  // Counting phase
  for (let i = 0; i < n; i++) {
    count[arr[i]]++
    steps.push({
      type: 'count',
      array: [...arr],
      countArray: [...count],
      outputArray: [...output],
      currentIndex: i,
      currentValue: arr[i],
      placingAt: null,
      phase: 'counting',
      sortedIndices: [],
      description: `Contando arr[${i}]=${arr[i]}: count[${arr[i]}] = ${count[arr[i]]}`,
    })
  }

  // Cumulative phase
  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1]
    steps.push({
      type: 'cumulate',
      array: [...arr],
      countArray: [...count],
      outputArray: [...output],
      currentIndex: null,
      currentValue: i,
      placingAt: null,
      phase: 'cumulative',
      sortedIndices: [],
      description: `Acumulando: count[${i}] = ${count[i]}`,
    })
  }

  // Placing phase (right to left for stability)
  const placedIndices: number[] = []
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i]
    const pos = count[val] - 1
    output[pos] = val
    count[val]--
    placedIndices.push(pos)

    steps.push({
      type: 'place',
      array: [...arr],
      countArray: [...count],
      outputArray: [...output],
      currentIndex: i,
      currentValue: val,
      placingAt: pos,
      phase: 'placing',
      sortedIndices: [...placedIndices],
      description: `Colocando ${val} na posição ${pos} do array de saída`,
    })
  }

  steps.push({
    type: 'done',
    array: [...output],
    countArray: [...count],
    outputArray: [...output],
    currentIndex: null,
    currentValue: null,
    placingAt: null,
    phase: 'done',
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: 'Array ordenado!',
  })

  return { steps }
}
