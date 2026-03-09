// src/algorithms/two-sum/engine.ts
export interface TwoSumStep {
  type: 'check' | 'add' | 'found' | 'not_found'
  array: number[]
  target: number
  currentIndex: number
  currentValue: number
  complement: number
  hashMap: Map<number, number>
  found: [number, number] | null
  description: string
}

export function computeSteps(
  array: number[],
  target: number
): { steps: TwoSumStep[]; result: [number, number] | null } {
  const steps: TwoSumStep[] = []
  const hashMap = new Map<number, number>()

  for (let i = 0; i < array.length; i++) {
    const currentValue = array[i]
    const complement = target - currentValue

    // Check if complement exists
    if (hashMap.has(complement)) {
      const complementIndex = hashMap.get(complement)!
      steps.push({
        type: 'found',
        array,
        target,
        currentIndex: i,
        currentValue,
        complement,
        hashMap: new Map(hashMap),
        found: [complementIndex, i],
        description: `Encontrado! arr[${complementIndex}]+arr[${i}] = ${array[complementIndex]}+${currentValue} = ${target}`,
      })
      return { steps, result: [complementIndex, i] }
    }

    // Add to hash map
    hashMap.set(currentValue, i)
    steps.push({
      type: 'add',
      array,
      target,
      currentIndex: i,
      currentValue,
      complement,
      hashMap: new Map(hashMap),
      found: null,
      description: `Verificando arr[${i}]=${currentValue}. Complemento ${complement} nao encontrado. Adicionando ${currentValue} -> ${i} ao hash map.`,
    })
  }

  steps.push({
    type: 'not_found',
    array,
    target,
    currentIndex: -1,
    currentValue: 0,
    complement: 0,
    hashMap: new Map(hashMap),
    found: null,
    description: 'Nenhum par encontrado',
  })

  return { steps, result: null }
}
