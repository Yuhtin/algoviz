'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '@/lib/colors'

export interface DPStage {
  id: 'state' | 'base' | 'recurrence' | 'order' | 'reconstruction'
  title: string
  question: string
  answer: ReactNode
  formula?: string
  codeSnippet?: string
  codeLanguage?: 'python' | 'rust'
  diagram?: ReactNode
}

const STAGE_META: Record<
  DPStage['id'],
  { number: number; icon: string; label: string; color: string }
> = {
  state: { number: 1, icon: '◇', label: 'Estado', color: '#7BD3F7' },
  base: { number: 2, icon: '○', label: 'Caso Base', color: '#FFD93D' },
  recurrence: { number: 3, icon: '⇲', label: 'Recorrência', color: '#FF9F8B' },
  order: { number: 4, icon: '→', label: 'Ordem', color: '#B0E57C' },
  reconstruction: { number: 5, icon: '⟲', label: 'Reconstrução', color: '#00d4aa' },
}

interface DPDesignFlowProps {
  algorithmName: string
  stages: DPStage[]
}

export function DPDesignFlow({ algorithmName, stages }: DPDesignFlowProps) {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const meta = STAGE_META[stage.id]

  const goPrev = () => setActive((s) => Math.max(0, s - 1))
  const goNext = () => setActive((s) => Math.min(stages.length - 1, s + 1))

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: colors.surface, borderColor: colors.border }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between flex-wrap gap-2"
        style={{ borderColor: colors.border }}
      >
        <div className="flex flex-col">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            Pensamento DP
          </span>
          <h3 className="text-lg font-bold" style={{ color: colors.text }}>
            Como pensar em {algorithmName} como DP
          </h3>
        </div>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
          etapa {active + 1} / {stages.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        {/* LEFT: vertical sidebar with stepper */}
        <nav
          className="px-3 py-4 flex flex-col gap-1"
          style={{
            background: colors.surfaceLight,
            borderRight: `1px solid ${colors.border}`,
          }}
          aria-label="Etapas do pensamento DP"
        >
          {stages.map((s, idx) => {
            const m = STAGE_META[s.id]
            const isActive = idx === active
            const isPassed = idx < active
            return (
              <button
                key={s.id}
                onClick={() => setActive(idx)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                style={{
                  background: isActive ? `${m.color}15` : 'transparent',
                  border: isActive
                    ? `1px solid ${m.color}55`
                    : `1px solid transparent`,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0"
                  style={{
                    background: isActive
                      ? m.color
                      : isPassed
                      ? colors.accent
                      : colors.border,
                    color: isActive || isPassed ? '#0a1210' : colors.textMuted,
                  }}
                >
                  {isPassed ? '✓' : m.number}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{
                      color: isActive ? m.color : colors.textMuted,
                    }}
                  >
                    Etapa {m.number}
                  </span>
                  <span
                    className="text-xs font-semibold truncate"
                    style={{
                      color: isActive
                        ? m.color
                        : isPassed
                        ? colors.text
                        : colors.textMuted,
                    }}
                  >
                    {s.title}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>

        {/* RIGHT: stage content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="px-6 md:px-8 py-6 space-y-5 min-w-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl" style={{ color: meta.color }}>
                {meta.icon}
              </span>
              <h4
                className="text-base font-bold"
                style={{ color: meta.color }}
              >
                {stage.title}
              </h4>
            </div>

            <div
              className="rounded-lg px-4 py-3 flex items-start gap-3 flex-wrap"
              style={{
                background: `${meta.color}10`,
                border: `1px solid ${meta.color}33`,
              }}
            >
              <span
                className="text-[10px] uppercase tracking-widest font-mono mt-0.5 flex-shrink-0"
                style={{ color: meta.color }}
              >
                Pergunta-guia
              </span>
              <span
                className="text-sm italic flex-1 min-w-[200px]"
                style={{ color: colors.text }}
              >
                &ldquo;{stage.question}&rdquo;
              </span>
            </div>

            <div
              className="text-sm leading-relaxed"
              style={{ color: colors.text }}
            >
              {stage.answer}
            </div>

            {stage.formula && (
              <div
                className="rounded-lg px-4 py-3 font-mono text-sm break-words"
                style={{
                  background: colors.code,
                  border: `1px solid ${meta.color}55`,
                  color: meta.color,
                }}
              >
                {stage.formula}
              </div>
            )}

            {stage.diagram && <div className="pt-1">{stage.diagram}</div>}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: colors.textMuted }}
                >
                  Vira em código
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: colors.surfaceLight,
                    color: colors.textMuted,
                  }}
                >
                  {stage.codeLanguage ?? 'python'}
                </span>
              </div>
              <div
                className="rounded-lg p-4 font-mono text-xs leading-6 whitespace-pre overflow-x-auto"
                style={{
                  background: colors.code,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                {stage.codeSnippet ? (
                  <CodeBlock code={stage.codeSnippet} highlight={meta.color} />
                ) : (
                  <span style={{ color: colors.textMuted }}>—</span>
                )}
              </div>
            </div>

            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <button
                onClick={goPrev}
                disabled={active === 0}
                className="text-xs px-3 py-1.5 rounded-md border disabled:opacity-30 transition-all"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  background: 'transparent',
                }}
              >
                ← {active > 0 ? stages[active - 1].title : ''}
              </button>
              <button
                onClick={goNext}
                disabled={active === stages.length - 1}
                className="text-xs px-3 py-1.5 rounded-md border disabled:opacity-30 transition-all"
                style={{
                  borderColor: meta.color,
                  background: `${meta.color}15`,
                  color: meta.color,
                }}
              >
                {active < stages.length - 1
                  ? stages[active + 1].title
                  : 'fim'}{' '}
                →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function CodeBlock({ code, highlight }: { code: string; highlight: string }) {
  const lines = code.split('\n')
  return (
    <div>
      {lines.map((line, i) => {
        const isHighlight = line.startsWith('▶')
        const displayLine = isHighlight ? line.slice(1).trimStart() : line
        return (
          <div
            key={i}
            className="flex items-start gap-3"
            style={{
              background: isHighlight ? `${highlight}11` : 'transparent',
              borderLeft: isHighlight
                ? `2px solid ${highlight}`
                : '2px solid transparent',
              paddingLeft: 8,
              marginLeft: -8,
            }}
          >
            <span
              className="select-none w-5 text-right flex-shrink-0"
              style={{ color: colors.textMuted }}
            >
              {i + 1}
            </span>
            <span
              style={{
                color: isHighlight ? highlight : colors.text,
                fontWeight: isHighlight ? 600 : 400,
              }}
            >
              {displayLine || ' '}
            </span>
          </div>
        )
      })}
    </div>
  )
}
