'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type InsertionSortStep } from './engine'

export function InsertionSortVisualizer() {
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
            const isKey = val === step.keyValue && idx === step.currentIndex && step.type === 'select'
            const isComparing = idx === step.comparingIndex
            const isShifting = idx === step.shiftingIndex || (step.shiftingIndex !== null && idx === step.shiftingIndex + 1)
            const isInsertPos = idx === step.insertPosition && step.type === 'insert'
            const isSorted = step.sortedIndices.includes(idx) && step.type !== 'select' && step.type !== 'compare' && step.type !== 'shift'
            const isDone = step.type === 'done'

            let bgColor: string = colors.surfaceLight
            let borderColor: string = colors.border

            if (isDone) {
              bgColor = `${colors.accent}22`
              borderColor = colors.accent
            } else if (isInsertPos) {
              bgColor = `${colors.accent}33`
              borderColor = colors.accent
            } else if (isShifting) {
              bgColor = `${colors.warning}33`
              borderColor = colors.warning
            } else if (isComparing) {
              bgColor = `${colors.current}33`
              borderColor = colors.current
            } else if (isKey) {
              bgColor = `${colors.visited}33`
              borderColor = colors.visited
            } else if (isSorted) {
              bgColor = `${colors.accent}11`
              borderColor = `${colors.accent}44`
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
                      color: isDone
                        ? colors.accent
                        : isInsertPos
                        ? colors.accent
                        : isShifting
                        ? colors.warning
                        : isComparing
                        ? colors.current
                        : isKey
                        ? colors.visited
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
                  {isKey && (
                    <span className="text-[9px] px-1 rounded" style={{ background: `${colors.visited}33`, color: colors.visited }}>
                      chave
                    </span>
                  )}
                  {isInsertPos && (
                    <span className="text-[9px] px-1 rounded" style={{ background: `${colors.accent}33`, color: colors.accent }}>
                      inserir
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
            ) : step.type === 'select' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.visited}11`,
                  border: `1px solid ${colors.visited}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Chave:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.visited }}
                >
                  {step.keyValue}
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
                  arr[{step.comparingIndex}] vs chave {step.keyValue}
                </span>
              </div>
            ) : step.type === 'shift' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.warning}11`,
                  border: `1px solid ${colors.warning}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Deslocando:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.warning }}
                >
                  posição {step.shiftingIndex} → {step.shiftingIndex !== null ? step.shiftingIndex + 1 : ''}
                </span>
              </div>
            ) : step.type === 'insert' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.accent}11`,
                  border: `1px solid ${colors.accent}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Inserindo:
                </span>
                <span
                  className="text-sm font-mono font-semibold"
                  style={{ color: colors.accent }}
                >
                  {step.keyValue} na posição {step.insertPosition}
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
