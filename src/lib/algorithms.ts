// src/lib/algorithms.ts
// Uses auto-generated algorithms from YAML files
import { algorithms as generatedAlgorithms } from '@/generated/algorithms'

export const categories = ['Arrays', 'Ordenação', 'Busca', 'Grafos', 'Árvores', 'Hash', 'Strings'] as const
export type Category = (typeof categories)[number]

export const categoryInfo: Record<Category, { name: string; icon: string; description: string }> = {
  Arrays: { name: 'Arrays', icon: '[ ]', description: 'Manipulação e busca em arrays' },
  Ordenação: { name: 'Ordenação', icon: '↕', description: 'Algoritmos de ordenação' },
  Busca: { name: 'Busca', icon: '⌕', description: 'Algoritmos de busca' },
  Grafos: { name: 'Grafos', icon: '◉', description: 'Busca e caminhos em grafos' },
  Árvores: { name: 'Árvores', icon: '△', description: 'Árvores binárias e balanceadas' },
  Hash: { name: 'Hash', icon: '#', description: 'Tabelas hash e hashing' },
  Strings: { name: 'Strings', icon: 'Aa', description: 'Manipulação de strings' },
}

// Re-export generated algorithms
export const algorithms = generatedAlgorithms

export type AlgorithmSlug = keyof typeof algorithms

export function getAlgorithm(slug: string) {
  return algorithms[slug as AlgorithmSlug] || null
}

export function getAllAlgorithms() {
  return Object.values(algorithms)
}

export function getAlgorithmsByCategory() {
  const allAlgorithms = getAllAlgorithms()
  const grouped: Partial<Record<Category, typeof allAlgorithms>> = {}

  // Sort categories by predefined order
  for (const category of categories) {
    const algos = allAlgorithms.filter((algo) => algo.category === category)
    if (algos.length > 0) {
      grouped[category] = algos
    }
  }

  return grouped
}
