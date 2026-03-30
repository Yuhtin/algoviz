// src/algorithms/lru-cache/engine.ts

export interface LRUCacheData {
  capacity: number
  operations: (['put', number, string] | ['get', number])[]
}

export interface CacheItem {
  key: number
  value: string
}

export type LRUStepType =
  | 'init'
  | 'get-start'
  | 'get-hit'
  | 'get-miss'
  | 'get-move-front'
  | 'put-start'
  | 'put-update'
  | 'put-insert'
  | 'put-evict'
  | 'done'

export interface LRUStep {
  type: LRUStepType
  cache: CacheItem[] // ordered from most recent (front) to least recent (back)
  capacity: number
  currentKey: number | null
  currentValue: string | null
  evictedKey: number | null
  description: string
  operationIndex: number
  result: string | null
}

export function computeSteps(data: LRUCacheData): {
  steps: LRUStep[]
} {
  const steps: LRUStep[] = []
  const { capacity, operations } = data

  // Internal cache state (array acts as doubly linked list, front = most recent)
  const cache: CacheItem[] = []
  const cacheMap = new Map<number, number>() // key -> index in cache

  function getOrderedCache(): CacheItem[] {
    return [...cache]
  }

  steps.push({
    type: 'init',
    cache: [],
    capacity,
    currentKey: null,
    currentValue: null,
    evictedKey: null,
    description: `Inicializando LRU Cache com capacidade ${capacity}`,
    operationIndex: -1,
    result: null,
  })

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i]

    if (op[0] === 'get') {
      const key = op[1]

      steps.push({
        type: 'get-start',
        cache: getOrderedCache(),
        capacity,
        currentKey: key,
        currentValue: null,
        evictedKey: null,
        description: `Get(${key})`,
        operationIndex: i,
        result: null,
      })

      const idx = cache.findIndex((item) => item.key === key)

      if (idx === -1) {
        steps.push({
          type: 'get-miss',
          cache: getOrderedCache(),
          capacity,
          currentKey: key,
          currentValue: null,
          evictedKey: null,
          description: `Key ${key} nao encontrada no cache`,
          operationIndex: i,
          result: '-1',
        })
      } else {
        const item = cache[idx]

        // Move to front
        cache.splice(idx, 1)
        cache.unshift(item)

        steps.push({
          type: 'get-hit',
          cache: getOrderedCache(),
          capacity,
          currentKey: key,
          currentValue: item.value,
          evictedKey: null,
          description: `Key ${key} encontrada! Valor: "${item.value}"`,
          operationIndex: i,
          result: item.value,
        })

        steps.push({
          type: 'get-move-front',
          cache: getOrderedCache(),
          capacity,
          currentKey: key,
          currentValue: item.value,
          evictedKey: null,
          description: `Movendo ${key} para o inicio (mais recente)`,
          operationIndex: i,
          result: item.value,
        })
      }
    } else if (op[0] === 'put') {
      const key = op[1]
      const value = op[2]

      steps.push({
        type: 'put-start',
        cache: getOrderedCache(),
        capacity,
        currentKey: key,
        currentValue: value,
        evictedKey: null,
        description: `Put(${key}, "${value}")`,
        operationIndex: i,
        result: null,
      })

      const idx = cache.findIndex((item) => item.key === key)

      if (idx !== -1) {
        // Update existing
        cache.splice(idx, 1)
        cache.unshift({ key, value })

        steps.push({
          type: 'put-update',
          cache: getOrderedCache(),
          capacity,
          currentKey: key,
          currentValue: value,
          evictedKey: null,
          description: `Atualizando ${key} com novo valor "${value}" e movendo para frente`,
          operationIndex: i,
          result: null,
        })
      } else {
        // Check if need to evict
        if (cache.length >= capacity) {
          const evicted = cache.pop()!

          steps.push({
            type: 'put-evict',
            cache: getOrderedCache(),
            capacity,
            currentKey: key,
            currentValue: value,
            evictedKey: evicted.key,
            description: `Cache cheio! Removendo ${evicted.key} (menos recente)`,
            operationIndex: i,
            result: null,
          })
        }

        // Insert new
        cache.unshift({ key, value })

        steps.push({
          type: 'put-insert',
          cache: getOrderedCache(),
          capacity,
          currentKey: key,
          currentValue: value,
          evictedKey: null,
          description: `Inserindo ${key}:"${value}" no inicio`,
          operationIndex: i,
          result: null,
        })
      }
    }
  }

  steps.push({
    type: 'done',
    cache: getOrderedCache(),
    capacity,
    currentKey: null,
    currentValue: null,
    evictedKey: null,
    description: `Concluido! Cache final com ${cache.length} item(s)`,
    operationIndex: -1,
    result: null,
  })

  return { steps }
}
