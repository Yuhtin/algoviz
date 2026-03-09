'use client'

import { useState, useMemo } from 'react'
import { colors } from '@/lib/colors'
import type { CodeFile, CodeAnnotation } from '@/types/code'

interface CodeViewerProps {
  codeFile: CodeFile
  highlightedConcept?: string
  onConceptHover?: (conceptId: string | null) => void
}

export function CodeViewer({ codeFile, highlightedConcept, onConceptHover }: CodeViewerProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const lines = useMemo(() => codeFile.code.split('\n'), [codeFile.code])

  const getAnnotationForLine = (lineNumber: number): CodeAnnotation | undefined => {
    return codeFile.annotations.find(
      (a) => lineNumber >= a.lineStart && lineNumber <= a.lineEnd
    )
  }

  const isLineHighlighted = (lineNumber: number): boolean => {
    if (!highlightedConcept) return false
    const annotation = getAnnotationForLine(lineNumber)
    return annotation?.conceptId === highlightedConcept
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: colors.code }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: colors.border }}>
        <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: colors.surfaceLight, color: colors.textMuted }}>
          {codeFile.language}
        </span>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono" style={{ margin: 0 }}>
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const annotation = getAnnotationForLine(lineNumber)
            const isHighlighted = isLineHighlighted(lineNumber)
            const isHovered = hoveredLine !== null && annotation && hoveredLine >= annotation.lineStart && hoveredLine <= annotation.lineEnd

            return (
              <div
                key={lineNumber}
                className="flex transition-colors duration-150"
                style={{ background: isHighlighted || isHovered ? `${colors.accent}15` : 'transparent' }}
                onMouseEnter={() => { setHoveredLine(lineNumber); if (annotation) onConceptHover?.(annotation.conceptId) }}
                onMouseLeave={() => { setHoveredLine(null); onConceptHover?.(null) }}
              >
                <span className="select-none w-8 text-right pr-4 flex-shrink-0" style={{ color: colors.textMuted }}>{lineNumber}</span>
                <code style={{ color: colors.text }}>{line || ' '}</code>
                {annotation && lineNumber === annotation.lineStart && (
                  <span className="ml-4 text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ background: `${colors.visited}20`, color: colors.visited }}>
                    {annotation.conceptLabel}
                  </span>
                )}
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}
