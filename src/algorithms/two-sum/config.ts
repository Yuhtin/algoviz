// src/algorithms/two-sum/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export interface TwoSumInput {
  array: number[]
  target: number
}

export const config = {
  slug: 'two-sum',
  name: 'Two Sum',
  description: 'Encontra dois numeros no array que somam ao target usando hash map.',
  difficulty: 'Facil' as const,
  complexity: {
    time: 'O(n)',
    space: 'O(n)',
  },
  tags: ['Array', 'Hash Map', 'Complemento'],
  presets: [
    { label: 'Encontra (target=9)', data: { array: [2, 7, 11, 15], target: 9 } },
    { label: 'Encontra (target=6)', data: { array: [3, 2, 4], target: 6 } },
    { label: 'Nao encontra', data: { array: [1, 2, 3, 4], target: 100 } },
    { label: 'Duplicados (target=6)', data: { array: [3, 3], target: 6 } },
  ] satisfies PresetOption<TwoSumInput>[],
}
