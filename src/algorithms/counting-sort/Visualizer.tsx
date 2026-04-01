'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type CountingSortStep } from './engine'

export function CountingSortVisualizer() {
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
  const displayArray = step.phase === 'done' ? step.outputArray : step.array

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
        {/* Phase indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            {step.phase === 'counting' ? 'Fase: Contagem' :
             step.phase === 'cumulative' ? 'Fase: Acumulação' :
             step.phase === 'placing' ? 'Fase: Posicionamento' : 'Concluído'}
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Input array */}
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-widest mb-2 block" style={{ color: colors.textMuted }}>
            Array Original
          </span>
          <div className="flex justify-center items-end gap-2 h-[140px]">
            {displayArray.map((val, idx) => {
              const isCurrent = idx === step.currentIndex
              const isSorted = step.sortedIndices.includes(idx) && step.phase === 'done'

              let bgColor: string = colors.surfaceLight
              let borderColor: string = colors.border

              if (isSorted) {
                bgColor = `${colors.accent}22`
                borderColor = colors.accent
              } else if (isCurrent && step.phase === 'counting') {
                bgColor = `${colors.current}33`
                borderColor = colors.current
              } else if (isCurrent && step.phase === 'placing') {
                bgColor = `${colors.warning}33`
                borderColor = colors.warning
              }

              const height = (val / maxValue) * 100 + 20

              return (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ height, backgroundColor: bgColor, borderColor }}
                    transition={{ duration: 0.3 }}
                    className="w-10 rounded-t-lg border-2 flex items-end justify-center pb-1"
                  >
                    <span
                      className="text-xs font-bold font-mono"
                      style={{
                        color: isSorted ? colors.accent :
                               isCurrent ? (step.phase === 'placing' ? colors.warning : colors.current) :
                               colors.text
                      }}
                    >
                      {val}
                    </span>
                  </motion.div>
                  <span className="text-[10px] mt-1 font-mono" style={{ color: colors.textMuted }}>
                    {idx}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Count array */}
        {step.countArray.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest mb-2 block" style={{ color: colors.textMuted }}>
              Array de Contagem
            </span>
            <div className="flex justify-center gap-1 flex-wrap">
              {step.countArray.map((val, idx) => {
                const isHighlighted = idx === step.currentValue

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{
                        backgroundColor: isHighlighted ? `${colors.visited}33` : colors.surfaceLight,
                        borderColor: isHighlighted ? colors.visited : colors.border,
                      }}
                      className="w-8 h-8 rounded border-2 flex items-center justify-center"
                    >
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: isHighlighted ? colors.visited : colors.text }}
                      >
                        {val}
                      </span>
                    </motion.div>
                    <span className="text-[9px] mt-0.5 font-mono" style={{ color: colors.textMuted }}>
                      {idx}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Output array */}
        {step.phase === 'placing' && (
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest mb-2 block" style={{ color: colors.textMuted }}>
              Array de Saída
            </span>
            <div className="flex justify-center gap-1">
              {step.outputArray.map((val, idx) => {
                const isPlaced = step.sortedIndices.includes(idx)
                const isPlacingHere = idx === step.placingAt

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        backgroundColor: isPlacingHere ? `${colors.accent}33` : isPlaced ? `${colors.accent}15` : colors.surfaceLight,
                        borderColor: isPlacingHere ? colors.accent : isPlaced ? `${colors.accent}66` : colors.border,
                      }}
                      className="w-8 h-8 rounded border-2 flex items-center justify-center"
                    >
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: isPlaced ? colors.accent : colors.textMuted }}
                      >
                        {isPlaced ? val : '·'}
                      </span>
                    </motion.div>
                    <span className="text-[9px] mt-0.5 font-mono" style={{ color: colors.textMuted }}>
                      {idx}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Status */}
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
                <span className="text-sm font-mono font-semibold" style={{ color: colors.warning }}>
                  {step.currentValue} → posição {step.placingAt}
                </span>
              </div>
            ) : step.type === 'count' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.current}11`,
                  border: `1px solid ${colors.current}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Contando:
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: colors.current }}>
                  valor {step.currentValue}
                </span>
              </div>
            ) : step.type === 'cumulate' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.visited}11`,
                  border: `1px solid ${colors.visited}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Acumulando:
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: colors.visited }}>
                  count[{step.currentValue}]
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
