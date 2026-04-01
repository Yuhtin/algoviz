import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'merge-sort',
  name: 'Merge Sort',
  category: 'Ordenação' as const,
  description: 'Algoritmo de ordenação estável que usa dividir para conquistar, dividindo o array ao meio e intercalando as metades ordenadas.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n log n)',
    space: 'O(n)',
  },
  tags: ['Ordenação', 'Dividir e Conquistar', 'Estável'],
  presets: [
    { label: 'Desordenado', data: [5, 3, 8, 4, 2, 7, 1, 6] },
    { label: 'Quase ordenado', data: [1, 2, 4, 3, 5, 6, 8, 7] },
    { label: 'Invertido', data: [8, 7, 6, 5, 4, 3, 2, 1] },
    { label: 'Já ordenado', data: [1, 2, 3, 4, 5, 6, 7, 8] },
  ] satisfies PresetOption<number[]>[],
}
