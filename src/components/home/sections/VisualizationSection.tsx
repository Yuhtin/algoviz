'use client'

import { HomeSection } from '../HomeSection'
import { HighlightText } from '../HighlightText'
import { colors } from '@/lib/colors'

export function VisualizationSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl mb-6"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Veja cada passo
        <br />
        <HighlightText delay={0.3}>acontecer</HighlightText>
      </h2>

      <p
        className="text-lg md:text-xl max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Acompanhe cada troca, cada comparacao. Sem cortes, sem pulos.
      </p>
    </HomeSection>
  )
}
