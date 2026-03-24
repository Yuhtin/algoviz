// src/algorithms/bfs/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { GraphData } from './engine'

export const config = {
  slug: 'bfs',
  name: 'BFS (Breadth-First Search)',
  category: 'Grafos' as const,
  description: 'Algoritmo de busca em largura que explora o grafo nivel por nivel, encontrando o caminho mais curto em grafos sem peso.',
  difficulty: 'Media' as const,
  complexity: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  tags: ['Grafo', 'Busca', 'Fila', 'Caminho Minimo'],
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
      label: 'Grid 3x3',
      data: {
        nodes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        edges: [
          ['1', '2'],
          ['2', '3'],
          ['1', '4'],
          ['2', '5'],
          ['3', '6'],
          ['4', '5'],
          ['5', '6'],
          ['4', '7'],
          ['5', '8'],
          ['6', '9'],
          ['7', '8'],
          ['8', '9'],
        ] as [string, string][],
        start: '1',
      },
    },
  ] satisfies PresetOption<GraphData>[],
}
