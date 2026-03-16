'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMission, getTrailBySlug, getNextMission } from '@/lib/trails'
import { useTrailProgress } from '@/hooks/useTrailProgress'
import { LessonMission } from '@/components/missions/LessonMission'
import { colors } from '@/lib/colors'

interface Props {
  params: Promise<{ slug: string; mission: string }>
}

export default function MissionPage({ params }: Props) {
  const { slug, mission: missionSlug } = use(params)
  const trail = getTrailBySlug(slug)
  const mission = getMission(slug, missionSlug)
  const { missionStatuses, completeMission } = useTrailProgress(slug)

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
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Missão Bloqueada</h1>
          <p style={{ color: colors.textMuted }}>Complete as missões anteriores para desbloquear.</p>
          <Link
            href={`/trilhas/${slug}`}
            className="mt-4 inline-block px-6 py-2 rounded-lg"
            style={{ backgroundColor: colors.accent, color: colors.bg }}
          >
            Voltar à trilha
          </Link>
        </div>
      </div>
    )
  }

  const handleComplete = () => {
    completeMission(missionSlug, mission.xp)
  }

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.bg }}>
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
