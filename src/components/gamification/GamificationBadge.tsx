// src/components/gamification/GamificationBadge.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '@/lib/colors'

interface GamificationBadgeProps {
  xp: number
  level: number
  streak: number
  bestStreak: number
}

const XP_PER_LEVEL = 100

export function GamificationBadge({ xp, level, streak, bestStreak }: GamificationBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const xpInCurrentLevel = xp % XP_PER_LEVEL
  const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compact Badge */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${colors.visited} 0%, ${colors.accent} 100%)`,
            color: colors.bg,
          }}
        >
          {level}
        </div>
        <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
          {xp} XP
        </span>
      </div>

      {/* Hover Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 p-4 rounded-xl z-50"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 10px 40px ${colors.bg}80`,
            }}
          >
            {/* Level & XP */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: colors.text }}>
                  Nivel {level}
                </span>
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  {xpInCurrentLevel}/{XP_PER_LEVEL} XP
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: colors.surfaceLight }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `linear-gradient(90deg, ${colors.visited} 0%, ${colors.accent} 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Streak */}
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: colors.text }}>
                    {streak} {streak === 1 ? 'dia' : 'dias'}
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    Sequencia atual
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: colors.accent }}>
                  {bestStreak}
                </div>
                <div className="text-xs" style={{ color: colors.textMuted }}>
                  Recorde
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
