'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { QuizMission as QuizMissionType } from '@/types/trail'
import { colors } from '@/lib/colors'

interface Props {
  mission: QuizMissionType
  isCompleted: boolean
  onComplete: (result: {
    answers: number[]
    score: number
    perfectScore: boolean
    xpEarned: number
  }) => void
}

export function QuizMission({ mission, isCompleted, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const question = mission.questions[currentQuestion]
  const isLastQuestion = currentQuestion === mission.questions.length - 1
  const isCorrect = selectedAnswer === question?.correct

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleConfirm = () => {
    if (selectedAnswer === null) return
    setIsAnswered(true)
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (isLastQuestion) {
        const correctCount = newAnswers.filter((ans, idx) => ans === mission.questions[idx].correct).length
        const perfectScore = correctCount === mission.questions.length
        const xpEarned = correctCount * mission.xpPerQuestion + (perfectScore ? mission.perfectBonus : 0)
        onComplete({ answers: newAnswers, score: correctCount, perfectScore, xpEarned })
        setShowResult(true)
      } else {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
      }
    }, 1500)
  }

  if (isCompleted && !showResult) {
    return (
      <div className="text-center py-8 px-6 rounded-xl" style={{ backgroundColor: `${colors.accent}20` }}>
        <span className="text-4xl mb-4 block">✓</span>
        <p style={{ color: colors.accent }}>Quiz já completado!</p>
      </div>
    )
  }

  if (showResult) {
    const correctCount = answers.filter((ans, idx) => ans === mission.questions[idx].correct).length
    const perfectScore = correctCount === mission.questions.length
    const xpEarned = correctCount * mission.xpPerQuestion + (perfectScore ? mission.perfectBonus : 0)

    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.2 }} className="text-7xl mb-6">
          {perfectScore ? '🏆' : correctCount > 0 ? '🎉' : '📚'}
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
          {perfectScore ? 'Perfeito!' : correctCount > mission.questions.length / 2 ? 'Muito bem!' : 'Continue estudando!'}
        </h2>
        <p className="text-lg mb-4" style={{ color: colors.textMuted }}>
          Você acertou {correctCount} de {mission.questions.length} questões
        </p>
        <div className="inline-block px-6 py-3 rounded-xl" style={{ backgroundColor: `${colors.accent}20` }}>
          <span className="text-2xl font-bold" style={{ color: colors.accent }}>+{xpEarned} XP</span>
          {perfectScore && <span className="block text-sm" style={{ color: colors.accent }}>(incluindo bônus de {mission.perfectBonus} XP!)</span>}
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        {mission.questions.map((_, idx) => (
          <div key={idx} className="flex-1 h-2 rounded-full" style={{
            backgroundColor: idx < currentQuestion ? colors.accent : idx === currentQuestion ? colors.visited : colors.border,
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <h2 className="text-xl font-medium mb-6" style={{ color: colors.text }}>{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const showCorrect = isAnswered && idx === question.correct
              const showWrong = isAnswered && isSelected && !isCorrect

              return (
                <motion.button
                  key={idx}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswered}
                  className="w-full p-4 rounded-xl text-left transition-all border"
                  style={{
                    backgroundColor: showCorrect ? `${colors.accent}20` : showWrong ? `${colors.warning}20` : isSelected ? colors.surface : 'transparent',
                    borderColor: showCorrect ? colors.accent : showWrong ? colors.warning : isSelected ? colors.accent : colors.border,
                    color: colors.text,
                    cursor: isAnswered ? 'default' : 'pointer',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{
                      backgroundColor: showCorrect ? colors.accent : showWrong ? colors.warning : colors.border,
                      color: showCorrect || showWrong ? '#fff' : colors.text,
                    }}>
                      {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {!isAnswered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedAnswer !== null ? 1 : 0.5 }}
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="w-full mt-6 py-4 rounded-xl font-medium"
              style={{ backgroundColor: colors.accent, color: colors.bg, cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed' }}
            >
              Confirmar
            </motion.button>
          )}

          {isAnswered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl text-center"
              style={{ backgroundColor: isCorrect ? `${colors.accent}20` : `${colors.warning}20` }}>
              <span style={{ color: isCorrect ? colors.accent : colors.warning }}>
                {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
