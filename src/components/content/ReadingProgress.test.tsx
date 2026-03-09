// src/components/content/ReadingProgress.test.tsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

  it('has accessible label for reading time badge', () => {
    render(<ReadingProgress readingTime={5} />)
    expect(screen.getByLabelText('Tempo de leitura: 5 minutos')).toBeInTheDocument()
  })

  describe('scroll behavior', () => {
    beforeEach(() => {
      vi.stubGlobal('scrollY', 0)
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        configurable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        configurable: true,
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('updates progress when user scrolls', () => {
      render(<ReadingProgress readingTime={5} />)

      // Initially at 0%
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

      // Simulate scroll to 50%
      vi.stubGlobal('scrollY', 500)
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    })

    it('handles edge case when scrollHeight equals innerHeight', () => {
      // Set scrollHeight equal to innerHeight (no scrollable content)
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1000,
        configurable: true,
      })

      render(<ReadingProgress readingTime={5} />)

      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })

      // Should set progress to 100 when there's no scrollable content
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })
})
