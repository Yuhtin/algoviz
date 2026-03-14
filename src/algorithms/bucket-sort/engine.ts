// src/algorithms/bucket-sort/engine.ts
export interface BucketSortStep {
  type: 'init' | 'distribute' | 'sort-bucket' | 'collect' | 'done'
  array: number[]
  buckets: number[][]
  currentBucket: number | null
  currentElement: number | null
  sortedIndices: number[]
  description: string
}

export function computeSteps(initialArray: number[]): { steps: BucketSortStep[] } {
  const steps: BucketSortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const numBuckets = n

  // Initialize buckets
  const buckets: number[][] = Array.from({ length: numBuckets }, () => [])

  steps.push({
    type: 'init',
    array: [...arr],
    buckets: buckets.map(b => [...b]),
    currentBucket: null,
    currentElement: null,
    sortedIndices: [],
    description: `Inicializando ${numBuckets} buckets vazios`,
  })

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.min(Math.floor(arr[i] * numBuckets), numBuckets - 1)
    buckets[bucketIndex].push(arr[i])

    steps.push({
      type: 'distribute',
      array: [...arr],
      buckets: buckets.map(b => [...b]),
      currentBucket: bucketIndex,
      currentElement: i,
      sortedIndices: [],
      description: `Distribuindo ${arr[i].toFixed(2)} para bucket ${bucketIndex}`,
    })
  }

  // Sort each bucket using insertion sort
  for (let i = 0; i < numBuckets; i++) {
    if (buckets[i].length > 1) {
      buckets[i].sort((a, b) => a - b)

      steps.push({
        type: 'sort-bucket',
        array: [...arr],
        buckets: buckets.map(b => [...b]),
        currentBucket: i,
        currentElement: null,
        sortedIndices: [],
        description: `Ordenando bucket ${i}: [${buckets[i].map(v => v.toFixed(2)).join(', ')}]`,
      })
    }
  }

  // Collect elements from buckets
  const result: number[] = []
  const sortedIndices: number[] = []

  for (let i = 0; i < numBuckets; i++) {
    for (const value of buckets[i]) {
      const resultIndex = result.length
      result.push(value)
      sortedIndices.push(resultIndex)

      steps.push({
        type: 'collect',
        array: [...result],
        buckets: buckets.map(b => [...b]),
        currentBucket: i,
        currentElement: resultIndex,
        sortedIndices: [...sortedIndices],
        description: `Coletando ${value.toFixed(2)} do bucket ${i}`,
      })
    }
  }

  steps.push({
    type: 'done',
    array: [...result],
    buckets: buckets.map(b => [...b]),
    currentBucket: null,
    currentElement: null,
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    description: 'Array ordenado!',
  })

  return { steps }
}
