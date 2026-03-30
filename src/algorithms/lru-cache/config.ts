// src/algorithms/lru-cache/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { LRUCacheData } from './engine'

export const config = {
  slug: 'lru-cache',
  name: 'LRU Cache',
  category: 'Hash' as const,
  description: 'Cache com politica Least Recently Used - remove o item menos recentemente usado quando cheio.',
  difficulty: 'Difícil' as const,
  complexity: {
    time: 'O(1)',
    space: 'O(capacity)',
  },
  tags: ['Cache', 'Hash Table', 'Linked List', 'Design'],
  presets: [
    {
      label: 'Cache Simples (cap=3)',
      data: {
        capacity: 3,
        operations: [
          ['put', 1, 'A'],
          ['put', 2, 'B'],
          ['put', 3, 'C'],
          ['get', 1],
          ['put', 4, 'D'],
          ['get', 2],
          ['get', 3],
        ] as (['put', number, string] | ['get', number])[],
      },
    },
    {
      label: 'Acesso Repetido (cap=2)',
      data: {
        capacity: 2,
        operations: [
          ['put', 1, 'X'],
          ['put', 2, 'Y'],
          ['get', 1],
          ['put', 3, 'Z'],
          ['get', 2],
          ['get', 1],
          ['put', 4, 'W'],
        ] as (['put', number, string] | ['get', number])[],
      },
    },
    {
      label: 'Atualizacao de Valor (cap=3)',
      data: {
        capacity: 3,
        operations: [
          ['put', 1, 'old'],
          ['put', 2, 'B'],
          ['put', 3, 'C'],
          ['put', 1, 'new'],
          ['get', 2],
          ['put', 4, 'D'],
          ['get', 1],
          ['get', 3],
        ] as (['put', number, string] | ['get', number])[],
      },
    },
  ] satisfies PresetOption<LRUCacheData>[],
}
