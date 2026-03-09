// src/algorithms/single-cycle/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrayBar } from '@/components/visualizers/ArrayBar'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type SingleCycleStep } from './engine'

export function SingleCycleVisualizer() {
  const [arr, setArr] = useState(config.presets[0].data)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1200)

  const { steps, result } = useMemo(() => computeSteps(arr), [arr])
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
    detail: s.jump !== null ? `(${s.from}+${s.jump}) mod ${arr.length} = ${s.to}` : undefined,
  }))

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Presets
        options={config.presets}
        selected={arr}
        onSelect={handlePresetSelect}
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
            [ {arr.join(', ')} ]
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Array cells */}
        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          {arr.map((val, idx) => {
            const isVisited = step.visitedIndices.has(idx)
            const isCurrent = !isFinished && step.from === idx
            const isTarget = !isFinished && step.to === idx && step.type === 'jump'

            let state: 'default' | 'active' | 'visited' | 'target' = 'default'
            if (isCurrent) state = 'active'
            else if (isTarget) state = 'target'
            else if (isVisited) state = 'visited'

            return (
              <ArrayBar
                key={idx}
                value={val}
                index={idx}
                state={state}
                showDirection
                showPointer={isCurrent}
                showCheckmark={isVisited && !isCurrent}
              />
            )
          })}
        </div>

        {/* Jump indicator */}
        <AnimatePresence>
          {!isFinished && step.jump !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-3"
            >
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-lg"
                style={{
                  background: `${step.jump >= 0 ? colors.positive : colors.negative}11`,
                  border: `1px solid ${step.jump >= 0 ? colors.positive : colors.negative}33`,
                }}
              >
                <span className="text-xs" style={{ color: colors.textMuted }}>Salto:</span>
                <span
                  className="text-sm font-semibold font-mono"
                  style={{ color: step.jump >= 0 ? colors.positive : colors.negative }}
                >
                  arr[{step.from}] = {step.jump > 0 ? `+${step.jump}` : step.jump}
                </span>
                <span className="text-lg">{step.jump >= 0 ? '\u2192' : '\u2190'}</span>
                <span className="text-xs" style={{ color: colors.textMuted }}>
                  ({step.from} + {step.jump}) mod {arr.length} ={' '}
                  <strong style={{ color: colors.accent }}>{step.to}</strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result banner */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-5 rounded-xl mt-3"
              style={{
                background: result ? `${colors.accent}11` : `${colors.warning}11`,
                border: `1px solid ${result ? colors.accent : colors.warning}33`,
              }}
            >
              <div className="text-3xl mb-1.5">{result ? '\u2713' : '\u2717'}</div>
              <div
                className="text-lg font-bold"
                style={{ color: result ? colors.accent : colors.warning }}
              >
                {result ? 'TRUE \u2014 Ciclo Unico!' : 'FALSE \u2014 Nao e Ciclo Unico'}
              </div>
              <div className="text-xs mt-1.5" style={{ color: colors.textMuted }}>
                {result
                  ? `Todos os ${arr.length} elementos foram visitados e retornamos ao indice 0.`
                  : 'Nem todos os elementos foram visitados ou nao retornamos ao indice 0.'}
              </div>
            </motion.div>
          )}
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
