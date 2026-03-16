'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTrailProgress } from '@/hooks/useTrailProgress'
import { Navbar } from '@/components/layout/Navbar'
import { colors } from '@/lib/colors'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const missionTypeLabels: Record<string, string> = {
  lesson: 'Aula',
  algorithm: 'Algoritmo',
  external: 'Externo',
  quiz: 'Quiz',
}

export default function TrailPage({ params }: Props) {
  const { slug } = use(params)
  const {
    trail,
    missionStatuses,
    completedCount,
    totalCount,
    progressPercentage,
    startTrail,
  } = useTrailProgress(slug)

  if (!trail) {
    notFound()
  }

  // Start trail on first visit
  if (completedCount === 0) {
    startTrail()
  }

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-4"
      style={{ backgroundColor: colors.bg }}
    >
      <Navbar />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/trilhas"
            className="text-sm mb-4 inline-block hover:underline"
            style={{ color: colors.accent }}
          >
            ← Voltar às trilhas
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              {trail.name.charAt(0)}
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: colors.text }}
              >
                {trail.name}
              </h1>
              <p style={{ color: colors.textMuted }}>
                {trail.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1">
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <span style={{ color: colors.text }}>
              {completedCount}/{totalCount}
            </span>
          </div>
        </motion.div>

        {/* Mission Roadmap */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-0 bottom-0 w-0.5"
            style={{
              background: `linear-gradient(to bottom, ${colors.accent}, ${colors.visited}, ${colors.border})`,
            }}
          />

          <div className="space-y-6">
            {missionStatuses.map(({ mission, isUnlocked, isCompleted }, index) => (
              <motion.div
                key={mission.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-12"
              >
                {/* Node */}
                <div
                  className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold"
                  style={{
                    backgroundColor: isCompleted
                      ? colors.accent
                      : isUnlocked
                        ? colors.surface
                        : colors.bg,
                    borderColor: isCompleted
                      ? colors.accent
                      : isUnlocked
                        ? colors.accent
                        : colors.border,
                    color: isCompleted
                      ? colors.bg
                      : isUnlocked
                        ? colors.accent
                        : colors.border,
                  }}
                >
                  {isCompleted ? (
                    <span>OK</span>
                  ) : isUnlocked ? (
                    <span>{index + 1}</span>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3z"/>
                    </svg>
                  )}
                </div>

                {/* Card */}
                {isUnlocked ? (
                  <Link href={`/trilhas/${slug}/${mission.slug}`}>
                    <div
                      className="p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: isCompleted ? colors.accent : colors.border,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: `${colors.accent}20`,
                                color: colors.accent,
                              }}
                            >
                              {mission.type}
                            </span>
                            {isCompleted && (
                              <span
                                className="text-xs"
                                style={{ color: colors.accent }}
                              >
                                Completo
                              </span>
                            )}
                          </div>
                          <h3
                            className="text-lg font-medium mt-1"
                            style={{ color: colors.text }}
                          >
                            {mission.name}
                          </h3>
                          {mission.description && (
                            <p
                              className="text-sm mt-1"
                              style={{ color: colors.textMuted }}
                            >
                              {mission.description}
                            </p>
                          )}
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.accent }}
                        >
                          +{mission.xp} XP
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className="p-4 rounded-xl border opacity-50"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <h3
                      className="text-lg font-medium"
                      style={{ color: colors.textMuted }}
                    >
                      {mission.name}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: colors.border }}
                    >
                      Complete a missão anterior para desbloquear
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
