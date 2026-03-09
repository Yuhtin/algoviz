import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SectionTabs } from './SectionTabs'

const tabs = [
  { id: 'visualizer-theory', label: 'Visualizador + Teoria' },
  { id: 'practice', label: 'Prática' },
  { id: 'code', label: 'Código' },
]

describe('SectionTabs', () => {
  it('renders all tabs', () => {
    render(<SectionTabs tabs={tabs} activeTab="visualizer-theory" onTabChange={() => {}} />)
    expect(screen.getByText('Visualizador + Teoria')).toBeInTheDocument()
    expect(screen.getByText('Prática')).toBeInTheDocument()
    expect(screen.getByText('Código')).toBeInTheDocument()
  })

  it('calls onTabChange when tab clicked', () => {
    const onTabChange = vi.fn()
    render(<SectionTabs tabs={tabs} activeTab="visualizer-theory" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('Prática'))
    expect(onTabChange).toHaveBeenCalledWith('practice')
  })
})
