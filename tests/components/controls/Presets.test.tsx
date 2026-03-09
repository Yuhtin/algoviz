// tests/components/controls/Presets.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Presets, type PresetOption } from '@/components/controls/Presets'

describe('Presets', () => {
  const presets: PresetOption<number[]>[] = [
    { label: 'Ciclo Unico (True)', data: [2, 3, 1, -4, -4, 2] },
    { label: 'Sem Ciclo (False)', data: [1, 1, 1, 1, 2] },
  ]

  it('renders all preset buttons', () => {
    render(<Presets options={presets} selected={presets[0].data} onSelect={vi.fn()} />)
    expect(screen.getByText('Ciclo Unico (True)')).toBeInTheDocument()
    expect(screen.getByText('Sem Ciclo (False)')).toBeInTheDocument()
  })

  it('highlights selected preset', () => {
    const { container } = render(
      <Presets options={presets} selected={presets[0].data} onSelect={vi.fn()} />
    )
    const selected = container.querySelector('[data-selected="true"]')
    expect(selected).toHaveTextContent('Ciclo Unico (True)')
  })

  it('calls onSelect when preset clicked', () => {
    const onSelect = vi.fn()
    render(<Presets options={presets} selected={presets[0].data} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Sem Ciclo (False)'))
    expect(onSelect).toHaveBeenCalledWith([1, 1, 1, 1, 2])
  })
})
