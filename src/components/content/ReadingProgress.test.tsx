// src/components/content/ReadingProgress.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReadingProgress } from './ReadingProgress'

describe('ReadingProgress', () => {
  it('renders progress bar with 0% initially', () => {
    render(<ReadingProgress readingTime={5} />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('displays reading time in minutes', () => {
    render(<ReadingProgress readingTime={8} />)
    expect(screen.getByText('8 min')).toBeInTheDocument()
  })
})
