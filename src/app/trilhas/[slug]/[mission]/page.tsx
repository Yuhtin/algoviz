'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMission, getTrailBySlug, getNextMission } from '@/lib/trails'
import { useTrailProgress } from '@/hooks/useTrailProgress'
import { LessonMission } from '@/components/missions/LessonMission'
import { QuizMission } from '@/components/missions/QuizMission'
import { ExternalMission } from '@/components/missions/ExternalMission'
import { AlgorithmMission } from '@/components/missions/AlgorithmMission'
import { Navbar } from '@/components/layout/Navbar'
import { colors } from '@/lib/colors'

interface Props {
  params: Promise<{ slug: string; mission: string }>
}

export default function MissionPage({ params }: Props) {
  const { slug, mission: missionSlug } = use(params)
  const trail = getTrailBySlug(slug)
  const mission = getMission(slug, missionSlug)
  const { missionStatuses, completeMission, saveQuizResult } = useTrailProgress(slug)

  if (!trail || !mission) {
    notFound()
  }

  const status = missionStatuses.find((s) => s.mission.slug === missionSlug)
  const isCompleted = status?.isCompleted ?? false
  const isUnlocked = status?.isUnlocked ?? false
  const nextMission = getNextMission(trail, missionSlug)

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <Navbar />
        <div className="text-center">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.surface, border: `2px solid ${colors.border}` }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill={colors.border}>
              <path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Conteudo bloqueado</h1>
          <p style={{ color: colors.textMuted }}>Complete as etapas anteriores primeiro.</p>
          <Link
            href={`/trilhas/${slug}`}
            className="mt-4 inline-block px-6 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: colors.bg }}
          >
            Voltar a trilha
          </Link>
        </div>
      </div>
    )
  }

  const handleComplete = () => {
    completeMission(missionSlug, mission.xp)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ backgroundColor: colors.bg }}>
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href={`/trilhas/${slug}`} className="text-sm mb-4 inline-block hover:underline" style={{ color: colors.accent }}>
            ← {trail.name}
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
              {mission.type}
            </span>
            <span className="text-xs" style={{ color: colors.textMuted }}>+{mission.xp} XP</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>{mission.name}</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {mission.type === 'lesson' && (
            <LessonMission mission={mission} isCompleted={isCompleted} onComplete={handleComplete} />
          )}
          {mission.type === 'quiz' && (
            <QuizMission
              mission={mission}
              isCompleted={isCompleted}
              onComplete={(result) => {
                saveQuizResult(missionSlug, result)
                completeMission(missionSlug, result.xpEarned)
              }}
            />
          )}
          {mission.type === 'external' && (
            <ExternalMission
              mission={mission}
              isCompleted={isCompleted}
              onComplete={handleComplete}
            />
          )}
          {mission.type === 'algorithm' && (
            <AlgorithmMission
              mission={mission}
              isCompleted={isCompleted}
              onComplete={handleComplete}
            />
          )}
        </motion.div>

        {isCompleted && nextMission && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
            <Link
              href={`/trilhas/${slug}/${nextMission.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
              style={{ backgroundColor: colors.surface, color: colors.accent, border: `1px solid ${colors.accent}` }}
            >
              Próxima missão: {nextMission.name} →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
