// src/hooks/useTrailProgress.ts
import { useMemo } from 'react'
import { useProgressStore } from '@/stores/progress-store'
import { getTrailBySlug } from '@/lib/trails'
import type { Trail, Mission } from '@/types/trail'

export interface MissionStatus {
  mission: Mission
  isUnlocked: boolean
  isCompleted: boolean
  index: number
}

export function useTrailProgress(trailSlug: string) {
  const {
    trails,
    startTrail,
    completeMission,
    saveQuizResult,
    isMissionCompleted,
    getCompletedMissionsCount,
  } = useProgressStore()

  const trail = getTrailBySlug(trailSlug)
  const trailProgress = trails[trailSlug]

  const missionStatuses = useMemo((): MissionStatus[] => {
    if (!trail) return []

    return trail.missions.map((mission, index) => {
      const isCompleted = isMissionCompleted(trailSlug, mission.slug)
      // First mission is always unlocked, others need previous to be completed
      const isUnlocked =
        index === 0 || isMissionCompleted(trailSlug, trail.missions[index - 1].slug)

      return {
        mission,
        isUnlocked,
        isCompleted,
        index,
      }
    })
  }, [trail, trailSlug, trailProgress, isMissionCompleted])

  const completedCount = getCompletedMissionsCount(trailSlug)
  const totalCount = trail?.missions.length ?? 0
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const isTrailCompleted = completedCount === totalCount && totalCount > 0

  return {
    trail,
    trailProgress,
    missionStatuses,
    completedCount,
    totalCount,
    progressPercentage,
    isTrailCompleted,
    startTrail: () => startTrail(trailSlug),
    completeMission: (missionSlug: string, xp: number) =>
      completeMission(trailSlug, missionSlug, xp),
    saveQuizResult: (missionSlug: string, result: Parameters<typeof saveQuizResult>[2]) =>
      saveQuizResult(trailSlug, missionSlug, result),
  }
}
