import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PullQuote } from './PullQuote'

describe('PullQuote', () => {
  it('renders quote text', () => {
    render(<PullQuote>Hash Map transforma O(n²) em O(n)</PullQuote>)
    expect(screen.getByText(/Hash Map transforma O\(n²\) em O\(n\)/)).toBeInTheDocument()
  })

  it('renders as blockquote element', () => {
    render(<PullQuote>Test quote</PullQuote>)
    expect(screen.getByRole('blockquote')).toBeInTheDocument()
  })
})
