// src/algorithms/trie/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type TrieData, type TrieNode } from './engine'

interface TreePosition {
  id: string
  x: number
  y: number
  char: string
  isEnd: boolean
  children: string[]
}

function layoutTrie(node: TrieNode, x: number, y: number, width: number, positions: TreePosition[]): void {
  positions.push({
    id: node.id,
    x,
    y,
    char: node.char || 'root',
    isEnd: node.isEnd,
    children: Array.from(node.children.keys()),
  })

  const childCount = node.children.size
  if (childCount === 0) return

  const childWidth = width / childCount
  let childX = x - width / 2 + childWidth / 2

  for (const [, child] of node.children) {
    layoutTrie(child, childX, y + 60, childWidth, positions)
    childX += childWidth
  }
}

function getTriePositions(root: TrieNode, width: number): TreePosition[] {
  const positions: TreePosition[] = []
  layoutTrie(root, width / 2, 40, width - 80, positions)
  return positions
}

function getAllNodes(node: TrieNode): Map<string, TrieNode> {
  const nodes = new Map<string, TrieNode>()
  nodes.set(node.id, node)
  for (const [, child] of node.children) {
    const childNodes = getAllNodes(child)
    for (const [id, n] of childNodes) {
      nodes.set(id, n)
    }
  }
  return nodes
}

export function TrieVisualizer() {
  const [data, setData] = useState<TrieData>(config.presets[0].data as TrieData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)

  const { steps } = useMemo(() => computeSteps(data), [data])
  const totalSteps = steps.length
  const step = steps[Math.min(currentStep, totalSteps - 1)]
  const isFinished = currentStep >= totalSteps - 1

  const positions = useMemo(() => getTriePositions(step.trie, 580), [step.trie])
  const allNodes = useMemo(() => getAllNodes(step.trie), [step.trie])

  useEffect(() => {
    if (!isPlaying || isFinished) return
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, isFinished, speed])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const handlePresetSelect = useCallback((newData: TrieData) => {
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

  const getNodeColor = (nodeId: string) => {
    const node = allNodes.get(nodeId)
    if (nodeId === step.highlightedNodeId) {
      if (step.type.includes('insert')) return colors.current
      if (step.type.includes('search')) return step.result === false ? colors.warning : colors.accent
      if (step.type.includes('prefix')) return step.result === false ? colors.warning : colors.accent
      return colors.current
    }
    if (node?.isEnd) return `${colors.accent}88`
    return colors.surfaceLight
  }

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
  }))

  // Build parent map for edges
  const parentMap = useMemo(() => {
    const map = new Map<string, string>()
    function traverse(node: TrieNode, parentId: string | null) {
      if (parentId) map.set(node.id, parentId)
      for (const [, child] of node.children) {
        traverse(child, node.id)
      }
    }
    traverse(step.trie, null)
    return map
  }, [step.trie])

  const positionMap = useMemo(() => {
    const map = new Map<string, TreePosition>()
    positions.forEach((p) => map.set(p.id, p))
    return map
  }, [positions])

  return (
    <div className="space-y-5">
      <Presets
        options={config.presets.map((p) => ({ label: p.label, data: p.data as TrieData }))}
        selected={data}
        onSelect={handlePresetSelect}
        compare={(a, b) => JSON.stringify(a.operations) === JSON.stringify(b.operations)}
      />

      <div className="rounded-2xl border p-4" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Trie (Prefix Tree)
          </span>
          {step.targetWord && (
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: colors.bg, color: colors.accent }}>
              "{step.targetWord}"
            </span>
          )}
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        <svg viewBox="0 0 580 300" className="w-full h-[300px]" style={{ background: colors.bg, borderRadius: 10 }}>
          {/* Edges */}
          {positions.map((pos) => {
            const parentId = parentMap.get(pos.id)
            if (!parentId) return null
            const parentPos = positionMap.get(parentId)
            if (!parentPos) return null

            return (
              <line
                key={`edge-${pos.id}`}
                x1={parentPos.x}
                y1={parentPos.y + 18}
                x2={pos.x}
                y2={pos.y - 18}
                stroke={colors.border}
                strokeWidth={1.5}
                opacity={0.5}
              />
            )
          })}

          {/* Nodes */}
          {positions.map((pos) => {
            const node = allNodes.get(pos.id)
            const isHighlighted = pos.id === step.highlightedNodeId

            return (
              <g key={pos.id}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  fill={getNodeColor(pos.id)}
                  stroke={node?.isEnd ? colors.accent : colors.border}
                  strokeWidth={node?.isEnd ? 3 : 1.5}
                  animate={{ scale: isHighlighted ? 1.15 : 1 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHighlighted ? colors.bg : colors.text}
                  fontSize={12}
                  fontWeight={700}
                  fontFamily="monospace"
                >
                  {pos.char === 'root' ? 'O' : pos.char}
                </text>
                {node?.isEnd && (
                  <circle cx={pos.x + 12} cy={pos.y - 12} r={5} fill={colors.accent} />
                )}
              </g>
            )
          })}
        </svg>

        <div className="flex flex-wrap gap-4 justify-center mt-3 text-xs" style={{ color: colors.textMuted }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.current }} />
            <span>Navegando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: colors.accent }} />
            <span>Fim de palavra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.accent }} />
            <span>Encontrado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.warning }} />
            <span>Nao encontrado</span>
          </div>
        </div>

        {/* Result display */}
        <AnimatePresence>
          {step.result !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center p-3 rounded-xl"
              style={{
                background: step.result ? `${colors.accent}20` : `${colors.warning}20`,
                border: `1px solid ${step.result ? colors.accent : colors.warning}`,
              }}
            >
              <span className="font-bold" style={{ color: step.result ? colors.accent : colors.warning }}>
                {step.result ? 'Encontrado!' : 'Nao encontrado'}
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
                Operacoes Concluidas
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current path */}
      {step.currentPath && (
        <div className="rounded-xl border p-3" style={{ background: colors.surface, borderColor: colors.border }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
            Caminho Atual
          </div>
          <div className="flex gap-1 justify-center">
            {step.currentPath.split('').map((char, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-8 h-8 rounded flex items-center justify-center font-mono font-bold"
                style={{ background: colors.accent, color: colors.bg }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
      )}

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
