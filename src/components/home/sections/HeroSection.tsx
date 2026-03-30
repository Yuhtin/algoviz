'use client'

import { motion } from 'framer-motion'
import { FloatingIcons } from '../FloatingIcons'
import { HighlightText } from '../HighlightText'
import { colors } from '@/lib/colors'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating icons - positioned relative to full section */}
      <FloatingIcons count={32} className="z-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl mb-6"
          style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Entenda algoritmos
          <br />
          <HighlightText delay={1} duration={0.8}>
            de verdade
          </HighlightText>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-8"
          style={{ color: colors.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Pare de decorar. Comece a ver.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span style={{ color: colors.textMuted }} className="text-sm">
            Role para explorar
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: colors.accent }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
