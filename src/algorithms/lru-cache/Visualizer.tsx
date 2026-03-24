// src/algorithms/lru-cache/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type LRUCacheData } from './engine'

export function LRUCacheVisualizer() {
  const [data, setData] = useState<LRUCacheData>(config.presets[0].data as LRUCacheData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)

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

  const handlePresetSelect = useCallback((newData: LRUCacheData) => {
    setData(newData)
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

  const getItemColor = (key: number, index: number) => {
    if (key === step.currentKey) {
      if (step.type.includes('get')) {
        return step.result === '-1' ? colors.warning : colors.accent
      }
      return colors.current
    }
    if (key === step.evictedKey) return colors.warning
    // Gradient from most recent (green) to least recent (red)
    const ratio = index / Math.max(1, step.cache.length - 1)
    if (ratio < 0.33) return colors.accent
    if (ratio < 0.66) return colors.visited
    return `${colors.warning}88`
  }

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
    detail: s.result !== null ? `= ${s.result}` : undefined,
  }))

  return (
    <div className="space-y-5">
      <Presets
        options={config.presets.map((p) => ({ label: p.label, data: p.data as LRUCacheData }))}
        selected={data}
        onSelect={handlePresetSelect}
        compare={(a, b) => a.capacity === b.capacity && JSON.stringify(a.operations) === JSON.stringify(b.operations)}
      />

      <div className="rounded-2xl border p-4" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            LRU Cache
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: colors.bg, color: colors.accent }}>
            Capacidade: {step.capacity}
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Cache visualization as linked list */}
        <div className="min-h-[150px] p-4 rounded-xl flex items-center justify-center" style={{ background: colors.bg }}>
          <div className="flex items-center gap-2">
            {/* Head sentinel */}
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-xs"
                style={{ borderColor: colors.border, color: colors.textMuted }}
              >
                HEAD
              </div>
              <span className="text-[10px] mt-1" style={{ color: colors.textMuted }}>mais recente</span>
            </div>

            {step.cache.length > 0 && (
              <div className="text-lg" style={{ color: colors.border }}>→</div>
            )}

            {/* Cache items */}
            <AnimatePresence mode="popLayout">
              {step.cache.map((item, index) => (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="flex flex-col items-center"
                    animate={{
                      scale: item.key === step.currentKey ? 1.1 : 1,
                      y: item.key === step.evictedKey ? 20 : 0,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center"
                      style={{
                        background: getItemColor(item.key, index),
                        borderColor: item.key === step.currentKey ? colors.current : colors.border,
                        color: colors.bg,
                      }}
                    >
                      <span className="font-mono font-bold text-lg">{item.key}</span>
                      <span className="text-xs opacity-80">"{item.value}"</span>
                    </div>
                  </motion.div>
                  {index < step.cache.length - 1 && (
                    <div className="text-lg" style={{ color: colors.border }}>↔</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {step.cache.length === 0 && (
              <div className="text-sm px-4" style={{ color: colors.textMuted }}>
                Cache vazio
              </div>
            )}

            {step.cache.length > 0 && (
              <div className="text-lg" style={{ color: colors.border }}>→</div>
            )}

            {/* Tail sentinel */}
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-xs"
                style={{ borderColor: colors.border, color: colors.textMuted }}
              >
                TAIL
              </div>
              <span className="text-[10px] mt-1" style={{ color: colors.textMuted }}>menos recente</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-3 text-xs" style={{ color: colors.textMuted }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded" style={{ background: colors.accent }} />
            <span>Recente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded" style={{ background: colors.visited }} />
            <span>Medio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded" style={{ background: `${colors.warning}88` }} />
            <span>Antigo (LRU)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded" style={{ background: colors.current }} />
            <span>Operando</span>
          </div>
        </div>

        {/* Eviction notification */}
        <AnimatePresence>
          {step.evictedKey !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center p-2 rounded-lg"
              style={{ background: `${colors.warning}20`, border: `1px solid ${colors.warning}` }}
            >
              <span className="text-sm" style={{ color: colors.warning }}>
                Removido: {step.evictedKey} (LRU)
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result display */}
        <AnimatePresence>
          {step.result !== null && step.type.includes('get') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center p-3 rounded-xl"
              style={{
                background: step.result === '-1' ? `${colors.warning}20` : `${colors.accent}20`,
                border: `1px solid ${step.result === '-1' ? colors.warning : colors.accent}`,
              }}
            >
              <span className="font-bold" style={{ color: step.result === '-1' ? colors.warning : colors.accent }}>
                {step.result === '-1' ? 'Miss - Key nao encontrada' : `Hit - Valor: "${step.result}"`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 rounded-xl mt-3"
              style={{ background: `${colors.accent}15`, border: `1px solid ${colors.accent}33` }}
            >
              <div className="text-sm font-bold" style={{ color: colors.accent }}>
                LRU Cache Concluido
              </div>
              <div className="text-xs mt-1" style={{ color: colors.text }}>
                {step.cache.length} item(s) no cache
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hash Table representation */}
      <div className="rounded-xl border p-3" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          Hash Table (key → node)
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {step.cache.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-1 px-2 py-1 rounded border text-xs"
              style={{
                background: item.key === step.currentKey ? colors.current : colors.surfaceLight,
                borderColor: item.key === step.currentKey ? colors.current : colors.border,
                color: item.key === step.currentKey ? colors.bg : colors.text,
              }}
            >
              <span className="font-mono font-bold">{item.key}</span>
              <span className="opacity-60">→</span>
              <span className="font-mono">"{item.value}"</span>
            </div>
          ))}
          {step.cache.length === 0 && (
            <span className="text-xs" style={{ color: colors.textMuted }}>Vazio</span>
          )}
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
