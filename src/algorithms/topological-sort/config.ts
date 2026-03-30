// src/algorithms/topological-sort/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { GraphData } from './engine'

export const config = {
  slug: 'topological-sort',
  name: 'Topological Sort',
  category: 'Grafos' as const,
  description: 'Ordena vertices de um grafo direcionado aciclico (DAG) de forma que para toda aresta u->v, u aparece antes de v.',
  difficulty: 'Difícil' as const,
  complexity: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  tags: ['Grafo', 'DAG', 'Ordenacao', 'DFS', 'Kahn'],
  presets: [
    {
      label: 'Dependencias de Build',
      data: {
        nodes: ['main', 'utils', 'config', 'db', 'api', 'auth'],
        edges: [
          ['main', 'api'],
          ['main', 'db'],
          ['api', 'auth'],
          ['api', 'utils'],
          ['db', 'config'],
          ['auth', 'config'],
          ['utils', 'config'],
        ] as [string, string][],
      },
    },
    {
      label: 'Curriculo de Cursos',
      data: {
        nodes: ['Calc1', 'Calc2', 'Calc3', 'Algebra', 'Fisica1', 'Fisica2', 'Prog1', 'Prog2'],
        edges: [
          ['Calc1', 'Calc2'],
          ['Calc2', 'Calc3'],
          ['Algebra', 'Calc2'],
          ['Calc1', 'Fisica1'],
          ['Fisica1', 'Fisica2'],
          ['Prog1', 'Prog2'],
          ['Calc1', 'Prog2'],
        ] as [string, string][],
      },
    },
    {
      label: 'Tasks com Dependencias',
      data: {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [
          ['A', 'B'],
          ['A', 'C'],
          ['B', 'D'],
          ['C', 'D'],
          ['D', 'E'],
          ['C', 'F'],
          ['F', 'E'],
        ] as [string, string][],
      },
    },
  ] satisfies PresetOption<GraphData>[],
}
