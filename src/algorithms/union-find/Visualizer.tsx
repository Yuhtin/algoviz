// src/algorithms/union-find/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type UnionFindData } from './engine'

export function UnionFindVisualizer() {
  const [data, setData] = useState<UnionFindData>(config.presets[0].data as UnionFindData)
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

  const handlePresetSelect = useCallback((newData: UnionFindData) => {
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

  // Group nodes by their root
  const groups = useMemo(() => {
    const groupMap = new Map<string, string[]>()
    for (const node of data.nodes) {
      let root = node
      let visited = new Set<string>()
      while (step.parent.get(root) !== root && !visited.has(root)) {
        visited.add(root)
        root = step.parent.get(root) || root
      }
      if (!groupMap.has(root)) {
        groupMap.set(root, [])
      }
      groupMap.get(root)!.push(node)
    }
    return groupMap
  }, [data.nodes, step.parent])

  const getNodeColor = (node: string) => {
    if (step.highlightedNodes.includes(node)) {
      if (step.type.includes('union') || step.type.includes('link')) return colors.current
      if (step.type.includes('find') || step.type.includes('connected')) return colors.warning
      return colors.current
    }
    if (node === step.root1 || node === step.root2) return colors.accent
    return colors.surfaceLight
  }

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
  }))

  const groupColors = ['#00D4AA', '#6C5CE7', '#FFD93D', '#FF6B6B', '#00B4D8', '#E91E63', '#4CAF50', '#FF9800']

  return (
    <div className="space-y-5">
      <Presets
        options={config.presets.map((p) => ({ label: p.label, data: p.data as UnionFindData }))}
        selected={data}
        onSelect={handlePresetSelect}
        compare={(a, b) => JSON.stringify(a.nodes) === JSON.stringify(b.nodes)}
      />

      <div className="rounded-2xl border p-4" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Union-Find
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Visualization - Show groups */}
        <div className="min-h-[200px] p-4 rounded-xl" style={{ background: colors.bg }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {Array.from(groups.entries()).map(([root, members], groupIdx) => (
              <motion.div
                key={root}
                layout
                className="p-3 rounded-xl border-2"
                style={{
                  borderColor: groupColors[groupIdx % groupColors.length],
                  background: `${groupColors[groupIdx % groupColors.length]}15`,
                }}
              >
                <div className="text-xs mb-2 text-center font-mono" style={{ color: groupColors[groupIdx % groupColors.length] }}>
                  Raiz: {root}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {members.map((node) => (
                    <motion.div
                      key={node}
                      layout
                      className="w-12 h-12 rounded-full flex flex-col items-center justify-center border-2"
                      style={{
                        background: getNodeColor(node),
                        borderColor: step.highlightedNodes.includes(node) ? colors.current : colors.border,
                      }}
                      animate={{ scale: step.highlightedNodes.includes(node) ? 1.1 : 1 }}
                    >
                      <span
                        className="font-mono font-bold text-xs"
                        style={{ color: step.highlightedNodes.includes(node) ? colors.bg : colors.text }}
                      >
                        {node.length > 3 ? node.slice(0, 3) : node}
                      </span>
                      <span className="text-[8px]" style={{ color: colors.textMuted }}>
                        r:{step.rank.get(node) || 0}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connection result */}
        <AnimatePresence>
          {step.connected !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center p-3 rounded-xl"
              style={{
                background: step.connected ? `${colors.accent}20` : `${colors.warning}20`,
                border: `1px solid ${step.connected ? colors.accent : colors.warning}`,
              }}
            >
              <span className="font-bold" style={{ color: step.connected ? colors.accent : colors.warning }}>
                {step.connected ? 'Conectados!' : 'Nao conectados'}
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
                Union-Find Concluido
              </div>
              <div className="text-xs mt-1" style={{ color: colors.text }}>
                {groups.size} componente(s) conexo(s)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Parent array visualization */}
      <div className="rounded-xl border p-3" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          Array Parent
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.nodes.map((node) => {
            const parent = step.parent.get(node) || node
            const isRoot = parent === node
            return (
              <div
                key={node}
                className="flex flex-col items-center px-2 py-1 rounded border"
                style={{
                  background: isRoot ? colors.accent : colors.surfaceLight,
                  borderColor: isRoot ? colors.accent : colors.border,
                  color: isRoot ? colors.bg : colors.text,
                }}
              >
                <span className="font-mono text-xs font-bold">{node.length > 4 ? node.slice(0, 4) : node}</span>
                <span className="text-[10px]">{'->'}{parent.length > 4 ? parent.slice(0, 4) : parent}</span>
              </div>
            )
          })}
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
