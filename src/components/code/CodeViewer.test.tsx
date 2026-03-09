import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CodeViewer } from './CodeViewer'
import type { CodeFile } from '@/types/code'

const mockCode: CodeFile = {
  language: 'python',
  code: 'def test():\n    return 1',
  annotations: [
    { lineStart: 1, lineEnd: 1, conceptId: 'test', conceptLabel: 'Test', explanation: 'Test explanation' }
  ],
}

describe('CodeViewer', () => {
  it('renders code content', () => {
    render(<CodeViewer codeFile={mockCode} />)
    expect(screen.getByText(/def test/)).toBeInTheDocument()
  })

  it('renders language badge', () => {
    render(<CodeViewer codeFile={mockCode} />)
    expect(screen.getByText('python')).toBeInTheDocument()
  })
})
