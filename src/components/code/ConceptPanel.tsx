'use client'
import { colors } from '@/lib/colors'
import type { CodeAnnotation } from '@/types/code'

interface ConceptPanelProps {
  annotations: CodeAnnotation[]
  activeConcept: string | null
  onConceptHover?: (conceptId: string | null) => void
}

export function ConceptPanel({ annotations, activeConcept, onConceptHover }: ConceptPanelProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold mb-4" style={{ color: colors.textMuted }}>Conceitos</h3>
      {annotations.map((annotation) => {
        const isActive = activeConcept === annotation.conceptId
        return (
          <div
            key={annotation.conceptId}
            data-active={isActive}
            className="p-3 rounded-lg transition-all cursor-pointer"
            style={{ background: isActive ? `${colors.accent}15` : colors.surface, border: `1px solid ${isActive ? colors.accent : colors.border}` }}
            onMouseEnter={() => onConceptHover?.(annotation.conceptId)}
            onMouseLeave={() => onConceptHover?.(null)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: `${colors.visited}20`, color: colors.visited }}>
                L{annotation.lineStart}{annotation.lineEnd !== annotation.lineStart ? `-${annotation.lineEnd}` : ''}
              </span>
              <span className="text-sm font-medium" style={{ color: isActive ? colors.accent : colors.text }}>{annotation.conceptLabel}</span>
            </div>
            <p className="text-xs" style={{ color: colors.textMuted }}>{annotation.explanation}</p>
          </div>
        )
      })}
    </div>
  )
}
