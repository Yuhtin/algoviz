import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Collapsible } from './Collapsible'

describe('Collapsible', () => {
  it('renders title always visible', () => {
    render(<Collapsible title="Por que O(n)?"><p>Explicacao detalhada</p></Collapsible>)
    expect(screen.getByText('Por que O(n)?')).toBeInTheDocument()
  })

  it('hides content by default', () => {
    render(<Collapsible title="Title"><p>Hidden content</p></Collapsible>)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('shows content when clicked', () => {
    render(<Collapsible title="Title"><p>Hidden content</p></Collapsible>)
    fireEvent.click(screen.getByText('Title'))
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })
})
