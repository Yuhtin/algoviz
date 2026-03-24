// src/algorithms/dfs/engine.ts

export interface GraphData {
  nodes: string[]
  edges: [string, string][]
  start: string
}

export type DFSStepType =
  | 'init'
  | 'visit'
  | 'explore'
  | 'backtrack'
  | 'skip'
  | 'done'

export interface DFSStep {
  type: DFSStepType
  currentNode: string | null
  targetNode: string | null
  visited: Set<string>
  stack: string[]
  highlightedEdge: [string, string] | null
  description: string
  visitOrder: string[]
}

export function computeSteps(graph: GraphData): {
  steps: DFSStep[]
  visitOrder: string[]
} {
  const steps: DFSStep[] = []
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

  const visited = new Set<string>()
  const stack: string[] = [start]
  const visitOrder: string[] = []

  // Initial step
  steps.push({
    type: 'init',
    currentNode: null,
    targetNode: start,
    visited: new Set(visited),
    stack: [...stack],
    highlightedEdge: null,
    description: `Iniciando DFS a partir de ${start}. Pilha: [${start}]`,
    visitOrder: [...visitOrder],
  })

  while (stack.length > 0) {
    const current = stack.pop()!

    if (visited.has(current)) {
      steps.push({
        type: 'skip',
        currentNode: current,
        targetNode: null,
        visited: new Set(visited),
        stack: [...stack],
        highlightedEdge: null,
        description: `Pulando ${current} (ja visitado)`,
        visitOrder: [...visitOrder],
      })
      continue
    }

    visited.add(current)
    visitOrder.push(current)

    steps.push({
      type: 'visit',
      currentNode: current,
      targetNode: null,
      visited: new Set(visited),
      stack: [...stack],
      highlightedEdge: null,
      description: `Visitando ${current}. Ordem: [${visitOrder.join(' -> ')}]`,
      visitOrder: [...visitOrder],
    })

    // Get unvisited neighbors (reversed so first neighbor is processed first)
    const neighbors = adj.get(current) || []
    const unvisitedNeighbors = neighbors.filter((n) => !visited.has(n)).reverse()

    for (const neighbor of unvisitedNeighbors) {
      steps.push({
        type: 'explore',
        currentNode: current,
        targetNode: neighbor,
        visited: new Set(visited),
        stack: [...stack],
        highlightedEdge: [current, neighbor],
        description: `Explorando aresta ${current} -> ${neighbor}`,
        visitOrder: [...visitOrder],
      })

      stack.push(neighbor)

      steps.push({
        type: 'explore',
        currentNode: current,
        targetNode: neighbor,
        visited: new Set(visited),
        stack: [...stack],
        highlightedEdge: [current, neighbor],
        description: `Empilhando ${neighbor}. Pilha: [${stack.join(', ')}]`,
        visitOrder: [...visitOrder],
      })
    }

    if (unvisitedNeighbors.length === 0 && stack.length > 0) {
      steps.push({
        type: 'backtrack',
        currentNode: current,
        targetNode: stack[stack.length - 1] || null,
        visited: new Set(visited),
        stack: [...stack],
        highlightedEdge: null,
        description: `Sem vizinhos nao visitados. Retrocedendo...`,
        visitOrder: [...visitOrder],
      })
    }
  }

  // Final step
  steps.push({
    type: 'done',
    currentNode: null,
    targetNode: null,
    visited: new Set(visited),
    stack: [],
    highlightedEdge: null,
    description: `Concluido! Ordem de visitacao: [${visitOrder.join(' -> ')}]`,
    visitOrder: [...visitOrder],
  })

  return { steps, visitOrder }
}
