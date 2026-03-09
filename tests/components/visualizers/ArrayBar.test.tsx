// tests/components/visualizers/ArrayBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArrayBar, type CellState } from '@/components/visualizers/ArrayBar'

describe('ArrayBar', () => {
  it('renders value and index', () => {
    render(<ArrayBar value={5} index={0} state="default" />)
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('i=0')).toBeInTheDocument()
  })

  it('renders negative values correctly', () => {
    render(<ArrayBar value={-3} index={1} state="default" />)
    expect(screen.getByText('-3')).toBeInTheDocument()
  })

  it('applies active state styling', () => {
    const { container } = render(<ArrayBar value={2} index={0} state="active" />)
    const cell = container.querySelector('[data-state="active"]')
    expect(cell).toBeInTheDocument()
  })

  it('shows direction indicator for positive values', () => {
    render(<ArrayBar value={2} index={0} state="default" showDirection />)
    expect(screen.getByText('direita')).toBeInTheDocument()
  })

  it('shows direction indicator for negative values', () => {
    render(<ArrayBar value={-2} index={0} state="default" showDirection />)
    expect(screen.getByText('esquerda')).toBeInTheDocument()
  })
})
