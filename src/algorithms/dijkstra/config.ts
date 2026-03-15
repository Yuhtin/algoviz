// src/algorithms/dijkstra/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { GraphData } from './engine'

export const config = {
  slug: 'dijkstra',
  name: 'Dijkstra',
  category: 'Grafos' as const,
  description: 'Algoritmo que calcula a menor distância entre um vértice de origem e todos os outros em grafos com pesos positivos.',
  difficulty: 'Média' as const,
  complexity: {
    time: 'O((V + E) log V)',
    space: 'O(V)',
  },
  tags: ['Grafo', 'Caminho Mínimo', 'Greedy', 'Priority Queue'],
  presets: [
    {
      label: 'Rede de Cidades',
      data: {
        nodes: ['0', '1', '2', '3', '4', '5', '6'],
        edges: [
          ['0', '1', 2],
          ['0', '2', 6],
          ['1', '3', 5],
          ['2', '3', 8],
          ['3', '4', 10],
          ['3', '5', 15],
          ['4', '5', 6],
          ['4', '6', 2],
          ['5', '6', 6],
        ] as [string, string, number][],
        start: '0',
      },
    },
    {
      label: 'Grafo Completo K5',
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
          ['A', 'B', 3],
          ['A', 'C', 7],
          ['A', 'D', 2],
          ['A', 'E', 5],
          ['B', 'C', 2],
          ['B', 'D', 4],
          ['B', 'E', 6],
          ['C', 'D', 1],
          ['C', 'E', 3],
          ['D', 'E', 2],
        ] as [string, string, number][],
        start: 'A',
      },
    },
    {
      label: 'Labirinto',
      data: {
        nodes: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'T'],
        edges: [
          ['S', 'A', 4],
          ['S', 'B', 2],
          ['A', 'C', 3],
          ['A', 'D', 1],
          ['B', 'A', 1],
          ['B', 'D', 5],
          ['C', 'T', 2],
          ['D', 'E', 2],
          ['D', 'F', 4],
          ['E', 'T', 3],
          ['F', 'T', 1],
        ] as [string, string, number][],
        start: 'S',
      },
    },
  ] satisfies PresetOption<GraphData>[],
}
