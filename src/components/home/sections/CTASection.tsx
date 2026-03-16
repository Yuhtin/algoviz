'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { useProgressStore } from '@/stores/progress-store'
import { colors } from '@/lib/colors'

export function CTASection() {
  const { xp, level } = useProgressStore()
  const hasProgress = xp > 0

  return (
    <HomeSection height="50vh">
      <h2
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ color: colors.text }}
      >
        {hasProgress ? 'Continue sua jornada' : 'Comece agora'}
      </h2>

      {hasProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mb-8 inline-flex items-center gap-4 px-6 py-3 rounded-full"
          style={{ backgroundColor: colors.surface }}
        >
          <span style={{ color: colors.accent }}>Level {level}</span>
          <span style={{ color: colors.textMuted }}>•</span>
          <span style={{ color: colors.text }}>{xp} XP</span>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/trilhas">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-medium text-lg"
            style={{ backgroundColor: colors.accent, color: colors.bg }}
          >
            {hasProgress ? 'Continuar' : 'Começar'} →
          </motion.button>
        </Link>

        <Link href="/algoritmos">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-medium text-lg border"
            style={{ backgroundColor: 'transparent', color: colors.text, borderColor: colors.border }}
          >
            Explorar algoritmos
          </motion.button>
        </Link>
      </div>
    </HomeSection>
  )
}
