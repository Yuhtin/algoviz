'use client'
import { colors } from '@/lib/colors'
import type { InterviewQuestion } from '@/types/interview'

interface QuestionCardProps {
  question: InterviewQuestion
  onStartChat: (questionId: string) => void
}

const difficultyColors = {
  easy: colors.accent,
  medium: colors.current,
  hard: colors.warning,
} as const

export function QuestionCard({ question, onStartChat }: QuestionCardProps) {
  return (
    <button
      onClick={() => onStartChat(question.id)}
      className="w-full text-left p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium" style={{ color: colors.text }}>
          {question.question}
        </h3>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium shrink-0"
          style={{
            background: `${difficultyColors[question.difficulty]}22`,
            color: difficultyColors[question.difficulty],
          }}
        >
          {question.difficulty}
        </span>
      </div>

      {question.companies && question.companies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {question.companies.map((company) => (
            <span
              key={company}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: colors.surfaceLight,
                color: colors.textMuted,
              }}
            >
              {company}
            </span>
          ))}
        </div>
      )}

      {question.tip && (
        <p
          className="text-sm mt-2"
          style={{ color: colors.textMuted }}
        >
          {question.tip}
        </p>
      )}
    </button>
  )
}
