'use client'

import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

export function VisualizationSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl font-bold mb-6"
        style={{ color: colors.text }}
      >
        Veja cada passo
        <br />
        <span style={{ color: colors.visited }}>acontecer</span>
      </h2>

      <p
        className="text-lg md:text-xl max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Algoritmos ganham vida. Acompanhe a execução em tempo real.
      </p>
    </HomeSection>
  )
}
