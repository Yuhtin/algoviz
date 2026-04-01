'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type MergeSortStep } from './engine'

export function MergeSortVisualizer() {
  const [arr, setArr] = useState(config.presets[0].data)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)

  const { steps } = useMemo(() => computeSteps(arr), [arr])
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

  const handlePresetSelect = useCallback((data: number[]) => {
    setArr(data)
    reset()
  }, [reset])

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

  const maxValue = Math.max(...arr)

  return (
    <div className="space-y-6">
      <Presets
        options={config.presets}
        selected={arr}
        onSelect={handlePresetSelect}
      />

      <div
        className="rounded-2xl border p-8"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Array
          </span>
          <span className="text-xs font-mono" style={{ color: colors.accent }}>
            [ {step.array.join(', ')} ]
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        <div className="flex justify-center items-end gap-2 h-[200px] mb-6">
          {step.array.map((val, idx) => {
            const isComparing = step.comparing !== null && (idx === step.comparing[0] || idx === step.comparing[1])
            const isPlacing = idx === step.placing
            const isMerged = step.mergedIndices.includes(idx)
            const isSorted = step.sortedIndices.includes(idx)
            const inLeft = step.leftRange !== null && idx >= step.leftRange[0] && idx <= step.leftRange[1]
            const inRight = step.rightRange !== null && idx >= step.rightRange[0] && idx <= step.rightRange[1]

            let bgColor: string = colors.surfaceLight
            let borderColor: string = colors.border

            if (step.type === 'done' || isSorted) {
              bgColor = `${colors.accent}22`
              borderColor = colors.accent
            } else if (isPlacing) {
              bgColor = `${colors.warning}44`
              borderColor = colors.warning
            } else if (isComparing) {
              bgColor = `${colors.current}33`
              borderColor = colors.current
            } else if (isMerged) {
              bgColor = `${colors.accent}15`
              borderColor = `${colors.accent}66`
            } else if (inLeft) {
              bgColor = `${colors.visited}22`
              borderColor = `${colors.visited}88`
            } else if (inRight) {
              bgColor = `${colors.current}15`
              borderColor = `${colors.current}66`
            }

            const height = (val / maxValue) * 160 + 20

            return (
              <motion.div
                key={idx}
                layout
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    height,
                    backgroundColor: bgColor,
                    borderColor,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-12 rounded-t-lg border-2 flex items-end justify-center pb-2"
                >
                  <span
                    className="text-sm font-bold font-mono"
                    style={{
                      color: isSorted || step.type === 'done'
                        ? colors.accent
                        : isPlacing
                        ? colors.warning
                        : isComparing
                        ? colors.current
                        : inLeft
                        ? colors.visited
                        : inRight
                        ? colors.current
                        : colors.text
                    }}
                  >
                    {val}
                  </span>
                </motion.div>
                <span className="text-[10px] mt-1 font-mono" style={{ color: colors.textMuted }}>
                  {idx}
                </span>
                <div className="h-4 mt-1">
                  {inLeft && !isSorted && step.type === 'split' && (
                    <span className="text-[9px] px-1 rounded" style={{ background: `${colors.visited}33`, color: colors.visited }}>
                      L
                    </span>
                  )}
                  {inRight && !isSorted && step.type === 'split' && (
                    <span className="text-[9px] px-1 rounded" style={{ background: `${colors.current}33`, color: colors.current }}>
                      R
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-3"
          >
            {step.type === 'done' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.accent}11`,
                  border: `1px solid ${colors.accent}33`,
                }}
              >
                <span className="text-lg">✓</span>
                <span className="text-sm font-semibold" style={{ color: colors.accent }}>
                  Array ordenado!
                </span>
              </div>
            ) : step.type === 'compare' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.current}11`,
                  border: `1px solid ${colors.current}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Comparando:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.current }}
                >
                  {step.comparing ? `arr[${step.comparing[0]}] vs arr[${step.comparing[1]}]` : ''}
                </span>
              </div>
            ) : step.type === 'place' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.warning}11`,
                  border: `1px solid ${colors.warning}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Posicionando:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.warning }}
                >
                  {step.placing !== null ? `${step.array[step.placing]} → posição ${step.placing}` : ''}
                </span>
              </div>
            ) : step.type === 'split' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.visited}11`,
                  border: `1px solid ${colors.visited}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Dividindo em:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.visited }}
                >
                  esquerda e direita
                </span>
              </div>
            ) : step.type === 'merge-complete' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.accent}11`,
                  border: `1px solid ${colors.accent}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Intercalação concluída
                </span>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
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
