// src/lib/algorithms.ts
import { config as singleCycleConfig } from '@/algorithms/single-cycle/config'
import { config as bubbleSortConfig } from '@/algorithms/bubble-sort/config'
import { config as bucketSortConfig } from '@/algorithms/bucket-sort/config'
import { config as twoSumConfig } from '@/algorithms/two-sum/config'

export const categories = ['Arrays', 'Ordenacao', 'Listas', 'Grafos', 'Arvores', 'Hash', 'Strings'] as const
export type Category = (typeof categories)[number]

export const categoryInfo: Record<Category, { name: string; icon: string; description: string }> = {
  Arrays: { name: 'Arrays', icon: '[ ]', description: 'Manipulacao e busca em arrays' },
  Ordenacao: { name: 'Ordenacao', icon: '↕', description: 'Algoritmos de ordenacao' },
  Listas: { name: 'Listas', icon: '→', description: 'Listas ligadas e estruturas lineares' },
  Grafos: { name: 'Grafos', icon: '◉', description: 'Busca e caminhos em grafos' },
  Arvores: { name: 'Arvores', icon: '△', description: 'Arvores binarias e balanceadas' },
  Hash: { name: 'Hash', icon: '#', description: 'Tabelas hash e hashing' },
  Strings: { name: 'Strings', icon: 'Aa', description: 'Manipulacao de strings' },
}

export const algorithms = {
  'single-cycle-check': singleCycleConfig,
  'bubble-sort': bubbleSortConfig,
  'bucket-sort': bucketSortConfig,
  'two-sum': twoSumConfig,
} as const

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

  for (const algo of allAlgorithms) {
    const category = algo.category as Category
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category]!.push(algo)
  }

  return grouped
}
