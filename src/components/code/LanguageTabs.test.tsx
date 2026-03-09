import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LanguageTabs } from './LanguageTabs'

describe('LanguageTabs', () => {
  it('renders language options', () => {
    render(<LanguageTabs languages={['python', 'rust']} active="python" onChange={() => {}} />)
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Rust')).toBeInTheDocument()
  })

  it('calls onChange when tab clicked', () => {
    const onChange = vi.fn()
    render(<LanguageTabs languages={['python', 'rust']} active="python" onChange={onChange} />)
    fireEvent.click(screen.getByText('Rust'))
    expect(onChange).toHaveBeenCalledWith('rust')
  })
})
