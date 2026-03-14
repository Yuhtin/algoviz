// src/types/algorithm.ts
import type { CodeFile } from './code'
import type { InterviewData } from './interview'

export type Difficulty = 'Facil' | 'Media' | 'Dificil'
export type Category = 'Ordenacao' | 'Busca' | 'Grafos' | 'Arrays' | 'Strings' | 'Linked Lists'

export interface Complexity {
  time: string
  space: string
}

export interface Preset<T = unknown> {
  label: string
  data: T
}

export interface Concept {
  label: string
  explanation: string
}

export interface BigODetail {
  notation: string
  explanation: string
  proof?: string
}

export interface BigOAnalysis {
  time: BigODetail
  space: BigODetail
  bestCase?: BigODetail
  worstCase?: BigODetail
}

export interface HowItWorks {
  title: string
  content: string
  steps: string[]
}

export interface ComparisonItem {
  name: string
  slug?: string
  time: string
  space: string
  stable?: boolean
  bestFor?: string
}

export interface AlgorithmTheory {
  howItWorks: HowItWorks
  keyInsight: string
  commonMistakes: string[]
  bigO: BigOAnalysis
  comparisons: ComparisonItem[]
}

export interface AlgorithmCode {
  python: CodeFile
  rust: CodeFile
}

export interface AlgorithmDefinition {
  slug: string
  name: string
  category: Category
  description: string
  difficulty: Difficulty
  tags: string[]
  complexity: Complexity
  presets: Preset[]
  concepts: Record<string, Concept>
  theory: AlgorithmTheory
  code: AlgorithmCode
  interview: InterviewData
}
