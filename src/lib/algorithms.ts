// src/lib/algorithms.ts
import { config as singleCycleConfig } from '@/algorithms/single-cycle/config'
import { config as bubbleSortConfig } from '@/algorithms/bubble-sort/config'
import { config as twoSumConfig } from '@/algorithms/two-sum/config'

export const algorithms = {
  'single-cycle-check': singleCycleConfig,
  'bubble-sort': bubbleSortConfig,
  'two-sum': twoSumConfig,
} as const

export type AlgorithmSlug = keyof typeof algorithms

export function getAlgorithm(slug: string) {
  return algorithms[slug as AlgorithmSlug] || null
}

export function getAllAlgorithms() {
  return Object.values(algorithms)
}
