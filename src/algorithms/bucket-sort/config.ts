// src/algorithms/bucket-sort/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'bucket-sort',
  name: 'Bucket Sort',
  category: 'Ordenacao' as const,
  description: 'Algoritmo de ordenacao distributiva que divide elementos em buckets e ordena cada bucket individualmente.',
  difficulty: 'Media' as const,
  complexity: {
    time: 'O(n+k)',
    space: 'O(n+k)',
  },
  tags: ['Sorting', 'Distributivo', 'Linear'],
  presets: [
    { label: 'Distribuido', data: [0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51] },
    { label: 'Concentrado', data: [0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27] },
    { label: 'Uniforme', data: [0.1, 0.3, 0.5, 0.7, 0.9, 0.2, 0.4] },
    { label: 'Invertido', data: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3] },
  ] satisfies PresetOption<number[]>[],
}
