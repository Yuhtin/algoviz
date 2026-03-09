// src/components/visualizers/ArrayBar.tsx
'use client'

import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

export type CellState = 'default' | 'active' | 'visited' | 'target' | 'comparing' | 'swapping'

interface ArrayBarProps {
  value: number
  index: number
  state: CellState
  showDirection?: boolean
  showCheckmark?: boolean
  showPointer?: boolean
}

const stateStyles: Record<CellState, { bg: string; border: string; shadow: string }> = {
  default: {
    bg: colors.surfaceLight,
    border: colors.border,
    shadow: 'none',
  },
  active: {
    bg: `${colors.current}22`,
    border: colors.current,
    shadow: `0 0 24px ${colors.currentGlow}`,
  },
  visited: {
    bg: `${colors.visited}15`,
    border: `${colors.visited}66`,
    shadow: 'none',
  },
  target: {
    bg: `${colors.accent}15`,
    border: colors.accent,
    shadow: `0 0 20px ${colors.accentGlow}`,
  },
  comparing: {
    bg: `${colors.current}18`,
    border: colors.current,
    shadow: `0 0 16px ${colors.currentGlow}`,
  },
  swapping: {
    bg: `${colors.warning}22`,
    border: colors.warning,
    shadow: `0 0 20px ${colors.warningGlow}`,
  },
}

export function ArrayBar({
  value,
  index,
  state,
  showDirection = false,
  showCheckmark = false,
  showPointer = false,
}: ArrayBarProps) {
  const style = stateStyles[state]
  const isActive = state === 'active' || state === 'comparing'
  const valueColor = value >= 0 ? colors.positive : colors.negative

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className="text-[10px] font-mono"
        style={{ color: colors.textMuted }}
      >
        i={index}
      </span>
      <motion.div
        data-state={state}
        initial={false}
        animate={{
          scale: isActive ? 1.08 : 1,
          backgroundColor: style.bg,
          borderColor: style.border,
          boxShadow: style.shadow,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-[72px] h-[72px] rounded-xl border-2 flex flex-col items-center justify-center"
      >
        <span
          className="text-2xl font-bold font-mono"
          style={{ color: valueColor }}
        >
          {value > 0 ? `+${value}` : value}
        </span>
        {showDirection && (
          <span
            className="text-[9px] mt-0.5"
            style={{ color: colors.textMuted }}
          >
            {value >= 0 ? 'direita' : 'esquerda'}
          </span>
        )}
        {showPointer && (
          <div
            className="absolute -top-2 -right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: colors.current, color: colors.bg }}
          >
            ▸
          </div>
        )}
        {showCheckmark && (
          <div
            className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px]"
            style={{ background: colors.visited, color: '#fff' }}
          >
            ✓
          </div>
        )}
      </motion.div>
    </div>
  )
}
