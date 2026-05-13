'use client'

import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { DPDesignFlow } from '@/components/dp/DPDesignFlow'
import { config, type CoinChangeData } from './config'
import { computeSteps } from './engine'
import { coinChangeStages } from './stages'

const coinPalette = [
  { fill: '#FFD93D', ring: '#D4AF37' },
  { fill: '#C0C0C0', ring: '#8a8a8a' },
  { fill: '#CD7F32', ring: '#8b5a25' },
  { fill: '#7BD3F7', ring: '#3a8db2' },
  { fill: '#FF9F8B', ring: '#a85a4b' },
  { fill: '#B0E57C', ring: '#5e9b3a' },
]

function colorForCoin(coin: number, coins: number[]) {
  const idx = coins.indexOf(coin)
  return coinPalette[idx >= 0 ? idx % coinPalette.length : 0]
}

function Coin({
  value,
  size = 40,
  palette,
  pulse = false,
}: {
  value: number
  size?: number
  palette: { fill: string; ring: string }
  pulse?: boolean
}) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={pulse ? { duration: 0.7, repeat: Infinity } : { duration: 0.2 }}
      className="rounded-full flex items-center justify-center font-bold font-mono shadow-md"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${palette.fill}, ${palette.ring})`,
        border: `2px solid ${palette.ring}`,
        color: '#1a1a1a',
        fontSize: size * 0.4,
        textShadow: '0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      {value}
    </motion.div>
  )
}

interface CellRect {
  x: number
  y: number
  w: number
  h: number
}

export function CoinChangeVisualizer() {
  const [data, setData] = useState<CoinChangeData>(config.presets[0].data)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1100)

  const { steps } = useMemo(() => computeSteps(data), [data])
  const totalSteps = steps.length
  const step = steps[Math.min(currentStep, totalSteps - 1)]
  const isFinished = currentStep >= totalSteps - 1

  useEffect(() => {
    if (!isPlaying || isFinished) return
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, isFinished, speed])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const handlePresetSelect = useCallback(
    (newData: CoinChangeData) => {
      setData(newData)
      reset()
    },
    [reset]
  )

  const handlePlayPause = useCallback(() => {
    if (isFinished) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }, [isFinished, isPlaying])

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
  }))

  const { coins, amount } = data

  const sourceJ = step.sourceJ
  const targetJ = step.targetJ
  const inBacktrack =
    step.type === 'backtrack-start' || step.type === 'backtrack-pop' || step.type === 'done'

  const backtrackPath = useMemo(() => {
    const path: number[] = []
    if (!inBacktrack) return path
    let j = amount
    for (const c of step.result) {
      path.push(j)
      j -= c
    }
    path.push(0)
    return path
  }, [inBacktrack, amount, step.result])

  // Refs for arrow drawing
  const containerRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Array<HTMLDivElement | null>>([])
  const [arrow, setArrow] = useState<{ from: CellRect; to: CellRect } | null>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    if (sourceJ === null || targetJ === null || step.type !== 'try-coin') {
      setArrow(null)
      return
    }
    const containerRect = containerRef.current.getBoundingClientRect()
    const srcEl = cellRefs.current[sourceJ]
    const tgtEl = cellRefs.current[targetJ]
    if (!srcEl || !tgtEl) {
      setArrow(null)
      return
    }
    const srcRect = srcEl.getBoundingClientRect()
    const tgtRect = tgtEl.getBoundingClientRect()
    setArrow({
      from: {
        x: srcRect.left - containerRect.left + srcRect.width / 2,
        y: srcRect.top - containerRect.top,
        w: srcRect.width,
        h: srcRect.height,
      },
      to: {
        x: tgtRect.left - containerRect.left + tgtRect.width / 2,
        y: tgtRect.top - containerRect.top,
        w: tgtRect.width,
        h: tgtRect.height,
      },
    })
  }, [currentStep, sourceJ, targetJ, step.type])

  const arrowColor =
    step.outcome === 'updated'
      ? colors.accent
      : step.outcome === 'kept'
      ? colors.textMuted
      : colors.warning

  return (
    <div className="space-y-6">
      <DPDesignFlow algorithmName="Coin Change" stages={coinChangeStages} />

      <Presets
        options={config.presets}
        selected={data}
        onSelect={handlePresetSelect}
      />

      <div
        className="rounded-2xl border p-6 md:p-8 space-y-8"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: colors.textMuted }}
            >
              Moedas
            </span>
            <div className="flex gap-2">
              {coins.map((c) => {
                const palette = colorForCoin(c, coins)
                const active = step.coin === c && !inBacktrack
                return (
                  <motion.div
                    key={c}
                    animate={{
                      y: active ? -4 : 0,
                      filter: active ? 'brightness(1.15)' : 'brightness(1)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Coin value={c} size={44} palette={palette} pulse={active} />
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: colors.textMuted }}
            >
              Alvo
            </span>
            <div
              className="px-4 py-1.5 rounded-lg font-mono font-bold"
              style={{
                background: `${colors.accent}15`,
                border: `1px solid ${colors.accent}66`,
                color: colors.accent,
                fontSize: 22,
              }}
            >
              {amount}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: colors.textMuted }}>
              Passo
            </span>
            <span className="text-xs font-mono" style={{ color: colors.text }}>
              {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
            </span>
          </div>
        </div>

        <div ref={containerRef} className="relative">
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
            Tabela dp[j]
          </div>

          <div className="flex gap-1.5 flex-wrap relative">
            {step.dp.map((val, j) => {
              const isTarget = j === targetJ
              const isSource = j === sourceJ
              const isInBacktrackPath = backtrackPath.includes(j)
              const isBacktrackHead = step.backtrackJ === j && inBacktrack
              const isUnknown = val === null
              const isCellDone = step.type === 'cell-done' && j === targetJ
              const isJustUpdated =
                step.type === 'try-coin' && j === targetJ && step.outcome === 'updated'

              let borderColor: string = colors.border
              let bgColor: string = colors.surfaceLight
              let textColor: string = isUnknown ? colors.textMuted : colors.text

              if (isInBacktrackPath) {
                borderColor = colors.accent
                bgColor = `${colors.accent}22`
                textColor = colors.accent
              }
              if (isBacktrackHead) {
                borderColor = colors.current
                bgColor = `${colors.current}33`
                textColor = colors.current
              }
              if (isSource && !inBacktrack) {
                borderColor = colors.visited
                bgColor = `${colors.visited}22`
                textColor = colors.visited
              }
              if (isTarget && !inBacktrack) {
                borderColor = colors.current
                bgColor = `${colors.current}22`
                textColor = colors.current
              }
              if (isJustUpdated) {
                borderColor = colors.accent
                bgColor = `${colors.accent}33`
                textColor = colors.accent
              }
              if (isCellDone) {
                borderColor = `${colors.accent}66`
                bgColor = `${colors.accent}11`
              }

              const choiceCoin = step.choice[j]
              const choicePalette =
                choiceCoin !== null ? colorForCoin(choiceCoin, coins) : null

              return (
                <div key={j} className="flex flex-col items-center gap-1">
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: colors.textMuted }}
                  >
                    {j}
                  </span>
                  <motion.div
                    ref={(el: HTMLDivElement | null) => {
                      cellRefs.current[j] = el
                    }}
                    animate={{
                      backgroundColor: bgColor,
                      borderColor,
                      scale: isJustUpdated || isBacktrackHead ? [1, 1.22, 1] : 1,
                      boxShadow: isJustUpdated
                        ? `0 0 22px ${colors.accent}66`
                        : 'none',
                    }}
                    transition={{ duration: 0.45 }}
                    className="rounded-lg border-2 flex items-center justify-center font-mono font-bold"
                    style={{
                      width: 56,
                      height: 56,
                      color: textColor,
                      fontSize: 18,
                    }}
                  >
                    {isUnknown ? '∞' : val}
                  </motion.div>
                  <div className="h-5 mt-0.5 flex items-center justify-center">
                    <AnimatePresence>
                      {choicePalette && (
                        <motion.div
                          key={`${j}-${choiceCoin}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <Coin
                            value={choiceCoin!}
                            size={18}
                            palette={choicePalette}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}

            {/* SVG arrow overlay */}
            <AnimatePresence>
              {arrow && (
                <motion.svg
                  key={`arrow-${currentStep}`}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${currentStep}`}
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L0,6 L6,3 z" fill={arrowColor} />
                    </marker>
                  </defs>
                  <motion.path
                    d={`M ${arrow.from.x} ${arrow.from.y} Q ${(arrow.from.x + arrow.to.x) / 2} ${arrow.from.y - 38}, ${arrow.to.x} ${arrow.to.y}`}
                    fill="none"
                    stroke={arrowColor}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    markerEnd={`url(#arrowhead-${currentStep})`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Formula / current decision */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border p-4 min-h-[58px]"
            style={{ background: colors.code, borderColor: colors.border }}
          >
            {step.type === 'try-coin' &&
              targetJ !== null &&
              step.coin !== null &&
              (step.outcome === 'updated' || step.outcome === 'kept') && (
                <div className="flex items-center gap-3 flex-wrap font-mono text-sm">
                  <span style={{ color: colors.textMuted }}>candidato:</span>
                  <span style={{ color: colors.current }}>dp[{targetJ}]</span>
                  <span style={{ color: colors.textMuted }}>= dp[</span>
                  <span style={{ color: colors.visited }}>{step.sourceJ}</span>
                  <span style={{ color: colors.textMuted }}>] + 1 com</span>
                  <Coin value={step.coin} size={22} palette={colorForCoin(step.coin, coins)} />
                  <span style={{ color: colors.textMuted }}>=</span>
                  <span
                    className="px-2 py-0.5 rounded font-bold"
                    style={{
                      background:
                        step.outcome === 'updated'
                          ? `${colors.accent}22`
                          : `${colors.textMuted}22`,
                      color:
                        step.outcome === 'updated' ? colors.accent : colors.textMuted,
                    }}
                  >
                    {step.candidate}
                  </span>
                  <span style={{ color: colors.textMuted }} className="ml-2">
                    {step.outcome === 'updated'
                      ? `→ atualiza ${step.previousValue === null ? '∞' : step.previousValue} → ${step.candidate} ✓`
                      : `→ não melhora ${step.dp[targetJ]}, mantém`}
                  </span>
                </div>
              )}

            {step.type === 'try-coin' &&
              step.coin !== null &&
              targetJ !== null &&
              step.outcome === 'too-large' && (
                <div className="flex items-center gap-3 flex-wrap font-mono text-sm">
                  <span style={{ color: colors.warning }}>✗</span>
                  <Coin
                    value={step.coin}
                    size={22}
                    palette={colorForCoin(step.coin, coins)}
                  />
                  <span style={{ color: colors.text }}>
                    {step.coin} &gt; {targetJ}
                  </span>
                  <span style={{ color: colors.textMuted }}>
                    — moeda não cabe em dp[{targetJ}], pula.
                  </span>
                </div>
              )}

            {step.type === 'try-coin' &&
              step.coin !== null &&
              targetJ !== null &&
              step.outcome === 'unreachable-source' && (
                <div className="flex items-center gap-3 flex-wrap font-mono text-sm">
                  <span style={{ color: colors.warning }}>✗</span>
                  <span style={{ color: colors.text }}>
                    dp[{step.sourceJ}] = ∞
                  </span>
                  <span style={{ color: colors.textMuted }}>
                    — sub-valor não alcançável, não dá pra usar
                  </span>
                  <Coin
                    value={step.coin}
                    size={22}
                    palette={colorForCoin(step.coin, coins)}
                  />
                </div>
              )}

            {step.type === 'cell-done' && targetJ !== null && (
              <div className="font-mono text-sm" style={{ color: colors.text }}>
                <span style={{ color: colors.accent }}>✓</span> dp[{targetJ}] ={' '}
                {step.dp[targetJ] === null ? '∞' : step.dp[targetJ]} fixado.
              </div>
            )}

            {step.type === 'init' && (
              <div className="font-mono text-sm" style={{ color: colors.text }}>
                dp[0] = 0, dp[1..{amount}] = ∞ — preencheremos cada célula olhando para
                células menores já resolvidas.
              </div>
            )}

            {step.type === 'backtrack-start' && (
              <div className="font-mono text-sm" style={{ color: colors.accent }}>
                ⟲ backtrack: começando em j = {amount}, vamos seguir as moedas
                guardadas em choice[].
              </div>
            )}

            {step.type === 'backtrack-pop' && step.coin !== null && (
              <div className="flex items-center gap-3 flex-wrap font-mono text-sm">
                <span style={{ color: colors.accent }}>⟲</span>
                <span style={{ color: colors.text }}>choice[{step.sourceJ}] =</span>
                <Coin value={step.coin} size={22} palette={colorForCoin(step.coin, coins)} />
                <span style={{ color: colors.textMuted }}>
                  → próximo j = {step.sourceJ} − {step.coin} = {step.backtrackJ}
                </span>
              </div>
            )}

            {step.type === 'done' && (
              <div
                className="flex items-center gap-2 font-mono text-sm"
                style={{ color: colors.accent }}
              >
                <span>✓ mínimo: {step.result.length} moedas</span>
              </div>
            )}

            {step.type === 'impossible' && (
              <div className="font-mono text-sm" style={{ color: colors.warning }}>
                ✗ impossível formar {amount} com moedas [{coins.join(', ')}]
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
            Combinação acumulada
          </div>
          <div
            className="rounded-xl border p-5 flex items-end justify-center gap-1"
            style={{
              minHeight: 110,
              background: colors.surfaceLight,
              borderColor: colors.border,
            }}
          >
            {step.result.length === 0 ? (
              <span className="text-xs" style={{ color: colors.textMuted }}>
                aguardando backtrack…
              </span>
            ) : (
              <div className="flex items-end gap-3 flex-wrap justify-center">
                <AnimatePresence>
                  {step.result.map((c, idx) => (
                    <motion.div
                      key={`${idx}-${c}`}
                      initial={{ y: -30, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    >
                      <Coin value={c} size={44} palette={colorForCoin(c, coins)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {step.type === 'done' && (
                  <div className="ml-3 flex flex-col items-start">
                    <span className="text-[10px]" style={{ color: colors.textMuted }}>
                      total
                    </span>
                    <span className="font-mono font-bold text-lg" style={{ color: colors.accent }}>
                      {step.result.reduce((s, x) => s + x, 0)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <StepController
        isPlaying={isPlaying}
        isFinished={isFinished}
        canGoBack={currentStep > 0}
        canGoForward={currentStep < totalSteps - 1}
        speed={speed}
        onPlayPause={handlePlayPause}
        onNext={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
        onPrev={() => setCurrentStep((s) => Math.max(0, s - 1))}
        onReset={reset}
        onSpeedChange={setSpeed}
      />

      <StepLog entries={logEntries} currentStep={currentStep} />
    </div>
  )
}
