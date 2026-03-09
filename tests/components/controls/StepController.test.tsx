// tests/components/controls/StepController.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepController } from '@/components/controls/StepController'

describe('StepController', () => {
  const defaultProps = {
    isPlaying: false,
    isFinished: false,
    canGoBack: true,
    canGoForward: true,
    speed: 1000,
    onPlayPause: vi.fn(),
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onReset: vi.fn(),
    onSpeedChange: vi.fn(),
  }

  it('renders play button when not playing', () => {
    render(<StepController {...defaultProps} />)
    expect(screen.getByText(/Play/)).toBeInTheDocument()
  })

  it('renders pause button when playing', () => {
    render(<StepController {...defaultProps} isPlaying={true} />)
    expect(screen.getByText(/Pausar/)).toBeInTheDocument()
  })

  it('renders replay button when finished', () => {
    render(<StepController {...defaultProps} isFinished={true} />)
    expect(screen.getByText(/Replay/)).toBeInTheDocument()
  })

  it('calls onPlayPause when play button clicked', () => {
    const onPlayPause = vi.fn()
    render(<StepController {...defaultProps} onPlayPause={onPlayPause} />)
    fireEvent.click(screen.getByText(/Play/))
    expect(onPlayPause).toHaveBeenCalled()
  })

  it('disables prev button when canGoBack is false', () => {
    render(<StepController {...defaultProps} canGoBack={false} />)
    expect(screen.getByText(/Anterior/)).toBeDisabled()
  })
})
