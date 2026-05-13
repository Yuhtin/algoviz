import type { PresetOption } from '@/components/controls/Presets'

export interface CoinChangeData {
  coins: number[]
  amount: number
}

export const config = {
  slug: 'coin-change',
  name: 'Coin Change',
  category: 'Programação Dinâmica' as const,
  description:
    'Dado um conjunto de moedas e um valor alvo, encontre o número mínimo de moedas necessárias para somar o valor. Clássico problema de DP bottom-up.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n × m)',
    space: 'O(n)',
  },
  tags: ['DP', 'Bottom-up', 'Otimização', 'Combinatória'],
  presets: [
    { label: 'Clássico (6)', data: { coins: [1, 3, 4], amount: 6 } },
    { label: 'Moedas BR (11)', data: { coins: [1, 5, 10, 25], amount: 11 } },
    { label: 'Difícil (7)', data: { coins: [2, 5], amount: 7 } },
    { label: 'Impossível (3)', data: { coins: [2, 4], amount: 3 } },
  ] satisfies PresetOption<CoinChangeData>[],
}
