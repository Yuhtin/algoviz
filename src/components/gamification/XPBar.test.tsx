import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { XPBar } from './XPBar'

describe('XPBar', () => {
  it('renders current level', () => {
    render(<XPBar xp={150} level={2} />)
    expect(screen.getByText('Nível 2')).toBeInTheDocument()
  })

  it('renders XP progress', () => {
    render(<XPBar xp={150} level={2} />)
    expect(screen.getByText('50/100 XP')).toBeInTheDocument()
  })

  it('renders level badge with level number', () => {
    render(<XPBar xp={250} level={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Nível 3')).toBeInTheDocument()
  })

  it('shows correct XP for level 1', () => {
    render(<XPBar xp={75} level={1} />)
    expect(screen.getByText('75/100 XP')).toBeInTheDocument()
  })

  it('shows 0 XP when exactly at level boundary', () => {
    render(<XPBar xp={200} level={3} />)
    expect(screen.getByText('0/100 XP')).toBeInTheDocument()
  })
})
