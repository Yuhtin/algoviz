'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllTrails } from '@/lib/trails'
import { useProgressStore } from '@/stores/progress-store'
import { colors } from '@/lib/colors'

export default function TrailsPage() {
  const trails = getAllTrails()
  const { getCompletedMissionsCount } = useProgressStore()

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Trilhas de Estudo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg mb-12"
          style={{ color: colors.textMuted }}
        >
          Escolha sua jornada e comece a aprender
        </motion.p>

        <div className="space-y-6">
          {trails.map((trail, index) => {
            const completedCount = getCompletedMissionsCount(trail.slug)
            const totalCount = trail.missions.length
            const progress = (completedCount / totalCount) * 100

            return (
              <motion.div
                key={trail.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/trilhas/${trail.slug}`}>
                  <div
                    className="p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{trail.icon}</span>
                        <div>
                          <h2
                            className="text-xl font-bold"
                            style={{ color: colors.text }}
                          >
                            {trail.name}
                          </h2>
                          <p
                            className="text-sm"
                            style={{ color: colors.textMuted }}
                          >
                            {trail.description}
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: `${colors.accent}20`,
                          color: colors.accent,
                        }}
                      >
                        {trail.difficulty}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex-1">
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: colors.border }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: colors.accent,
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: colors.textMuted }}
                      >
                        {completedCount}/{totalCount} missões
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {trail.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: colors.border,
                            color: colors.textMuted,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: colors.border,
                          color: colors.textMuted,
                        }}
                      >
                        ~{trail.estimatedHours}h
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
