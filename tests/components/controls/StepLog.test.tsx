// tests/components/controls/StepLog.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'

describe('StepLog', () => {
  const entries: LogEntry[] = [
    { step: 0, description: 'Iniciando em i=0', detail: 'arr[0] = 2' },
    { step: 1, description: 'Saltando para i=2', detail: '(0+2) mod 6 = 2' },
  ]

  it('renders all entries', () => {
    render(<StepLog entries={entries} currentStep={0} />)
    expect(screen.getByText('#0')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('highlights current step', () => {
    const { container } = render(<StepLog entries={entries} currentStep={1} />)
    const highlighted = container.querySelector('[data-current="true"]')
    expect(highlighted).toBeInTheDocument()
  })

  it('shows step descriptions', () => {
    render(<StepLog entries={entries} currentStep={0} />)
    expect(screen.getByText('Iniciando em i=0')).toBeInTheDocument()
  })
})
