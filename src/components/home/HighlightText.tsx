'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { colors } from '@/lib/colors'

interface Props {
  children: ReactNode
  delay?: number
  duration?: number
}

export function HighlightText({ children, delay = 0.5, duration = 0.8 }: Props) {
  return (
    <span className="relative inline-block">
      <motion.span
        className="absolute inset-0 -inset-x-2"
        style={{ backgroundColor: colors.accentGlow }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration, ease: 'easeOut' }}
      />
      <span className="relative">{children}</span>
    </span>
  )
}
