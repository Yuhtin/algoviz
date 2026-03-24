// src/algorithms/union-find/engine.ts

export interface UnionFindData {
  nodes: string[]
  operations: ['union' | 'find', string, string][]
}

export type UnionFindStepType =
  | 'init'
  | 'find-start'
  | 'find-traverse'
  | 'path-compress'
  | 'find-result'
  | 'union-start'
  | 'union-compare'
  | 'union-link'
  | 'union-same'
  | 'connected-check'
  | 'done'

export interface UnionFindStep {
  type: UnionFindStepType
  parent: Map<string, string>
  rank: Map<string, number>
  currentNode: string | null
  targetNode: string | null
  root1: string | null
  root2: string | null
  highlightedNodes: string[]
  description: string
  operationIndex: number
  connected: boolean | null
}

export function computeSteps(data: UnionFindData): {
  steps: UnionFindStep[]
} {
  const steps: UnionFindStep[] = []
  const { nodes, operations } = data

  // Initialize Union-Find
  const parent = new Map<string, string>()
  const rank = new Map<string, number>()

  for (const node of nodes) {
    parent.set(node, node)
    rank.set(node, 0)
  }

  steps.push({
    type: 'init',
    parent: new Map(parent),
    rank: new Map(rank),
    currentNode: null,
    targetNode: null,
    root1: null,
    root2: null,
    highlightedNodes: [],
    description: 'Inicializando Union-Find: cada elemento e seu proprio pai',
    operationIndex: -1,
    connected: null,
  })

  // Helper function to find with path compression
  function find(x: string, addSteps: boolean): string {
    const path: string[] = [x]

    if (addSteps) {
      steps.push({
        type: 'find-start',
        parent: new Map(parent),
        rank: new Map(rank),
        currentNode: x,
        targetNode: null,
        root1: null,
        root2: null,
        highlightedNodes: [x],
        description: `Find(${x}): buscando raiz`,
        operationIndex: -1,
        connected: null,
      })
    }

    // Traverse to root
    let current = x
    while (parent.get(current) !== current) {
      current = parent.get(current)!
      path.push(current)

      if (addSteps) {
        steps.push({
          type: 'find-traverse',
          parent: new Map(parent),
          rank: new Map(rank),
          currentNode: current,
          targetNode: null,
          root1: null,
          root2: null,
          highlightedNodes: [...path],
          description: `Seguindo: ${path.join(' -> ')}`,
          operationIndex: -1,
          connected: null,
        })
      }
    }

    const root = current

    // Path compression
    for (const node of path) {
      if (node !== root && parent.get(node) !== root) {
        parent.set(node, root)
        if (addSteps) {
          steps.push({
            type: 'path-compress',
            parent: new Map(parent),
            rank: new Map(rank),
            currentNode: node,
            targetNode: root,
            root1: null,
            root2: null,
            highlightedNodes: [node, root],
            description: `Path compression: ${node} agora aponta para ${root}`,
            operationIndex: -1,
            connected: null,
          })
        }
      }
    }

    return root
  }

  // Process operations
  for (let i = 0; i < operations.length; i++) {
    const [op, x, y] = operations[i]

    if (op === 'union') {
      steps.push({
        type: 'union-start',
        parent: new Map(parent),
        rank: new Map(rank),
        currentNode: x,
        targetNode: y,
        root1: null,
        root2: null,
        highlightedNodes: [x, y],
        description: `Union(${x}, ${y})`,
        operationIndex: i,
        connected: null,
      })

      const rootX = find(x, true)
      const rootY = find(y, true)

      steps.push({
        type: 'union-compare',
        parent: new Map(parent),
        rank: new Map(rank),
        currentNode: null,
        targetNode: null,
        root1: rootX,
        root2: rootY,
        highlightedNodes: [rootX, rootY],
        description: `Raizes: ${rootX} e ${rootY}`,
        operationIndex: i,
        connected: null,
      })

      if (rootX === rootY) {
        steps.push({
          type: 'union-same',
          parent: new Map(parent),
          rank: new Map(rank),
          currentNode: null,
          targetNode: null,
          root1: rootX,
          root2: rootY,
          highlightedNodes: [rootX],
          description: `${x} e ${y} ja estao no mesmo conjunto`,
          operationIndex: i,
          connected: null,
        })
      } else {
        // Union by rank
        const rankX = rank.get(rootX) || 0
        const rankY = rank.get(rootY) || 0

        if (rankX < rankY) {
          parent.set(rootX, rootY)
          steps.push({
            type: 'union-link',
            parent: new Map(parent),
            rank: new Map(rank),
            currentNode: rootX,
            targetNode: rootY,
            root1: rootX,
            root2: rootY,
            highlightedNodes: [rootX, rootY],
            description: `Ligando ${rootX} -> ${rootY} (rank ${rankX} < ${rankY})`,
            operationIndex: i,
            connected: null,
          })
        } else if (rankX > rankY) {
          parent.set(rootY, rootX)
          steps.push({
            type: 'union-link',
            parent: new Map(parent),
            rank: new Map(rank),
            currentNode: rootY,
            targetNode: rootX,
            root1: rootX,
            root2: rootY,
            highlightedNodes: [rootX, rootY],
            description: `Ligando ${rootY} -> ${rootX} (rank ${rankY} < ${rankX})`,
            operationIndex: i,
            connected: null,
          })
        } else {
          parent.set(rootY, rootX)
          rank.set(rootX, rankX + 1)
          steps.push({
            type: 'union-link',
            parent: new Map(parent),
            rank: new Map(rank),
            currentNode: rootY,
            targetNode: rootX,
            root1: rootX,
            root2: rootY,
            highlightedNodes: [rootX, rootY],
            description: `Ligando ${rootY} -> ${rootX} (ranks iguais, incrementando rank de ${rootX})`,
            operationIndex: i,
            connected: null,
          })
        }
      }
    } else if (op === 'find') {
      steps.push({
        type: 'connected-check',
        parent: new Map(parent),
        rank: new Map(rank),
        currentNode: x,
        targetNode: y,
        root1: null,
        root2: null,
        highlightedNodes: [x, y],
        description: `Verificando: ${x} e ${y} estao conectados?`,
        operationIndex: i,
        connected: null,
      })

      const rootX = find(x, true)
      const rootY = find(y, true)
      const connected = rootX === rootY

      steps.push({
        type: 'find-result',
        parent: new Map(parent),
        rank: new Map(rank),
        currentNode: null,
        targetNode: null,
        root1: rootX,
        root2: rootY,
        highlightedNodes: connected ? [rootX] : [rootX, rootY],
        description: connected
          ? `Sim! ${x} e ${y} tem a mesma raiz: ${rootX}`
          : `Nao. ${x} tem raiz ${rootX}, ${y} tem raiz ${rootY}`,
        operationIndex: i,
        connected,
      })
    }
  }

  // Count components
  const roots = new Set<string>()
  for (const node of nodes) {
    roots.add(find(node, false))
  }

  steps.push({
    type: 'done',
    parent: new Map(parent),
    rank: new Map(rank),
    currentNode: null,
    targetNode: null,
    root1: null,
    root2: null,
    highlightedNodes: [...roots],
    description: `Concluido! ${roots.size} componente(s) conexo(s)`,
    operationIndex: -1,
    connected: null,
  })

  return { steps }
}
