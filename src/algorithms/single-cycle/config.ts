// src/algorithms/single-cycle/config.ts
import type { PresetOption } from '@/components/controls/Presets'

export const config = {
  slug: 'single-cycle-check',
  name: 'Ciclo Único em Array',
  category: 'Arrays' as const,
  description: 'Verifica se é possível visitar todos os elementos exatamente uma vez e retornar ao início.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O(n)',
    space: 'O(1)',
  },
  tags: ['Array', 'Módulo', 'Ciclo'],
  presets: [
    { label: 'Ciclo Único (True)', data: [2, 3, 1, -4, -4, 2] },
    { label: 'Sem Ciclo (False)', data: [1, 1, 1, 1, 2] },
    { label: 'Negativos (True)', data: [1, -1, 2, -2] },
    { label: 'Grande (True)', data: [2, 2, -1, 1, -3, -1] },
  ] satisfies PresetOption<number[]>[],
}
