import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BigOAnalysis } from './BigOAnalysis'

describe('BigOAnalysis', () => {
  it('renders time and space complexity', () => {
    render(
      <BigOAnalysis
        time={{ notation: 'O(n²)', explanation: 'Dois loops aninhados' }}
        space={{ notation: 'O(1)', explanation: 'In-place' }}
      />
    )
    expect(screen.getByText('O(n²)')).toBeInTheDocument()
    expect(screen.getByText('O(1)')).toBeInTheDocument()
  })

  it('renders explanations', () => {
    render(
      <BigOAnalysis
        time={{ notation: 'O(n)', explanation: 'Um loop' }}
        space={{ notation: 'O(n)', explanation: 'Hash map' }}
      />
    )
    expect(screen.getByText('Um loop')).toBeInTheDocument()
    expect(screen.getByText('Hash map')).toBeInTheDocument()
  })
})
