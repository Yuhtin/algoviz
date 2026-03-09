import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComparisonTable } from './ComparisonTable'

const algorithms = [
  { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', stable: true },
  { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', stable: true },
  { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', stable: false },
]

describe('ComparisonTable', () => {
  it('renders all algorithm names', () => {
    render(<ComparisonTable algorithms={algorithms} currentSlug="bubble-sort" />)
    expect(screen.getByText('Bubble Sort')).toBeInTheDocument()
    expect(screen.getByText('Merge Sort')).toBeInTheDocument()
    expect(screen.getByText('Quick Sort')).toBeInTheDocument()
  })

  it('highlights current algorithm', () => {
    render(<ComparisonTable algorithms={algorithms} currentSlug="bubble-sort" />)
    const row = screen.getByText('Bubble Sort').closest('tr')
    expect(row).toHaveAttribute('data-current', 'true')
  })
})
