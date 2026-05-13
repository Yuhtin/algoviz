'use client'

import { useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { DPDesignFlow } from '@/components/dp/DPDesignFlow'
import { config, type KnapsackData, type KnapsackItem } from './config'
import { computeSteps } from './engine'
import { knapsackStages } from './stages'

function ItemCard({
  item,
  active,
  chosen,
}: {
  item: KnapsackItem
  active: boolean
  chosen: boolean
}) {
  return (
    <motion.div
      animate={{ scale: active ? 1.04 : 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border-2 px-3 py-2.5 flex items-center gap-2.5 min-w-[140px]"
      style={{
        borderColor: active
          ? colors.current
          : chosen
          ? colors.accent
          : colors.border,
        background: active
          ? `${colors.current}11`
          : chosen
          ? `${colors.accent}11`
          : colors.surfaceLight,
        boxShadow: chosen ? `0 0 18px ${colors.accent}33` : 'none',
      }}
    >
      <div className="text-3xl leading-none">{item.icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold" style={{ color: colors.text }}>
          {item.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
            {item.weight}kg
          </span>
          <span className="text-[10px] font-mono font-bold" style={{ color: colors.accent }}>
            ${item.value}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface CellPoint {
  x: number
  y: number
}

export function KnapsackVisualizer() {
  const [data, setData] = useState<KnapsackData>(config.presets[0].data)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)

  const { steps, finalValue } = useMemo(() => computeSteps(data), [data])
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
    (newData: KnapsackData) => {
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

  const { items, capacity } = data
  const n = items.length
  const inBacktrack =
    step.type === 'backtrack-start' ||
    step.type === 'backtrack-take' ||
    step.type === 'backtrack-skip' ||
    step.type === 'done'

  const cellW = 40
  const cellH = 38

  const pathSet = useMemo(() => {
    const s = new Set<string>()
    step.cellsHighlight.forEach((c) => s.add(`${c.i}-${c.w}`))
    return s
  }, [step.cellsHighlight])

  const currentWeight = step.chosenItems.reduce(
    (sum, idx) => sum + items[idx].weight,
    0
  )
  const currentValue = step.chosenItems.reduce(
    (sum, idx) => sum + items[idx].value,
    0
  )

  // Arrow drawing
  const gridContainerRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [arrows, setArrows] = useState<
    Array<{ from: CellPoint; to: CellPoint; color: string; key: string }>
  >([])

  useLayoutEffect(() => {
    if (!gridContainerRef.current) {
      setArrows([])
      return
    }
    if (
      step.type !== 'compare-and-fill' ||
      step.activeI === null ||
      step.activeW === null
    ) {
      setArrows([])
      return
    }
    const cRect = gridContainerRef.current.getBoundingClientRect()
    const targetEl = cellRefs.current.get(`${step.activeI}-${step.activeW}`)
    const skipEl = cellRefs.current.get(`${step.activeI - 1}-${step.activeW}`)
    const takeEl =
      step.takeSourceW !== null
        ? cellRefs.current.get(`${step.activeI - 1}-${step.takeSourceW}`)
        : null
    if (!targetEl) {
      setArrows([])
      return
    }
    const tgt = targetEl.getBoundingClientRect()
    const tgtPoint: CellPoint = {
      x: tgt.left - cRect.left + tgt.width / 2,
      y: tgt.top - cRect.top,
    }
    const newArrows: Array<{ from: CellPoint; to: CellPoint; color: string; key: string }> = []
    if (skipEl) {
      const r = skipEl.getBoundingClientRect()
      newArrows.push({
        from: {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height,
        },
        to: tgtPoint,
        color: step.decision === 'skip' || step.decision === 'tied-skip' ? colors.accent : colors.visited,
        key: 'skip',
      })
    }
    if (takeEl) {
      const r = takeEl.getBoundingClientRect()
      newArrows.push({
        from: {
          x: r.left - cRect.left + r.width / 2,
          y: r.top - cRect.top + r.height,
        },
        to: tgtPoint,
        color: step.decision === 'take' ? colors.accent : colors.warning,
        key: 'take',
      })
    }
    setArrows(newArrows)
  }, [currentStep, step.type, step.activeI, step.activeW, step.takeSourceW, step.decision])

  return (
    <div className="space-y-6">
      <DPDesignFlow algorithmName="0/1 Knapsack" stages={knapsackStages} />

      <Presets
        options={config.presets}
        selected={data}
        onSelect={handlePresetSelect}
      />

      <div
        className="rounded-2xl border p-6 md:p-8"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Capacidade
            </span>
            <span
              className="px-3 py-1 rounded-lg font-mono font-bold"
              style={{
                background: `${colors.accent}15`,
                border: `1px solid ${colors.accent}66`,
                color: colors.accent,
              }}
            >
              {capacity}kg
            </span>
          </div>
          <div className="text-xs font-mono" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
            Itens disponíveis
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => {
              const isActive =
                !inBacktrack && step.activeI === idx + 1 && step.type !== 'fill-complete'
              const isChosen = step.chosenItems.includes(idx)
              const isBacktrackActive = inBacktrack && step.backtrackI === idx
              return (
                <ItemCard
                  key={idx}
                  item={item}
                  active={isActive || isBacktrackActive}
                  chosen={isChosen}
                />
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          <div className="flex flex-col items-start overflow-x-auto">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
              Tabela dp[i][w]
            </div>

            <div ref={gridContainerRef} className="relative">
              <div className="flex items-center mb-1" style={{ paddingLeft: cellW + 8 }}>
                {Array.from({ length: capacity + 1 }, (_, w) => (
                  <div
                    key={w}
                    className="flex items-center justify-center text-[10px] font-mono"
                    style={{
                      width: cellW,
                      color:
                        w === step.activeW || w === step.backtrackW
                          ? colors.current
                          : colors.textMuted,
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {step.dp.map((row, i) => {
                const isCurrentRow =
                  !inBacktrack && step.activeI === i && step.type !== 'fill-complete'
                const isBacktrackRow = inBacktrack && step.backtrackI === i
                return (
                  <div key={i} className="flex items-center">
                    <div
                      className="flex items-center justify-center text-[11px] font-mono pr-2"
                      style={{
                        width: cellW + 8,
                        color:
                          isCurrentRow || isBacktrackRow
                            ? colors.current
                            : colors.textMuted,
                      }}
                    >
                      {i === 0 ? '∅' : items[i - 1].icon}
                    </div>
                    {row.map((val, w) => {
                      const isActiveCell =
                        !inBacktrack && step.activeI === i && step.activeW === w
                      const isComparingCell = step.type === 'compare-and-fill'
                      const isTakeSource =
                        !inBacktrack &&
                        isComparingCell &&
                        step.activeI !== null &&
                        step.takeSourceW !== null &&
                        i === step.activeI - 1 &&
                        w === step.takeSourceW
                      const isSkipSource =
                        !inBacktrack &&
                        isComparingCell &&
                        step.activeI !== null &&
                        i === step.activeI - 1 &&
                        w === step.activeW
                      const isCantFitSource =
                        !inBacktrack &&
                        step.type === 'cant-fit' &&
                        step.activeI !== null &&
                        i === step.activeI - 1 &&
                        w === step.activeW
                      const isPath = pathSet.has(`${i}-${w}`)
                      const isBacktrackHead =
                        inBacktrack && step.backtrackI === i && step.backtrackW === w

                      let bgColor: string =
                        i === 0 || w === 0 ? colors.code : colors.surfaceLight
                      let borderColor: string = colors.border
                      let textColor: string =
                        i === 0 || w === 0 ? colors.textMuted : colors.text

                      if (isPath) {
                        bgColor = `${colors.accent}22`
                        borderColor = `${colors.accent}88`
                        textColor = colors.accent
                      }
                      if (isSkipSource || isCantFitSource) {
                        bgColor = `${colors.visited}22`
                        borderColor = colors.visited
                        textColor = colors.visited
                      }
                      if (isTakeSource) {
                        bgColor = `${colors.warning}22`
                        borderColor = colors.warning
                        textColor = colors.warning
                      }
                      if (isActiveCell) {
                        bgColor = `${colors.current}33`
                        borderColor = colors.current
                        textColor = colors.current
                      }
                      if (isBacktrackHead) {
                        bgColor = `${colors.current}33`
                        borderColor = colors.current
                        textColor = colors.current
                      }

                      const justFilled =
                        (step.type === 'compare-and-fill' || step.type === 'cant-fit') &&
                        isActiveCell

                      return (
                        <motion.div
                          key={w}
                          ref={(el: HTMLDivElement | null) => {
                            if (el) cellRefs.current.set(`${i}-${w}`, el)
                            else cellRefs.current.delete(`${i}-${w}`)
                          }}
                          animate={{
                            backgroundColor: bgColor,
                            borderColor,
                            scale:
                              justFilled || isBacktrackHead ? [1, 1.22, 1] : 1,
                            boxShadow: justFilled
                              ? `0 0 18px ${colors.accent}55`
                              : 'none',
                          }}
                          transition={{ duration: 0.45 }}
                          className="border-2 flex items-center justify-center font-mono"
                          style={{
                            width: cellW,
                            height: cellH,
                            color: textColor,
                            fontSize: 13,
                            fontWeight: isPath || isActiveCell ? 700 : 500,
                          }}
                        >
                          {val}
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })}

              <AnimatePresence>
                {arrows.length > 0 && (
                  <motion.svg
                    key={`arrows-${currentStep}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <defs>
                      {arrows.map((a) => (
                        <marker
                          key={`m-${a.key}-${currentStep}`}
                          id={`khead-${a.key}-${currentStep}`}
                          markerWidth="7"
                          markerHeight="7"
                          refX="5"
                          refY="3"
                          orient="auto"
                        >
                          <path d="M0,0 L0,6 L5,3 z" fill={a.color} />
                        </marker>
                      ))}
                    </defs>
                    {arrows.map((a) => (
                      <motion.path
                        key={`p-${a.key}-${currentStep}`}
                        d={`M ${a.from.x} ${a.from.y} Q ${(a.from.x + a.to.x) / 2} ${(a.from.y + a.to.y) / 2 + 12}, ${a.to.x} ${a.to.y}`}
                        fill="none"
                        stroke={a.color}
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        markerEnd={`url(#khead-${a.key}-${currentStep})`}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    ))}
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-formula`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5 px-4 py-3 rounded-xl border self-stretch min-h-[52px]"
                style={{ background: colors.code, borderColor: colors.border }}
              >
                {step.type === 'compare-and-fill' &&
                  step.activeI !== null &&
                  step.activeW !== null && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded"
                          style={{
                            background: `${colors.visited}22`,
                            color: colors.visited,
                          }}
                        >
                          skip
                        </span>
                        <span style={{ color: colors.text }}>
                          dp[{step.activeI - 1}][{step.activeW}] = {step.skipValue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded"
                          style={{
                            background: `${colors.warning}22`,
                            color: colors.warning,
                          }}
                        >
                          take
                        </span>
                        <span style={{ color: colors.text }}>
                          dp[{step.activeI - 1}][{step.takeSourceW}] + {items[step.activeI - 1].value} = {step.takeValue}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span style={{ color: colors.textMuted }}>→ escolhe</span>
                        <span
                          className="px-2 py-0.5 rounded font-bold"
                          style={{
                            background: `${colors.accent}22`,
                            color: colors.accent,
                          }}
                        >
                          {step.decision === 'take' ? 'take' : 'skip'} = {step.dp[step.activeI][step.activeW]}
                        </span>
                      </div>
                    </div>
                  )}

                {step.type === 'cant-fit' &&
                  step.activeI !== null &&
                  step.activeW !== null && (
                    <div className="font-mono text-xs flex items-center gap-2 flex-wrap">
                      <span style={{ color: colors.warning }}>✗</span>
                      <span style={{ color: colors.text }}>
                        {items[step.activeI - 1].icon} pesa{' '}
                        {items[step.activeI - 1].weight}kg &gt; {step.activeW}kg
                      </span>
                      <span style={{ color: colors.textMuted }}>—</span>
                      <span style={{ color: colors.text }}>
                        herda dp[{step.activeI - 1}][{step.activeW}] = {step.skipValue}
                      </span>
                    </div>
                  )}

                {step.type === 'init' && (
                  <div className="font-mono text-xs" style={{ color: colors.text }}>
                    dp inicializado em zeros. Cada célula dp[i][w] guarda o melhor
                    valor usando os primeiros i itens com capacidade w.
                  </div>
                )}

                {step.type === 'row-done' && step.activeI !== null && (
                  <div className="font-mono text-xs" style={{ color: colors.text }}>
                    linha {step.activeI} ({items[step.activeI - 1].icon}) finalizada.
                  </div>
                )}

                {step.type === 'fill-complete' && (
                  <div className="font-mono text-xs" style={{ color: colors.accent }}>
                    tabela completa. valor ótimo = dp[{n}][{capacity}] = {finalValue}.
                  </div>
                )}

                {step.type === 'backtrack-start' && (
                  <div className="font-mono text-xs" style={{ color: colors.accent }}>
                    ⟲ backtrack a partir de dp[{n}][{capacity}]. Se dp[i][w] ≠
                    dp[i-1][w], o item entrou.
                  </div>
                )}

                {step.type === 'backtrack-take' && step.backtrackI !== null && (
                  <div className="font-mono text-xs" style={{ color: colors.accent }}>
                    + {items[step.backtrackI].icon} {items[step.backtrackI].name} entra na mochila
                  </div>
                )}

                {step.type === 'backtrack-skip' && step.backtrackI !== null && (
                  <div className="font-mono text-xs" style={{ color: colors.textMuted }}>
                    – {items[step.backtrackI].icon} {items[step.backtrackI].name} não escolhido
                  </div>
                )}

                {step.type === 'done' && (
                  <div className="font-mono text-xs" style={{ color: colors.accent }}>
                    ✓ solução ótima encontrada
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xs uppercase tracking-widest mb-3 self-start" style={{ color: colors.textMuted }}>
              Mochila
            </div>
            <div
              className="relative rounded-3xl border-2 p-4 flex flex-col items-center"
              style={{
                width: 160,
                minHeight: 260,
                background: colors.surfaceLight,
                borderColor: step.type === 'done' ? colors.accent : colors.border,
                boxShadow: step.type === 'done' ? `0 0 30px ${colors.accent}33` : 'none',
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 rounded-t-full"
                style={{
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderStyle: 'solid',
                  borderColor: step.type === 'done' ? colors.accent : colors.border,
                  background: colors.surface,
                }}
              />

              <div className="flex-1 w-full flex flex-col items-center justify-end gap-2 pt-2">
                <AnimatePresence>
                  {step.chosenItems
                    .slice()
                    .reverse()
                    .map((idx) => {
                      const item = items[idx]
                      return (
                        <motion.div
                          key={idx}
                          initial={{ y: -50, opacity: 0, scale: 0.6 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                          className="rounded-lg px-3 py-1.5 flex items-center gap-2 w-full"
                          style={{
                            background: `${colors.accent}15`,
                            border: `1px solid ${colors.accent}55`,
                          }}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-[10px] font-mono ml-auto" style={{ color: colors.accent }}>
                            ${item.value}
                          </span>
                        </motion.div>
                      )
                    })}
                </AnimatePresence>
              </div>

              <div
                className="w-full mt-3 pt-3 flex justify-between"
                style={{ borderTop: `1px dashed ${colors.border}` }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] uppercase" style={{ color: colors.textMuted }}>
                    peso
                  </span>
                  <span
                    className="text-sm font-mono font-bold"
                    style={{
                      color: currentWeight > capacity ? colors.warning : colors.text,
                    }}
                  >
                    {currentWeight}/{capacity}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase" style={{ color: colors.textMuted }}>
                    valor
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: colors.accent }}>
                    ${currentValue}
                  </span>
                </div>
              </div>
            </div>
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
