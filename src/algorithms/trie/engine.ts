// src/algorithms/trie/engine.ts

export interface TrieData {
  operations: ['insert' | 'search' | 'startsWith', string][]
}

export interface TrieNode {
  children: Map<string, TrieNode>
  isEnd: boolean
  char: string
  id: string
}

export type TrieStepType =
  | 'init'
  | 'insert-start'
  | 'insert-traverse'
  | 'insert-create'
  | 'insert-mark-end'
  | 'search-start'
  | 'search-traverse'
  | 'search-found'
  | 'search-not-found'
  | 'prefix-start'
  | 'prefix-traverse'
  | 'prefix-found'
  | 'prefix-not-found'
  | 'done'

export interface TrieStep {
  type: TrieStepType
  trie: TrieNode
  currentPath: string
  targetWord: string
  highlightedPath: string[]
  highlightedNodeId: string | null
  description: string
  operationIndex: number
  result: boolean | null
}

let nodeIdCounter = 0

function createNode(char: string): TrieNode {
  return {
    children: new Map(),
    isEnd: false,
    char,
    id: `node-${nodeIdCounter++}`,
  }
}

function cloneTrie(node: TrieNode): TrieNode {
  const clone: TrieNode = {
    children: new Map(),
    isEnd: node.isEnd,
    char: node.char,
    id: node.id,
  }
  for (const [char, child] of node.children) {
    clone.children.set(char, cloneTrie(child))
  }
  return clone
}

export function computeSteps(data: TrieData): {
  steps: TrieStep[]
} {
  const steps: TrieStep[] = []
  const { operations } = data

  nodeIdCounter = 0
  const root = createNode('')

  steps.push({
    type: 'init',
    trie: cloneTrie(root),
    currentPath: '',
    targetWord: '',
    highlightedPath: [],
    highlightedNodeId: root.id,
    description: 'Inicializando Trie com no raiz vazio',
    operationIndex: -1,
    result: null,
  })

  for (let i = 0; i < operations.length; i++) {
    const [op, word] = operations[i]

    if (op === 'insert') {
      steps.push({
        type: 'insert-start',
        trie: cloneTrie(root),
        currentPath: '',
        targetWord: word,
        highlightedPath: [],
        highlightedNodeId: root.id,
        description: `Insert("${word}")`,
        operationIndex: i,
        result: null,
      })

      let node = root
      let path = ''

      for (let j = 0; j < word.length; j++) {
        const char = word[j]
        path += char

        if (node.children.has(char)) {
          node = node.children.get(char)!
          steps.push({
            type: 'insert-traverse',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `Navegando para "${char}" (no existente)`,
            operationIndex: i,
            result: null,
          })
        } else {
          const newNode = createNode(char)
          node.children.set(char, newNode)
          node = newNode
          steps.push({
            type: 'insert-create',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `Criando novo no para "${char}"`,
            operationIndex: i,
            result: null,
          })
        }
      }

      node.isEnd = true
      steps.push({
        type: 'insert-mark-end',
        trie: cloneTrie(root),
        currentPath: path,
        targetWord: word,
        highlightedPath: path.split(''),
        highlightedNodeId: node.id,
        description: `Marcando "${word}" como palavra valida`,
        operationIndex: i,
        result: true,
      })
    } else if (op === 'search') {
      steps.push({
        type: 'search-start',
        trie: cloneTrie(root),
        currentPath: '',
        targetWord: word,
        highlightedPath: [],
        highlightedNodeId: root.id,
        description: `Search("${word}")`,
        operationIndex: i,
        result: null,
      })

      let node = root
      let path = ''
      let found = true

      for (let j = 0; j < word.length && found; j++) {
        const char = word[j]
        path += char

        if (node.children.has(char)) {
          node = node.children.get(char)!
          steps.push({
            type: 'search-traverse',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `Encontrado "${char}"`,
            operationIndex: i,
            result: null,
          })
        } else {
          found = false
          steps.push({
            type: 'search-not-found',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.slice(0, -1).split(''),
            highlightedNodeId: null,
            description: `"${char}" nao encontrado - palavra nao existe`,
            operationIndex: i,
            result: false,
          })
        }
      }

      if (found) {
        if (node.isEnd) {
          steps.push({
            type: 'search-found',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `"${word}" encontrada!`,
            operationIndex: i,
            result: true,
          })
        } else {
          steps.push({
            type: 'search-not-found',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `"${word}" e apenas prefixo, nao palavra completa`,
            operationIndex: i,
            result: false,
          })
        }
      }
    } else if (op === 'startsWith') {
      steps.push({
        type: 'prefix-start',
        trie: cloneTrie(root),
        currentPath: '',
        targetWord: word,
        highlightedPath: [],
        highlightedNodeId: root.id,
        description: `StartsWith("${word}")`,
        operationIndex: i,
        result: null,
      })

      let node = root
      let path = ''
      let found = true

      for (let j = 0; j < word.length && found; j++) {
        const char = word[j]
        path += char

        if (node.children.has(char)) {
          node = node.children.get(char)!
          steps.push({
            type: 'prefix-traverse',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.split(''),
            highlightedNodeId: node.id,
            description: `Encontrado "${char}"`,
            operationIndex: i,
            result: null,
          })
        } else {
          found = false
          steps.push({
            type: 'prefix-not-found',
            trie: cloneTrie(root),
            currentPath: path,
            targetWord: word,
            highlightedPath: path.slice(0, -1).split(''),
            highlightedNodeId: null,
            description: `"${char}" nao encontrado - prefixo nao existe`,
            operationIndex: i,
            result: false,
          })
        }
      }

      if (found) {
        steps.push({
          type: 'prefix-found',
          trie: cloneTrie(root),
          currentPath: path,
          targetWord: word,
          highlightedPath: path.split(''),
          highlightedNodeId: node.id,
          description: `Prefixo "${word}" existe!`,
          operationIndex: i,
          result: true,
        })
      }
    }
  }

  steps.push({
    type: 'done',
    trie: cloneTrie(root),
    currentPath: '',
    targetWord: '',
    highlightedPath: [],
    highlightedNodeId: null,
    description: 'Todas operacoes concluidas!',
    operationIndex: -1,
    result: null,
  })

  return { steps }
}
