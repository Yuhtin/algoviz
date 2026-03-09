import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('renders section with id', () => {
    render(<Section id="theory" title="Como Funciona"><p>Content</p></Section>)
    expect(document.getElementById('theory')).toBeInTheDocument()
  })

  it('renders title as h2', () => {
    render(<Section id="test" title="Test Title"><p>Content</p></Section>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Title')
  })
})
