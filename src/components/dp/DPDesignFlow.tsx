'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '@/lib/colors'

export interface DPStage {
  id: 'state' | 'base' | 'recurrence' | 'order' | 'reconstruction'
  title: string
  /** Pergunta-guia que o programador deve se fazer nessa etapa */
  question: string
  /** Resposta aplicada ao algoritmo, em parágrafos curtos */
  answer: ReactNode
  /** Fórmula ou expressão central destacada (opcional) */
  formula?: string
  /** Linha(s) de código que essa etapa vira na implementação */
  codeSnippet?: string
  /** Linguagem do código snippet, default 'python' */
  codeLanguage?: 'python' | 'rust'
  /** Mini-diagrama inline (opcional) */
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
          <h3
            className="text-lg font-bold"
            style={{ color: colors.text }}
          >
            Como pensar em {algorithmName} como DP
          </h3>
        </div>
        <span
          className="text-xs font-mono"
          style={{ color: colors.textMuted }}
        >
          etapa {active + 1} / {stages.length}
        </span>
      </div>

      {/* Stepper */}
      <div
        className="px-6 py-4 flex items-center gap-2 overflow-x-auto"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        {stages.map((s, idx) => {
          const m = STAGE_META[s.id]
          const isActive = idx === active
          const isPassed = idx < active
          return (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActive(idx)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
                style={{
                  borderColor: isActive ? m.color : colors.border,
                  background: isActive
                    ? `${m.color}15`
                    : isPassed
                    ? `${colors.accent}08`
                    : 'transparent',
                  color: isActive ? m.color : isPassed ? colors.text : colors.textMuted,
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono"
                  style={{
                    background: isActive ? m.color : isPassed ? colors.accent : colors.border,
                    color: isActive || isPassed ? '#0a1210' : colors.textMuted,
                  }}
                >
                  {m.number}
                </span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {s.title}
                </span>
              </button>
              {idx < stages.length - 1 && (
                <span style={{ color: colors.border }}>→</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Stage content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="px-6 md:px-8 py-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            {/* LEFT: explanation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl"
                  style={{ color: meta.color }}
                >
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
                className="rounded-lg px-4 py-3"
                style={{
                  background: `${meta.color}10`,
                  border: `1px solid ${meta.color}33`,
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Pergunta-guia
                </div>
                <div
                  className="text-sm italic"
                  style={{ color: colors.text }}
                >
                  &ldquo;{stage.question}&rdquo;
                </div>
              </div>

              <div
                className="text-sm leading-relaxed"
                style={{ color: colors.text }}
              >
                {stage.answer}
              </div>

              {stage.formula && (
                <div
                  className="rounded-lg px-4 py-3 font-mono text-sm"
                  style={{
                    background: colors.code,
                    border: `1px solid ${meta.color}55`,
                    color: meta.color,
                  }}
                >
                  {stage.formula}
                </div>
              )}

              {stage.diagram && (
                <div className="pt-2">{stage.diagram}</div>
              )}
            </div>

            {/* RIGHT: code translation */}
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
          </div>

          <div
            className="flex items-center justify-between mt-6 pt-4"
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
            <span className="flex items-center gap-1">
              {stages.map((_, idx) => (
                <span
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      idx === active
                        ? meta.color
                        : idx < active
                        ? colors.accent
                        : colors.border,
                  }}
                />
              ))}
            </span>
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
              {active < stages.length - 1 ? stages[active + 1].title : 'fim'} →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
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
              {displayLine || ' '}
            </span>
          </div>
        )
      })}
    </div>
  )
}
