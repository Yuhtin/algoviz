'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { HighlightText } from '../HighlightText'
import { getAllTrails } from '@/lib/trails'
import { colors } from '@/lib/colors'

export function TrailsSection() {
  const trails = getAllTrails()

  const levelColors = [colors.accent, colors.visited, colors.warning]
  const levelLabels = ['Começar aqui', 'Próximo passo', 'Avançado']

  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl mb-12"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Siga sua
        <br />
        <HighlightText delay={0.3}>trilha</HighlightText>
      </h2>

      <div className="relative max-w-md mx-auto text-left">
        {/* Connecting line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, ${colors.accent}, ${colors.visited}, ${colors.warning})`,
          }}
        />

        <div className="space-y-8">
          {trails.slice(0, 3).map((trail, index) => (
            <motion.div
              key={trail.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-12"
            >
              <div
                className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: levelColors[index], color: colors.bg }}
              >
                {index + 1}
              </div>

              <Link href={`/trilhas/${trail.slug}`}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${levelColors[index]}22` }}
                  className="p-4 rounded-xl transition-shadow"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: levelColors[index] }}
                  >
                    {levelLabels[index]}
                  </div>
                  <h3
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
                  >
                    {trail.name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {trail.missions.length} missões • {trail.difficulty}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
