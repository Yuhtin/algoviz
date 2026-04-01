import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'counting-sort',
  name: 'Counting Sort',
  category: 'Ordenação' as const,
  description: 'Algoritmo de ordenação não comparativo que conta a frequência de cada elemento para determinar suas posições no array ordenado.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n + k)',
    space: 'O(n + k)',
  },
  tags: ['Ordenação', 'Não Comparativo', 'Linear'],
  presets: [
    { label: 'Desordenado', data: [4, 2, 7, 1, 3, 5, 2, 4, 3, 1] },
    { label: 'Poucos valores', data: [3, 1, 2, 3, 1, 2, 1, 3, 2, 1] },
    { label: 'Valores grandes', data: [8, 3, 9, 1, 5, 7, 2, 6, 4, 8] },
    { label: 'Já ordenado', data: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  ] satisfies PresetOption<number[]>[],
}
