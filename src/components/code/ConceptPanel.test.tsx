import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConceptPanel } from './ConceptPanel'
import type { CodeAnnotation } from '@/types/code'

const annotations: CodeAnnotation[] = [
  { lineStart: 1, lineEnd: 1, conceptId: 'concept1', conceptLabel: 'Concept 1', explanation: 'Explanation 1' },
  { lineStart: 2, lineEnd: 3, conceptId: 'concept2', conceptLabel: 'Concept 2', explanation: 'Explanation 2' },
]

describe('ConceptPanel', () => {
  it('renders all concepts', () => {
    render(<ConceptPanel annotations={annotations} activeConcept={null} />)
    expect(screen.getByText('Concept 1')).toBeInTheDocument()
    expect(screen.getByText('Concept 2')).toBeInTheDocument()
  })

  it('highlights active concept', () => {
    render(<ConceptPanel annotations={annotations} activeConcept="concept1" />)
    const concept = screen.getByText('Concept 1').closest('div[data-active]')
    expect(concept).toHaveAttribute('data-active', 'true')
  })
})
