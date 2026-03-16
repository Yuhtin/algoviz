'use client'

import type { ExternalMission as ExternalMissionType } from '@/types/trail'
import { CompleteMissionButton } from './CompleteMissionButton'
import { colors } from '@/lib/colors'

interface Props {
  mission: ExternalMissionType
  isCompleted: boolean
  onComplete: () => void
}

export function ExternalMission({ mission, isCompleted, onComplete }: Props) {
  return (
    <div className="text-center py-12">
      <span className="text-6xl mb-6 block">🔗</span>

      <h2 className="text-xl font-medium mb-4" style={{ color: colors.text }}>
        {mission.description || 'Acesse o conteúdo externo'}
      </h2>

      <a
        href={mission.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 rounded-xl font-medium text-lg mb-8 transition-all hover:scale-105"
        style={{ backgroundColor: colors.accent, color: colors.bg }}
      >
        Abrir conteúdo ↗
      </a>

      <div className="max-w-md mx-auto p-4 rounded-xl mb-8" style={{ backgroundColor: colors.surface }}>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Após estudar o conteúdo, clique no botão abaixo para marcar como concluído.
        </p>
      </div>

      <CompleteMissionButton isCompleted={isCompleted} xp={mission.xp} onComplete={onComplete} />
    </div>
  )
}
