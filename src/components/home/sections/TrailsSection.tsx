'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { getAllTrails } from '@/lib/trails'
import { colors } from '@/lib/colors'

export function TrailsSection() {
  const trails = getAllTrails()

  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl font-bold mb-12"
        style={{ color: colors.text }}
      >
        Siga sua
        <br />
        <span style={{ color: colors.warning }}>trilha</span>
      </h2>

      <div className="relative max-w-md mx-auto text-left">
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
                style={{
                  backgroundColor:
                    index === 0
                      ? colors.accent
                      : index === 1
                        ? colors.visited
                        : colors.warning,
                  color: colors.bg,
                }}
              >
                {index + 1}
              </div>

              <Link href={`/trilhas/${trail.slug}`}>
                <div
                  className="p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{
                      color:
                        index === 0
                          ? colors.accent
                          : index === 1
                            ? colors.visited
                            : colors.warning,
                    }}
                  >
                    {index === 0
                      ? 'Começar aqui'
                      : index === 1
                        ? 'Próximo passo'
                        : 'Avançado'}
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {trail.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    {trail.missions.length} missões • {trail.difficulty}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
