// src/algorithms/dijkstra/engine.ts

export interface GraphData {
  nodes: string[]
  edges: [string, string, number][] // [from, to, weight]
  start: string
}

export type DijkstraStepType =
  | 'init'
  | 'select'
  | 'visit'
  | 'relax'
  | 'update'
  | 'skip'
  | 'done'

export interface DijkstraStep {
  type: DijkstraStepType
  currentNode: string | null
  targetNode: string | null
  distances: Map<string, number>
  visited: Set<string>
  pq: Array<{ node: string; dist: number }>
  highlightedEdge: [string, string] | null
  description: string
  newDistance?: number
  oldDistance?: number
}

export function computeSteps(graph: GraphData): {
  steps: DijkstraStep[]
  finalDistances: Map<string, number>
} {
  const steps: DijkstraStep[] = []
  const { nodes, edges, start } = graph

  // Build adjacency list
  const adj = new Map<string, Array<{ to: string; weight: number }>>()
  for (const node of nodes) {
    adj.set(node, [])
  }
  for (const [from, to, weight] of edges) {
    adj.get(from)!.push({ to, weight })
    adj.get(to)!.push({ to: from, weight }) // undirected
  }

  // Initialize distances
  const distances = new Map<string, number>()
  for (const node of nodes) {
    distances.set(node, node === start ? 0 : Infinity)
  }

  const visited = new Set<string>()
  const pq: Array<{ node: string; dist: number }> = [{ node: start, dist: 0 }]

  // Initial step
  steps.push({
    type: 'init',
    currentNode: null,
    targetNode: start,
    distances: new Map(distances),
    visited: new Set(visited),
    pq: [...pq],
    highlightedEdge: null,
    description: `Inicializando: dist[${start}] = 0, demais = infinito`,
  })

  while (pq.length > 0) {
    // Sort to get min
    pq.sort((a, b) => a.dist - b.dist)
    const { node: current, dist: currentDist } = pq.shift()!

    if (visited.has(current)) {
      steps.push({
        type: 'skip',
        currentNode: current,
        targetNode: null,
        distances: new Map(distances),
        visited: new Set(visited),
        pq: [...pq],
        highlightedEdge: null,
        description: `Pulando ${current} (ja visitado)`,
      })
      continue
    }

    // Select node
    steps.push({
      type: 'select',
      currentNode: current,
      targetNode: null,
      distances: new Map(distances),
      visited: new Set(visited),
      pq: [...pq],
      highlightedEdge: null,
      description: `Selecionando ${current} (menor distancia: ${currentDist === Infinity ? '∞' : currentDist})`,
    })

    visited.add(current)

    // Visit step
    steps.push({
      type: 'visit',
      currentNode: current,
      targetNode: null,
      distances: new Map(distances),
      visited: new Set(visited),
      pq: [...pq],
      highlightedEdge: null,
      description: `Visitando ${current}`,
    })

    // Process neighbors
    const neighbors = adj.get(current) || []
    for (const { to: neighbor, weight } of neighbors) {
      const newDist = currentDist + weight
      const oldDist = distances.get(neighbor)!

      // Relax step - examining edge
      steps.push({
        type: 'relax',
        currentNode: current,
        targetNode: neighbor,
        distances: new Map(distances),
        visited: new Set(visited),
        pq: [...pq],
        highlightedEdge: [current, neighbor],
        description: `Analisando aresta ${current} → ${neighbor} (peso ${weight})`,
        newDistance: newDist,
        oldDistance: oldDist,
      })

      if (newDist < oldDist) {
        distances.set(neighbor, newDist)
        pq.push({ node: neighbor, dist: newDist })

        steps.push({
          type: 'update',
          currentNode: current,
          targetNode: neighbor,
          distances: new Map(distances),
          visited: new Set(visited),
          pq: [...pq],
          highlightedEdge: [current, neighbor],
          description: `Atualizando dist[${neighbor}]: ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}`,
          newDistance: newDist,
          oldDistance: oldDist,
        })
      }
    }
  }

  // Final step
  steps.push({
    type: 'done',
    currentNode: null,
    targetNode: null,
    distances: new Map(distances),
    visited: new Set(visited),
    pq: [],
    highlightedEdge: null,
    description: 'Concluido! Todas as distancias minimas foram calculadas.',
  })

  return { steps, finalDistances: distances }
}
