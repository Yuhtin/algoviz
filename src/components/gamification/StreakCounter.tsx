'use client'

import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

interface StreakCounterProps {
  current: number
  best: number
}

export function StreakCounter({ current, best }: StreakCounterProps) {
  const isRecord = current > 0 && current === best

  return (
    <div className="flex items-center gap-3">
      {/* Fire Emoji */}
      <motion.span
        className="text-2xl"
        animate={
          current > 0
            ? {
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🔥
      </motion.span>

      {/* Streak Number */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className="text-3xl font-bold"
          style={{ color: current > 0 ? colors.current : colors.textMuted }}
          key={current}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {current}
        </motion.span>
        <span className="text-sm" style={{ color: colors.textMuted }}>
          dias
        </span>
      </div>

      {/* Record Badge */}
      {isRecord && (
        <motion.div
          className="px-2 py-1 rounded-full text-xs font-medium"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          style={{
            background: `linear-gradient(135deg, ${colors.current} 0%, ${colors.accent} 100%)`,
            color: colors.bg,
          }}
        >
          Recorde!
        </motion.div>
      )}
    </div>
  )
}
