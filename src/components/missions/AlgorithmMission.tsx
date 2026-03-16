'use client'

import Link from 'next/link'
import type { AlgorithmMission as AlgorithmMissionType } from '@/types/trail'
import { CompleteMissionButton } from './CompleteMissionButton'
import { colors } from '@/lib/colors'

interface Props {
  mission: AlgorithmMissionType
  isCompleted: boolean
  onComplete: () => void
}

export function AlgorithmMission({ mission, isCompleted, onComplete }: Props) {
  return (
    <div className="text-center py-12">
      <span className="text-6xl mb-6 block">⚡</span>

      <h2 className="text-xl font-medium mb-4" style={{ color: colors.text }}>
        Estude o algoritmo e veja a visualização
      </h2>

      <Link
        href={`/algoritmos/${mission.algorithmRef}`}
        className="inline-block px-8 py-4 rounded-xl font-medium text-lg mb-8 transition-all hover:scale-105"
        style={{ backgroundColor: colors.accent, color: colors.bg }}
      >
        Ver Algoritmo: {mission.algorithmRef}
      </Link>

      <div className="max-w-md mx-auto p-4 rounded-xl mb-8" style={{ backgroundColor: colors.surface }}>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Explore a visualização do algoritmo e entenda como ele funciona passo a passo.
        </p>
      </div>

      <CompleteMissionButton isCompleted={isCompleted} xp={mission.xp} onComplete={onComplete} />
    </div>
  )
}
