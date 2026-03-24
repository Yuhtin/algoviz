// src/algorithms/dfs/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { GraphData } from './engine'

export const config = {
  slug: 'dfs',
  name: 'DFS (Depth-First Search)',
  category: 'Grafos' as const,
  description: 'Algoritmo de busca em profundidade que explora o grafo indo o mais fundo possivel antes de retroceder.',
  difficulty: 'Media' as const,
  complexity: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  tags: ['Grafo', 'Busca', 'Recursao', 'Stack'],
  presets: [
    {
      label: 'Arvore Binaria',
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        edges: [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'D'],
          ['B', 'E'],
          ['C', 'F'],
          ['C', 'G'],
        ] as [string, string][],
        start: 'A',
      },
    },
    {
      label: 'Grafo com Ciclo',
      data: {
        nodes: ['1', '2', '3', '4', '5'],
        edges: [
          ['1', '2'],
          ['1', '3'],
          ['2', '4'],
          ['3', '4'],
          ['4', '5'],
        ] as [string, string][],
        start: '1',
      },
    },
    {
      label: 'Grafo Desconexo',
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [
          ['A', 'B'],
          ['B', 'C'],
          ['D', 'E'],
          ['E', 'F'],
        ] as [string, string][],
        start: 'A',
      },
    },
  ] satisfies PresetOption<GraphData>[],
}
