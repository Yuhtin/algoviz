// src/algorithms/two-sum/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrayBar } from '@/components/visualizers/ArrayBar'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config, type TwoSumInput } from './config'
import { computeSteps, type TwoSumStep } from './engine'

export function TwoSumVisualizer() {
  const [input, setInput] = useState(config.presets[0].data)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)

  const { steps, result } = useMemo(
    () => computeSteps(input.array, input.target),
    [input]
  )
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

  const handlePresetSelect = useCallback((data: TwoSumInput) => {
    setInput(data)
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

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Presets
        options={config.presets}
        selected={input}
        onSelect={handlePresetSelect}
        compare={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
      />

      {/* Main Visualization */}
      <div
        className="rounded-2xl border p-8"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Array
          </span>
          <span className="text-xs font-mono" style={{ color: colors.accent }}>
            [ {input.array.join(', ')} ]
          </span>
          <span className="mx-4 text-xs" style={{ color: colors.textMuted }}>|</span>
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Target
          </span>
          <span className="text-xs font-mono" style={{ color: colors.current }}>
            {input.target}
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Array cells */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {input.array.map((val, idx) => {
            const isCurrent = step.currentIndex === idx
            const isFoundPair = step.found?.includes(idx)
            const isInHashMap = step.hashMap.has(val) && step.hashMap.get(val) === idx

            let state: 'default' | 'active' | 'visited' | 'target' = 'default'
            if (isFoundPair) state = 'target'
            else if (isCurrent) state = 'active'
            else if (isInHashMap) state = 'visited'

            return (
              <ArrayBar
                key={idx}
                value={val}
                index={idx}
                state={state}
                showPointer={isCurrent}
                showCheckmark={isInHashMap && !isCurrent}
              />
            )
          })}
        </div>

        {/* Hash Map Display */}
        <div
          className="rounded-xl border p-4 mb-4"
          style={{ background: colors.code, borderColor: colors.border }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Hash Map
            </span>
            <span className="text-xs font-mono" style={{ color: colors.visited }}>
              {`{ valor -> indice }`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {step.hashMap.size === 0 ? (
              <span className="text-xs" style={{ color: colors.textMuted }}>vazio</span>
            ) : (
              Array.from(step.hashMap.entries()).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-md text-xs font-mono"
                  style={{
                    background: `${colors.visited}22`,
                    border: `1px solid ${colors.visited}44`,
                    color: colors.visited,
                  }}
                >
                  {key} {'->'} {value}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Status indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-3"
          >
            {step.type === 'found' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.accent}11`,
                  border: `1px solid ${colors.accent}33`,
                }}
              >
                <span className="text-lg">OK</span>
                <span className="text-sm font-semibold" style={{ color: colors.accent }}>
                  Encontrado! [{step.found![0]}, {step.found![1]}]
                </span>
              </div>
            ) : step.type === 'not_found' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.warning}11`,
                  border: `1px solid ${colors.warning}33`,
                }}
              >
                <span className="text-lg">X</span>
                <span className="text-sm font-semibold" style={{ color: colors.warning }}>
                  Nenhum par encontrado
                </span>
              </div>
            ) : step.type === 'add' ? (
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg"
                style={{
                  background: `${colors.current}11`,
                  border: `1px solid ${colors.current}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  Buscando complemento:
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: colors.current }}>
                  {input.target} - {step.currentValue} = {step.complement}
                </span>
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  (nao existe)
                </span>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
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

      {/* Step Log */}
      <StepLog entries={logEntries} currentStep={currentStep} />
    </div>
  )
}
