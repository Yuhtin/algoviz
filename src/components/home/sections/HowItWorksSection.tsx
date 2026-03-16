'use client'

import { motion } from 'framer-motion'
import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

const steps = [
  {
    step: 'Escolha',
    text: 'Selecione um algoritmo ou comece uma trilha guiada',
  },
  {
    step: 'Execute',
    text: 'Rode a visualizacao e acompanhe cada mudanca nos dados',
  },
  {
    step: 'Entenda',
    text: 'Veja o codigo destacado enquanto a animacao roda',
  },
  {
    step: 'Pratique',
    text: 'Responda quizzes e ganhe XP conforme avanca',
  },
]

export function HowItWorksSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: colors.text }}
      >
        Como usar
      </h2>
      <p
        className="text-lg mb-12 max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Quatro passos entre voce e entender algoritmos de verdade
      </p>

      <div className="max-w-2xl mx-auto">
        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 mb-6 text-left"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: colors.accent, color: colors.bg }}
            >
              {index + 1}
            </div>
            <div className="pt-2">
              <span
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {item.step}
              </span>
              <span style={{ color: colors.textMuted }}> — {item.text}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </HomeSection>
  )
}
