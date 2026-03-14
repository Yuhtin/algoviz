// scripts/lib/yaml-parser.test.ts
import { describe, it, expect } from 'vitest'
import { parseAlgorithmYaml, validateYaml } from './yaml-parser'

describe('parseAlgorithmYaml', () => {
  it('parses valid YAML', () => {
    const yaml = `
slug: test-algo
name: Test Algorithm
category: Ordenacao
description: A test algorithm
difficulty: Facil
tags: [test, demo]
complexity:
  time: O(n)
  space: O(1)
presets:
  - label: Default
    data: [1, 2, 3]
concepts:
  main:
    label: Main
    explanation: The main concept
theory:
  howItWorks:
    title: How It Works
    content: It works like this
    steps:
      - Step 1
      - Step 2
  keyInsight: Key insight here
  commonMistakes:
    - Mistake 1
  bigO:
    time:
      notation: O(n)
      explanation: Linear time
    space:
      notation: O(1)
      explanation: Constant space
  comparisons: []
interview: []
`
    const result = parseAlgorithmYaml(yaml)

    expect(result.slug).toBe('test-algo')
    expect(result.name).toBe('Test Algorithm')
    expect(result.concepts.main.label).toBe('Main')
  })
})

describe('validateYaml', () => {
  it('throws on missing required fields', () => {
    const yaml = `
slug: test
name: Test
`
    expect(() => validateYaml(parseAlgorithmYaml(yaml))).toThrow()
  })
})
