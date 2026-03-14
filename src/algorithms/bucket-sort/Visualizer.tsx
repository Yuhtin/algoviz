// src/algorithms/bucket-sort/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type BucketSortStep } from './engine'

export function BucketSortVisualizer() {
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

  const getBarColor = (index: number) => {
    if (step.type === 'done') return colors.accent
    if (step.sortedIndices.includes(index)) return colors.accent
    if (step.currentElement === index) return colors.current
    return colors.visited
  }

  const getBucketBorderColor = (bucketIndex: number) => {
    if (step.currentBucket === bucketIndex) return colors.current
    return colors.border
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Presets
        options={config.presets}
        selected={arr}
        onSelect={handlePresetSelect}
      />

      {/* Main Array Visualization */}
      <div
        className="rounded-2xl border p-8"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            {step.type === 'collect' || step.type === 'done' ? 'Resultado' : 'Array'}
          </span>
          <span className="text-xs font-mono" style={{ color: colors.accent }}>
            [ {step.array.map(v => v.toFixed(2)).join(', ')} ]
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Bar chart visualization */}
        <div className="flex justify-center items-end gap-2 h-[160px] mb-6">
          {step.array.map((val, idx) => {
            const height = Math.max(val / maxValue * 140, 20)
            const bgColor = getBarColor(idx)

            return (
              <motion.div
                key={idx}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ height, backgroundColor: `${bgColor}33`, borderColor: bgColor }}
                  transition={{ duration: 0.3 }}
                  className="w-12 rounded-t-lg border-2 flex items-end justify-center pb-2"
                >
                  <span
                    className="text-[10px] font-bold font-mono"
                    style={{ color: bgColor }}
                  >
                    {val.toFixed(2)}
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

      {/* Buckets Visualization */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Buckets
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {step.buckets.map((bucket, bucketIndex) => (
            <motion.div
              key={bucketIndex}
              className="p-3 rounded-lg min-h-[70px]"
              style={{
                background: step.currentBucket === bucketIndex ? `${colors.current}11` : colors.surfaceLight,
                border: `1px solid ${getBucketBorderColor(bucketIndex)}`,
              }}
              animate={{
                borderColor: getBucketBorderColor(bucketIndex),
              }}
            >
              <div
                className="text-[10px] font-mono mb-2"
                style={{ color: colors.textMuted }}
              >
                Bucket {bucketIndex}
              </div>
              <div className="flex flex-wrap gap-1">
                {bucket.map((value, i) => (
                  <motion.span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                    style={{ background: `${colors.accent}22`, color: colors.accent }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {value.toFixed(2)}
                  </motion.span>
                ))}
                {bucket.length === 0 && (
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>
                    vazio
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          {step.type === 'done' && (
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
          )}
        </motion.div>
      </AnimatePresence>

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
