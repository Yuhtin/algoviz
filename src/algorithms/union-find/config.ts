// src/algorithms/union-find/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { UnionFindData } from './engine'

export const config = {
  slug: 'union-find',
  name: 'Union-Find (Disjoint Set)',
  category: 'Grafos' as const,
  description: 'Estrutura de dados para rastrear elementos particionados em conjuntos disjuntos, com operacoes quase O(1).',
  difficulty: 'Difícil' as const,
  complexity: {
    time: 'O(alpha(n))',
    space: 'O(n)',
  },
  tags: ['Estrutura de Dados', 'Conjuntos', 'Conectividade', 'Kruskal'],
  presets: [
    {
      label: 'Rede Social',
      data: {
        nodes: ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank'],
        operations: [
          ['union', 'Alice', 'Bob'],
          ['union', 'Carol', 'David'],
          ['find', 'Alice', 'Carol'],
          ['union', 'Bob', 'Carol'],
          ['find', 'Alice', 'David'],
          ['union', 'Eve', 'Frank'],
          ['find', 'Alice', 'Eve'],
        ] as ['union' | 'find', string, string][],
      },
    },
    {
      label: 'Componentes Conexos',
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        operations: [
          ['union', 'A', 'B'],
          ['union', 'C', 'D'],
          ['union', 'E', 'F'],
          ['union', 'G', 'H'],
          ['union', 'A', 'C'],
          ['union', 'E', 'G'],
          ['find', 'B', 'D'],
          ['find', 'A', 'E'],
          ['union', 'C', 'G'],
          ['find', 'A', 'H'],
        ] as ['union' | 'find', string, string][],
      },
    },
    {
      label: 'Ilhas em Grid',
      data: {
        nodes: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        operations: [
          ['union', '0', '1'],
          ['union', '1', '2'],
          ['union', '3', '4'],
          ['union', '6', '7'],
          ['union', '7', '8'],
          ['find', '0', '8'],
          ['union', '2', '5'],
          ['union', '5', '8'],
          ['find', '0', '8'],
        ] as ['union' | 'find', string, string][],
      },
    },
  ] satisfies PresetOption<UnionFindData>[],
}
