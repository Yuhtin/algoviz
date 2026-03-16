'use client'

import { motion } from 'framer-motion'
import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

const features = [
  {
    title: 'Passo a passo',
    description: 'Cada operacao acontece na sua frente. Sem magica, sem abstrações escondidas.',
  },
  {
    title: 'Aprenda no seu ritmo',
    description: 'Pause, volte, repita. O controle e seu.',
  },
  {
    title: 'Do basico ao avancado',
    description: 'Comece com ordenacao simples. Termine com grafos e programacao dinamica.',
  },
]

export function FeaturesSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl font-bold mb-16"
        style={{ color: colors.text }}
      >
        Por que funciona
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
            className="text-left p-6 rounded-2xl"
            style={{ backgroundColor: colors.surface }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold mb-4"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              {index + 1}
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: colors.text }}
            >
              {feature.title}
            </h3>
            <p style={{ color: colors.textMuted }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </HomeSection>
  )
}
