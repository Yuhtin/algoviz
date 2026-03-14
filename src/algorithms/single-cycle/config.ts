// src/algorithms/single-cycle/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'single-cycle-check',
  name: 'Ciclo Unico em Array',
  category: 'Arrays' as const,
  description: 'Verifica se e possivel percorrer todos os elementos do array exatamente uma vez e retornar ao inicio.',
  difficulty: 'Media' as const,
  complexity: {
    time: 'O(n)',
    space: 'O(1)',
  },
  tags: ['Array', 'Modulo', 'Ciclo'],
  presets: [
    { label: 'Ciclo Unico (True)', data: [2, 3, 1, -4, -4, 2] },
    { label: 'Sem Ciclo Unico (False)', data: [1, 1, 1, 1, 2] },
    { label: 'Negativos (True)', data: [1, -1, 2, -2] },
    { label: 'Grande (True)', data: [2, 2, -1, 1, -3, -1] },
  ] satisfies PresetOption<number[]>[],
}
