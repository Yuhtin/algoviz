// scripts/lib/yaml-parser.ts
import { parse } from 'yaml'

export interface RawAlgorithmYaml {
  slug: string
  name: string
  category: string
  description: string
  difficulty: string
  tags: string[]
  complexity: { time: string; space: string }
  presets: Array<{ label: string; data: unknown }>
  concepts: Record<string, { label: string; explanation: string }>
  theory: {
    howItWorks: { title: string; content: string; steps: string[] }
    keyInsight: string
    commonMistakes: string[]
    bigO: {
      time: { notation: string; explanation: string; proof?: string }
      space: { notation: string; explanation: string }
      bestCase?: { notation: string; explanation: string }
      worstCase?: { notation: string; explanation: string }
    }
    comparisons: Array<{
      name: string
      slug?: string
      time: string
      space: string
      stable?: boolean
      bestFor?: string
    }>
  }
  interview: Array<{
    id: string
    question: string
    difficulty: string
    companies?: string[]
    tip?: string
    followUp?: string
    rubric: Array<{ point: string; required: boolean }>
    idealAnswer: string
  }>
}

const REQUIRED_FIELDS = [
  'slug',
  'name',
  'category',
  'description',
  'difficulty',
  'tags',
  'complexity',
  'concepts',
  'theory',
]

export function parseAlgorithmYaml(yamlContent: string): RawAlgorithmYaml {
  return parse(yamlContent) as RawAlgorithmYaml
}

export function validateYaml(data: RawAlgorithmYaml): void {
  const missing = REQUIRED_FIELDS.filter(
    (field) => !(field in data) || data[field as keyof RawAlgorithmYaml] === undefined
  )

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }

  if (!data.theory?.howItWorks) {
    throw new Error('Missing theory.howItWorks')
  }

  if (!data.theory?.bigO) {
    throw new Error('Missing theory.bigO')
  }
}
