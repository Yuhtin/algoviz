import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TableOfContents } from './TableOfContents'

const sections = [
  { id: 'visualizer', label: 'Visualizador' },
  { id: 'theory', label: 'Como Funciona' },
  { id: 'bigo', label: 'Análise BigO' },
]

describe('TableOfContents', () => {
  it('renders all section links', () => {
    render(<TableOfContents sections={sections} activeSection="visualizer" />)
    expect(screen.getByText('Visualizador')).toBeInTheDocument()
    expect(screen.getByText('Como Funciona')).toBeInTheDocument()
    expect(screen.getByText('Análise BigO')).toBeInTheDocument()
  })

  it('highlights active section', () => {
    render(<TableOfContents sections={sections} activeSection="theory" />)
    const activeLink = screen.getByText('Como Funciona')
    expect(activeLink.closest('a')).toHaveAttribute('data-active', 'true')
  })
})
