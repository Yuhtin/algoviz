// src/algorithms/bfs/engine.ts

export interface GraphData {
  nodes: string[]
  edges: [string, string][]
  start: string
}

export type BFSStepType =
  | 'init'
  | 'dequeue'
  | 'visit'
  | 'explore'
  | 'enqueue'
  | 'skip'
  | 'done'

export interface BFSStep {
  type: BFSStepType
  currentNode: string | null
  targetNode: string | null
  visited: Set<string>
  queue: string[]
  highlightedEdge: [string, string] | null
  description: string
  visitOrder: string[]
  distances: Map<string, number>
}

export function computeSteps(graph: GraphData): {
  steps: BFSStep[]
  visitOrder: string[]
} {
  const steps: BFSStep[] = []
  const { nodes, edges, start } = graph

  // Build adjacency list
  const adj = new Map<string, string[]>()
  for (const node of nodes) {
    adj.set(node, [])
  }
  for (const [from, to] of edges) {
    adj.get(from)!.push(to)
    adj.get(to)!.push(from)
  }

  // Sort neighbors for consistent ordering
  for (const [, neighbors] of adj) {
    neighbors.sort()
  }

  const visited = new Set<string>([start])
  const queue: string[] = [start]
  const visitOrder: string[] = []
  const distances = new Map<string, number>()
  distances.set(start, 0)

  // Initial step
  steps.push({
    type: 'init',
    currentNode: null,
    targetNode: start,
    visited: new Set(visited),
    queue: [...queue],
    highlightedEdge: null,
    description: `Iniciando BFS a partir de ${start}. Fila: [${start}]`,
    visitOrder: [...visitOrder],
    distances: new Map(distances),
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentDist = distances.get(current)!

    steps.push({
      type: 'dequeue',
      currentNode: current,
      targetNode: null,
      visited: new Set(visited),
      queue: [...queue],
      highlightedEdge: null,
      description: `Desenfileirando ${current} (distancia ${currentDist})`,
      visitOrder: [...visitOrder],
      distances: new Map(distances),
    })

    visitOrder.push(current)

    steps.push({
      type: 'visit',
      currentNode: current,
      targetNode: null,
      visited: new Set(visited),
      queue: [...queue],
      highlightedEdge: null,
      description: `Processando ${current}. Ordem: [${visitOrder.join(' -> ')}]`,
      visitOrder: [...visitOrder],
      distances: new Map(distances),
    })

    // Process neighbors
    const neighbors = adj.get(current) || []
    for (const neighbor of neighbors) {
      steps.push({
        type: 'explore',
        currentNode: current,
        targetNode: neighbor,
        visited: new Set(visited),
        queue: [...queue],
        highlightedEdge: [current, neighbor],
        description: `Explorando aresta ${current} -> ${neighbor}`,
        visitOrder: [...visitOrder],
        distances: new Map(distances),
      })

      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        distances.set(neighbor, currentDist + 1)
        queue.push(neighbor)

        steps.push({
          type: 'enqueue',
          currentNode: current,
          targetNode: neighbor,
          visited: new Set(visited),
          queue: [...queue],
          highlightedEdge: [current, neighbor],
          description: `Enfileirando ${neighbor} (distancia ${currentDist + 1}). Fila: [${queue.join(', ')}]`,
          visitOrder: [...visitOrder],
          distances: new Map(distances),
        })
      } else {
        steps.push({
          type: 'skip',
          currentNode: current,
          targetNode: neighbor,
          visited: new Set(visited),
          queue: [...queue],
          highlightedEdge: [current, neighbor],
          description: `${neighbor} ja foi visitado, pulando`,
          visitOrder: [...visitOrder],
          distances: new Map(distances),
        })
      }
    }
  }

  // Final step
  steps.push({
    type: 'done',
    currentNode: null,
    targetNode: null,
    visited: new Set(visited),
    queue: [],
    highlightedEdge: null,
    description: `Concluido! Ordem de visitacao: [${visitOrder.join(' -> ')}]`,
    visitOrder: [...visitOrder],
    distances: new Map(distances),
  })

  return { steps, visitOrder }
}
