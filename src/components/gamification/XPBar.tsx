'use client'

import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

interface XPBarProps {
  xp: number
  level: number
}

const XP_PER_LEVEL = 100

export function XPBar({ xp, level }: XPBarProps) {
  const xpInCurrentLevel = xp % XP_PER_LEVEL
  const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100

  return (
    <div className="flex items-center gap-4">
      {/* Level Badge */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
        style={{
          background: `linear-gradient(135deg, ${colors.visited} 0%, ${colors.accent} 100%)`,
          color: colors.bg,
          boxShadow: `0 0 20px ${colors.visitedGlow}`,
        }}
      >
        {level}
      </div>

      {/* Progress Section */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium" style={{ color: colors.text }}>
            Nível {level}
          </span>
          <span className="text-sm" style={{ color: colors.textMuted }}>
            {xpInCurrentLevel}/{XP_PER_LEVEL} XP
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ background: colors.surface }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, ${colors.visited} 0%, ${colors.accent} 100%)`,
              boxShadow: `0 0 10px ${colors.accentGlow}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
