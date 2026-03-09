import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StreakCounter } from './StreakCounter'

describe('StreakCounter', () => {
  it('renders current streak', () => {
    render(<StreakCounter current={5} best={10} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders fire emoji', () => {
    render(<StreakCounter current={5} best={10} />)
    expect(screen.getByText('🔥')).toBeInTheDocument()
  })

  it('renders dias label', () => {
    render(<StreakCounter current={5} best={10} />)
    expect(screen.getByText('dias')).toBeInTheDocument()
  })

  it('shows record badge when current equals best', () => {
    render(<StreakCounter current={10} best={10} />)
    expect(screen.getByText('Recorde!')).toBeInTheDocument()
  })

  it('does not show record badge when current is less than best', () => {
    render(<StreakCounter current={5} best={10} />)
    expect(screen.queryByText('Recorde!')).not.toBeInTheDocument()
  })

  it('does not show record badge when streak is 0', () => {
    render(<StreakCounter current={0} best={0} />)
    expect(screen.queryByText('Recorde!')).not.toBeInTheDocument()
  })
})
