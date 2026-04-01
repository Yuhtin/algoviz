import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'quick-sort',
  name: 'Quick Sort',
  category: 'Ordenação' as const,
  description: 'Algoritmo de ordenação eficiente que usa a estratégia dividir para conquistar, escolhendo um pivô e particionando o array.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n log n)',
    space: 'O(log n)',
  },
  tags: ['Ordenação', 'Dividir e Conquistar', 'Recursivo'],
  presets: [
    { label: 'Desordenado', data: [5, 3, 8, 4, 2, 7, 1, 6] },
    { label: 'Quase ordenado', data: [1, 2, 4, 3, 5, 6, 8, 7] },
    { label: 'Invertido', data: [8, 7, 6, 5, 4, 3, 2, 1] },
    { label: 'Já ordenado', data: [1, 2, 3, 4, 5, 6, 7, 8] },
    { label: 'Repetidos', data: [3, 5, 3, 8, 5, 2, 3, 1] },
  ] satisfies PresetOption<number[]>[],
}
