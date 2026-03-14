// scripts/lib/code-parser.test.ts
import { describe, it, expect } from 'vitest'
import { parseCodeMarkers } from './code-parser'

describe('parseCodeMarkers', () => {
  it('extracts Python markers', () => {
    const code = `def func():  # #@function-def
    x = 1  # #@assignment
    return x`

    const result = parseCodeMarkers(code, 'python')

    expect(result.cleanCode).toBe(`def func():
    x = 1
    return x`)
    expect(result.markers).toEqual([
      { line: 1, conceptId: 'function-def' },
      { line: 2, conceptId: 'assignment' },
    ])
  })

  it('extracts Rust markers', () => {
    const code = `fn main() {  // #@main-fn
    let x = 1;  // #@let-binding
}`

    const result = parseCodeMarkers(code, 'rust')

    expect(result.cleanCode).toBe(`fn main() {
    let x = 1;
}`)
    expect(result.markers).toEqual([
      { line: 1, conceptId: 'main-fn' },
      { line: 2, conceptId: 'let-binding' },
    ])
  })

  it('handles lines without markers', () => {
    const code = `def func():
    return 1  # #@return`

    const result = parseCodeMarkers(code, 'python')

    expect(result.markers).toHaveLength(1)
    expect(result.markers[0]).toEqual({ line: 2, conceptId: 'return' })
  })
})
