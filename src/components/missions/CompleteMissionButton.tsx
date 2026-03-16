'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

interface Props {
  isCompleted: boolean
  xp: number
  onComplete: () => void
}

export function CompleteMissionButton({ isCompleted, xp, onComplete }: Props) {
  const [justCompleted, setJustCompleted] = useState(false)

  const handleClick = () => {
    if (isCompleted) return
    onComplete()
    setJustCompleted(true)
  }

  if (justCompleted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <p className="text-xl font-bold" style={{ color: colors.accent }}>
          +{xp} XP
        </p>
        <p style={{ color: colors.textMuted }}>Missão concluída!</p>
      </motion.div>
    )
  }

  if (isCompleted) {
    return (
      <div
        className="text-center py-4 px-6 rounded-xl"
        style={{ backgroundColor: `${colors.accent}20` }}
      >
        <span style={{ color: colors.accent }}>✓ Missão já concluída</span>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-full py-4 px-6 rounded-xl font-medium text-lg transition-colors"
      style={{ backgroundColor: colors.accent, color: colors.bg }}
    >
      Concluir Missão (+{xp} XP)
    </motion.button>
  )
}
