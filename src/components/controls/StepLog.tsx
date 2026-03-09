'use client'

import { useRef, useEffect } from 'react'
import { colors } from '@/lib/colors'

export interface LogEntry {
  step: number
  description: string
  detail?: string
}

interface StepLogProps {
  entries: LogEntry[]
  currentStep: number
}

export function StepLog({ entries, currentStep }: StepLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentRef.current && containerRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [currentStep])

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: colors.surface, borderColor: colors.border }}
    >
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: colors.textMuted }}
      >
        Historico de Passos
      </span>
      <div
        ref={containerRef}
        className="mt-3 flex flex-col gap-1.5 max-h-[200px] overflow-y-auto"
      >
        {entries.map((entry, i) => {
          const isCurrent = i === currentStep
          return (
            <div
              key={i}
              ref={isCurrent ? currentRef : null}
              data-current={isCurrent}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all duration-300"
              style={{
                background: isCurrent ? `${colors.accent}11` : 'transparent',
                border: `1px solid ${isCurrent ? `${colors.accent}33` : 'transparent'}`,
                animation: isCurrent ? 'slideIn 0.3s ease' : 'none',
              }}
            >
              <span
                className="text-xs font-mono w-6"
                style={{ color: colors.textMuted }}
              >
                #{entry.step}
              </span>
              <span
                className="text-xs"
                style={{ color: isCurrent ? colors.accent : colors.text }}
              >
                {entry.description}
              </span>
              {entry.detail && (
                <span
                  className="text-xs ml-auto font-mono"
                  style={{ color: colors.textMuted }}
                >
                  {entry.detail}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
