// Auto-generated from ${yaml.slug}/algorithm.yml - DO NOT EDIT
import type { RawAlgorithmYaml } from './yaml-parser'
import type { CodeMarker } from './code-parser'

function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
}

interface RawRubricItem {
  point: string
  required: boolean
}

interface RawInterviewQuestion {
  id: string
  question: string
  difficulty: string
  companies?: string[]
  tip?: string
  followUp?: string
  rubric: RawRubricItem[]
  idealAnswer: string
}

interface ProcessedRubricItem {
  id: string
  point: string
  required: boolean
}

interface ProcessedInterviewQuestion {
  id: string
  question: string
  difficulty: string
  companies?: string[]
  tip?: string
  followUp?: string
  rubric: ProcessedRubricItem[]
  idealAnswer: string
}

function processInterviewQuestions(questions: RawInterviewQuestion[]): ProcessedInterviewQuestion[] {
  return questions.map((q) => ({
    ...q,
    rubric: q.rubric.map((r, index) => ({
      id: `${q.id}-rubric-${index + 1}`,
      point: r.point,
      required: r.required,
    })),
  }))
}

interface GenerateOptions {
  yaml: RawAlgorithmYaml
  pythonCode: string
  pythonMarkers: CodeMarker[]
  rustCode: string
  rustMarkers: CodeMarker[]
}

export function generateAlgorithmFile(options: GenerateOptions): string {
  const { yaml, pythonCode, pythonMarkers, rustCode, rustMarkers } = options
  const varName = toCamelCase(yaml.slug)

  const pythonAnnotations = pythonMarkers.map((m) => {
    const concept = yaml.concepts[m.conceptId]
    if (!concept) {
      throw new Error(`Concept "${m.conceptId}" not found in YAML for ${yaml.slug}`)
    }
    return {
      lineStart: m.line,
      lineEnd: m.line,
      conceptId: m.conceptId,
      conceptLabel: concept.label,
      explanation: concept.explanation,
    }
  })

  const rustAnnotations = rustMarkers.map((m) => {
    const concept = yaml.concepts[m.conceptId]
    if (!concept) {
      throw new Error(`Concept "${m.conceptId}" not found in YAML for ${yaml.slug}`)
    }
    return {
      lineStart: m.line,
      lineEnd: m.line,
      conceptId: m.conceptId,
      conceptLabel: concept.label,
      explanation: concept.explanation,
    }
  })

  return `// Auto-generated from ${yaml.slug}/algorithm.yml - DO NOT EDIT
import type { AlgorithmDefinition } from '@/types/algorithm'

export const ${varName}: AlgorithmDefinition = {
  slug: '${yaml.slug}',
  name: '${yaml.name}',
  category: '${yaml.category}' as const,
  description: '${escapeString(yaml.description)}',
  difficulty: '${yaml.difficulty}' as const,
  tags: ${JSON.stringify(yaml.tags)},
  complexity: ${JSON.stringify(yaml.complexity)},
  presets: ${JSON.stringify(yaml.presets)},
  concepts: ${JSON.stringify(yaml.concepts, null, 2)},

  theory: {
    howItWorks: {
      title: '${escapeString(yaml.theory.howItWorks.title)}',
      content: \`${escapeString(yaml.theory.howItWorks.content)}\`,
      steps: ${JSON.stringify(yaml.theory.howItWorks.steps)},
    },
    keyInsight: '${escapeString(yaml.theory.keyInsight)}',
    commonMistakes: ${JSON.stringify(yaml.theory.commonMistakes)},
    bigO: ${JSON.stringify(yaml.theory.bigO, null, 2)},
    comparisons: ${JSON.stringify(yaml.theory.comparisons, null, 2)},
  },

  code: {
    python: {
      language: 'python' as const,
      code: \`${escapeString(pythonCode)}\`,
      annotations: ${JSON.stringify(pythonAnnotations, null, 2)},
    },
    rust: {
      language: 'rust' as const,
      code: \`${escapeString(rustCode)}\`,
      annotations: ${JSON.stringify(rustAnnotations, null, 2)},
    },
  },

  interview: {
    questions: ${JSON.stringify(processInterviewQuestions(yaml.interview || []), null, 2)},
  },
}
`
}

export function generateIndexFile(slugs: string[]): string {
  const imports = slugs
    .map((slug) => {
      const varName = toCamelCase(slug)
      return `export { ${varName} } from './${slug}'`
    })
    .join('\n')

  const record = slugs
    .map((slug) => {
      const varName = toCamelCase(slug)
      return `  '${slug}': ${varName},`
    })
    .join('\n')

  return `// Auto-generated - DO NOT EDIT
${imports}

import { ${slugs.map(toCamelCase).join(', ')} } from './index'

export const algorithms = {
${record}
} as const

export type AlgorithmSlug = keyof typeof algorithms
`
}
