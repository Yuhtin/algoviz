import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Ordenação' as const,
  description: 'Algoritmo de ordenação que insere cada elemento na posição correta da parte já ordenada do array, como organizar cartas na mão.',
  difficulty: 'Fácil' as const,
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  tags: ['Ordenação', 'Comparação', 'Estável', 'In-place'],
  presets: [
    { label: 'Desordenado', data: [5, 3, 8, 4, 2, 7, 1, 6] },
    { label: 'Quase ordenado', data: [1, 2, 4, 3, 5, 6, 8, 7] },
    { label: 'Invertido', data: [8, 7, 6, 5, 4, 3, 2, 1] },
    { label: 'Já ordenado', data: [1, 2, 3, 4, 5, 6, 7, 8] },
  ] satisfies PresetOption<number[]>[],
}
