// src/algorithms/topological-sort/engine.ts

export interface GraphData {
  nodes: string[]
  edges: [string, string][] // [from, to] - directed
}

export type TopSortStepType =
  | 'init'
  | 'calc-indegree'
  | 'add-zero'
  | 'dequeue'
  | 'process'
  | 'decrement'
  | 'check-zero'
  | 'done'

export interface TopSortStep {
  type: TopSortStepType
  currentNode: string | null
  targetNode: string | null
  inDegree: Map<string, number>
  queue: string[]
  result: string[]
  highlightedEdge: [string, string] | null
  description: string
}

export function computeSteps(graph: GraphData): {
  steps: TopSortStep[]
  result: string[]
} {
  const steps: TopSortStep[] = []
  const { nodes, edges } = graph

  // Build adjacency list
  const adj = new Map<string, string[]>()
  for (const node of nodes) {
    adj.set(node, [])
  }
  for (const [from, to] of edges) {
    adj.get(from)!.push(to)
  }

  // Calculate in-degree
  const inDegree = new Map<string, number>()
  for (const node of nodes) {
    inDegree.set(node, 0)
  }

  steps.push({
    type: 'init',
    currentNode: null,
    targetNode: null,
    inDegree: new Map(inDegree),
    queue: [],
    result: [],
    highlightedEdge: null,
    description: 'Iniciando Topological Sort (Algoritmo de Kahn)',
  })

  for (const [from, to] of edges) {
    inDegree.set(to, (inDegree.get(to) || 0) + 1)
    steps.push({
      type: 'calc-indegree',
      currentNode: to,
      targetNode: null,
      inDegree: new Map(inDegree),
      queue: [],
      result: [],
      highlightedEdge: [from, to],
      description: `Aresta ${from} -> ${to}: grau de entrada de ${to} = ${inDegree.get(to)}`,
    })
  }

  // Initialize queue with nodes of in-degree 0
  const queue: string[] = []
  for (const node of nodes) {
    if (inDegree.get(node) === 0) {
      queue.push(node)
      steps.push({
        type: 'add-zero',
        currentNode: node,
        targetNode: null,
        inDegree: new Map(inDegree),
        queue: [...queue],
        result: [],
        highlightedEdge: null,
        description: `${node} tem grau 0, adicionado a fila`,
      })
    }
  }

  const result: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()!

    steps.push({
      type: 'dequeue',
      currentNode: current,
      targetNode: null,
      inDegree: new Map(inDegree),
      queue: [...queue],
      result: [...result],
      highlightedEdge: null,
      description: `Desenfileirando ${current}`,
    })

    result.push(current)

    steps.push({
      type: 'process',
      currentNode: current,
      targetNode: null,
      inDegree: new Map(inDegree),
      queue: [...queue],
      result: [...result],
      highlightedEdge: null,
      description: `Adicionando ${current} ao resultado: [${result.join(', ')}]`,
    })

    // Process neighbors
    const neighbors = adj.get(current) || []
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1
      inDegree.set(neighbor, newDegree)

      steps.push({
        type: 'decrement',
        currentNode: current,
        targetNode: neighbor,
        inDegree: new Map(inDegree),
        queue: [...queue],
        result: [...result],
        highlightedEdge: [current, neighbor],
        description: `Decrementando grau de ${neighbor}: ${newDegree + 1} -> ${newDegree}`,
      })

      if (newDegree === 0) {
        queue.push(neighbor)
        steps.push({
          type: 'check-zero',
          currentNode: current,
          targetNode: neighbor,
          inDegree: new Map(inDegree),
          queue: [...queue],
          result: [...result],
          highlightedEdge: [current, neighbor],
          description: `${neighbor} tem grau 0, adicionado a fila`,
        })
      }
    }
  }

  const hasCycle = result.length !== nodes.length

  steps.push({
    type: 'done',
    currentNode: null,
    targetNode: null,
    inDegree: new Map(inDegree),
    queue: [],
    result: [...result],
    highlightedEdge: null,
    description: hasCycle
      ? `Ciclo detectado! Apenas ${result.length} de ${nodes.length} vertices processados.`
      : `Concluido! Ordem topologica: [${result.join(' -> ')}]`,
  })

  return { steps, result }
}
