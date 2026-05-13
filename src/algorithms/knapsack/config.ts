import type { PresetOption } from '@/components/controls/Presets'

export interface KnapsackItem {
  name: string
  icon: string
  weight: number
  value: number
}

export interface KnapsackData {
  capacity: number
  items: KnapsackItem[]
}

export const config = {
  slug: 'knapsack',
  name: '0/1 Knapsack',
  category: 'Programação Dinâmica' as const,
  description:
    'Dada uma lista de itens com peso e valor, e uma mochila com capacidade limitada, escolha quais itens levar para maximizar o valor total. Cada item só pode ser pego uma vez.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n × W)',
    space: 'O(n × W)',
  },
  tags: ['DP', '2D', 'Otimização', 'Mochila', 'Backtrack'],
  presets: [
    {
      label: 'Clássico',
      data: {
        capacity: 7,
        items: [
          { name: 'Joia', icon: '💎', weight: 4, value: 3 },
          { name: 'Livro', icon: '📚', weight: 2, value: 4 },
          { name: 'Laptop', icon: '💻', weight: 3, value: 5 },
        ],
      },
    },
    {
      label: 'Tudo cabe',
      data: {
        capacity: 12,
        items: [
          { name: 'Garrafa', icon: '🍶', weight: 2, value: 2 },
          { name: 'Sanduíche', icon: '🥪', weight: 3, value: 4 },
          { name: 'Câmera', icon: '📷', weight: 3, value: 5 },
          { name: 'Mapa', icon: '🗺', weight: 1, value: 1 },
        ],
      },
    },
    {
      label: 'Decisão difícil',
      data: {
        capacity: 10,
        items: [
          { name: 'Relógio', icon: '⌚', weight: 5, value: 7 },
          { name: 'Pintura', icon: '🖼', weight: 6, value: 8 },
          { name: 'Estátua', icon: '🗿', weight: 4, value: 6 },
          { name: 'Anel', icon: '💍', weight: 3, value: 5 },
        ],
      },
    },
  ] satisfies PresetOption<KnapsackData>[],
}
