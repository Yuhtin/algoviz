// src/algorithms/bubble-sort/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Ordenação' as const,
  description: 'Algoritmo de ordenação que compara elementos vizinhos e troca quando estão fora de ordem.',
  difficulty: 'Fácil' as const,
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  tags: ['Ordenação', 'Comparação', 'In-place'],
  presets: [
    { label: 'Desordenado', data: [5, 3, 8, 4, 2] },
    { label: 'Quase ordenado', data: [1, 2, 4, 3, 5] },
    { label: 'Invertido', data: [5, 4, 3, 2, 1] },
    { label: 'Já ordenado', data: [1, 2, 3, 4, 5] },
  ] satisfies PresetOption<number[]>[],
}
