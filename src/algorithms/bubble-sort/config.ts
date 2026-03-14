// src/algorithms/bubble-sort/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Ordenacao' as const,
  description: 'Algoritmo de ordenacao que compara elementos adjacentes e troca se estiverem fora de ordem.',
  difficulty: 'Facil' as const,
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  tags: ['Sorting', 'Comparacao', 'In-place'],
  presets: [
    { label: 'Desordenado', data: [5, 3, 8, 4, 2] },
    { label: 'Quase ordenado', data: [1, 2, 4, 3, 5] },
    { label: 'Invertido', data: [5, 4, 3, 2, 1] },
    { label: 'Ja ordenado', data: [1, 2, 3, 4, 5] },
  ] satisfies PresetOption<number[]>[],
}
