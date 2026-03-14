'use client'

import { useState, useEffect, useRef } from 'react'
import { colors } from '@/lib/colors'
import type { CodeFile, CodeAnnotation } from '@/types/code'
import { getHighlightedCode } from '@/lib/actions/highlight'

interface HighlightedLine {
  lineNumber: number
  html: string
}

interface CodeViewerProps {
  codeFile: CodeFile
  highlightedConcept?: string
  onConceptHover?: (conceptId: string | null) => void
}

export function CodeViewer({ codeFile, highlightedConcept, onConceptHover }: CodeViewerProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [highlightedLines, setHighlightedLines] = useState<HighlightedLine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch highlighted code from server
  useEffect(() => {
    setIsLoading(true)
    getHighlightedCode(codeFile.code, codeFile.language)
      .then(setHighlightedLines)
      .finally(() => setIsLoading(false))
  }, [codeFile.code, codeFile.language])

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

  // Get the currently hovered annotation
  const hoveredAnnotation = hoveredLine ? getAnnotationForLine(hoveredLine) : null

  // Handle mouse leave with delay to allow moving to card
  const handleLineMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isCardHovered) {
        setHoveredLine(null)
        onConceptHover?.(null)
      }
    }, 100)
  }

  const handleLineMouseEnter = (lineNumber: number, annotation: CodeAnnotation | undefined) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setHoveredLine(lineNumber)
    if (annotation) onConceptHover?.(annotation.conceptId)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="rounded-xl overflow-hidden border relative" style={{ background: '#1e1e2e', borderColor: colors.border }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: colors.border, background: '#181825' }}
      >
        {/* Window dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span
          className="text-xs font-mono px-2 py-1 rounded ml-auto"
          style={{ background: colors.surfaceLight, color: colors.textMuted }}
        >
          {codeFile.language}
        </span>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto relative">
        <pre className="p-4 text-[13px] leading-6 font-mono" style={{ margin: 0 }}>
          <code>
            {(isLoading ? codeFile.code.split('\n').map((_, i) => ({ lineNumber: i + 1, html: '' })) : highlightedLines).map((line, index) => {
              const lineNumber = index + 1
              const annotation = getAnnotationForLine(lineNumber)
              const isHighlighted = isLineHighlighted(lineNumber)
              const isHovered = hoveredLine !== null && annotation && hoveredLine >= annotation.lineStart && hoveredLine <= annotation.lineEnd

              return (
                <div
                  key={lineNumber}
                  className="flex items-start transition-all duration-150 -mx-4 px-4 hover:bg-white/[0.03]"
                  style={{
                    background: isHighlighted || isHovered ? `${colors.accent}15` : 'transparent',
                    borderLeft: isHighlighted || isHovered ? `2px solid ${colors.accent}` : '2px solid transparent',
                  }}
                  onMouseEnter={() => handleLineMouseEnter(lineNumber, annotation)}
                  onMouseLeave={handleLineMouseLeave}
                >
                  {/* Line number */}
                  <span
                    className="select-none w-10 text-right pr-6 flex-shrink-0 tabular-nums"
                    style={{ color: isHighlighted || isHovered ? colors.accent : '#5c6370' }}
                  >
                    {lineNumber}
                  </span>

                  {/* Code content */}
                  {isLoading ? (
                    <span style={{ color: '#abb2bf' }}>{codeFile.code.split('\n')[index] || ' '}</span>
                  ) : (
                    <span
                      className="shiki-line flex-1"
                      dangerouslySetInnerHTML={{ __html: line.html }}
                    />
                  )}

                  {/* Badge fixo para conceitos */}
                  {annotation && lineNumber === annotation.lineStart && (
                    <span
                      className="ml-4 text-[11px] px-2 py-0.5 rounded flex-shrink-0 font-medium cursor-help"
                      style={{
                        background: isHighlighted || isHovered ? `${colors.accent}30` : `${colors.visited}20`,
                        color: isHighlighted || isHovered ? colors.accent : colors.visited,
                      }}
                    >
                      {annotation.conceptLabel}
                    </span>
                  )}
                </div>
              )
            })}
          </code>
        </pre>

        {/* Card de explicação no hover */}
        {(hoveredAnnotation || isCardHovered) && hoveredAnnotation && (
          <div
            className="absolute right-4 max-w-xs p-3 rounded-lg border shadow-xl z-10 animate-in fade-in slide-in-from-right-2 duration-200"
            style={{
              background: '#181825',
              borderColor: colors.accent,
              top: hoveredAnnotation.lineStart <= 3 ? 'auto' : '1rem',
              bottom: hoveredAnnotation.lineStart <= 3 ? '1rem' : 'auto',
            }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => {
              setIsCardHovered(false)
              setHoveredLine(null)
              onConceptHover?.(null)
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ background: `${colors.accent}30`, color: colors.accent }}
              >
                {hoveredAnnotation.conceptLabel}
              </span>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                L{hoveredAnnotation.lineStart}
                {hoveredAnnotation.lineEnd !== hoveredAnnotation.lineStart && `-${hoveredAnnotation.lineEnd}`}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
              {hoveredAnnotation.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
