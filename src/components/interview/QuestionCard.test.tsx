import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuestionCard } from './QuestionCard'
import type { InterviewQuestion } from '@/types/interview'

const mockQuestion: InterviewQuestion = {
  id: 'q1',
  question: 'Explique Bubble Sort',
  difficulty: 'easy',
  companies: ['Google'],
  rubric: [],
  idealAnswer: 'Test answer',
}

describe('QuestionCard', () => {
  it('renders question text', () => {
    render(<QuestionCard question={mockQuestion} onStartChat={() => {}} />)
    expect(screen.getByText('Explique Bubble Sort')).toBeInTheDocument()
  })

  it('renders difficulty badge', () => {
    render(<QuestionCard question={mockQuestion} onStartChat={() => {}} />)
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('calls onStartChat when clicked', () => {
    const onStartChat = vi.fn()
    render(<QuestionCard question={mockQuestion} onStartChat={onStartChat} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onStartChat).toHaveBeenCalledWith('q1')
  })

  it('renders company tags', () => {
    render(<QuestionCard question={mockQuestion} onStartChat={() => {}} />)
    expect(screen.getByText('Google')).toBeInTheDocument()
  })

  it('renders tip when provided', () => {
    const questionWithTip: InterviewQuestion = {
      ...mockQuestion,
      tip: 'Pense na complexidade',
    }
    render(<QuestionCard question={questionWithTip} onStartChat={() => {}} />)
    expect(screen.getByText('Pense na complexidade')).toBeInTheDocument()
  })

  it('does not render companies section when empty', () => {
    const questionWithoutCompanies: InterviewQuestion = {
      ...mockQuestion,
      companies: [],
    }
    render(<QuestionCard question={questionWithoutCompanies} onStartChat={() => {}} />)
    expect(screen.queryByText('Google')).not.toBeInTheDocument()
  })
})
