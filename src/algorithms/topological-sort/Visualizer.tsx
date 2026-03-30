// src/algorithms/topological-sort/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type GraphData } from './engine'

interface NodePosition {
  id: string
  x: number
  y: number
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode
  target: string | SimNode
}

function useForceLayout(
  nodes: string[],
  edges: [string, string][],
  width: number,
  height: number
): NodePosition[] {
  const [positions, setPositions] = useState<NodePosition[]>([])

  useEffect(() => {
    if (nodes.length === 0) return

    const simNodes: SimNode[] = nodes.map((id) => ({ id }))
    const simLinks: SimLink[] = edges.map(([source, target]) => ({ source, target }))

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(90).strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45))

    simulation.on('tick', () => {
      const padding = 50
      const newPositions = simulation.nodes().map((node) => ({
        id: node.id,
        x: Math.max(padding, Math.min(width - padding, node.x ?? width / 2)),
        y: Math.max(padding, Math.min(height - padding, node.y ?? height / 2)),
      }))
      setPositions(newPositions)
    })

    simulation.alpha(1).restart()
    setTimeout(() => simulation.stop(), 2000)

    return () => { simulation.stop() }
  }, [nodes, edges, width, height])

  return positions
}

export function TopologicalSortVisualizer() {
  const [graphData, setGraphData] = useState<GraphData>(config.presets[0].data as GraphData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)
  const svgRef = useRef<SVGSVGElement>(null)

  const { steps } = useMemo(() => computeSteps(graphData), [graphData])
  const totalSteps = steps.length
  const step = steps[Math.min(currentStep, totalSteps - 1)]
  const isFinished = currentStep >= totalSteps - 1

  const positions = useForceLayout(graphData.nodes, graphData.edges, 580, 320)

  useEffect(() => {
    if (!isPlaying || isFinished) return
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, isFinished, speed])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  const handlePresetSelect = useCallback((data: GraphData) => {
    setGraphData(data)
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

  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    positions.forEach((p) => map.set(p.id, { x: p.x, y: p.y }))
    return map
  }, [positions])

  const getNodeColor = (nodeId: string) => {
    if (step.currentNode === nodeId) return colors.current
    if (step.result.includes(nodeId)) return colors.accent
    if (step.queue.includes(nodeId)) return colors.visited
    return colors.surfaceLight
  }

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
  }))

  return (
    <div className="space-y-5">
      <Presets
        options={config.presets.map((p) => ({ label: p.label, data: p.data as GraphData }))}
        selected={graphData}
        onSelect={handlePresetSelect}
        compare={(a, b) => JSON.stringify(a.nodes) === JSON.stringify(b.nodes)}
      />

      <div className="rounded-2xl border p-4" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Topological Sort (Kahn)
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        <svg ref={svgRef} viewBox="0 0 580 320" className="w-full h-[320px]" style={{ background: colors.bg, borderRadius: 10 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={colors.border} />
            </marker>
            <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={colors.current} />
            </marker>
          </defs>

          {/* Directed edges */}
          {graphData.edges.map(([from, to], i) => {
            const fromPos = positionMap.get(from)
            const toPos = positionMap.get(to)
            if (!fromPos || !toPos) return null

            const isHighlighted = step.highlightedEdge?.[0] === from && step.highlightedEdge?.[1] === to
            const dx = toPos.x - fromPos.x
            const dy = toPos.y - fromPos.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const nodeRadius = 22
            const ratio = nodeRadius / len
            const startX = fromPos.x + dx * ratio
            const startY = fromPos.y + dy * ratio
            const endX = toPos.x - dx * ratio * 1.5
            const endY = toPos.y - dy * ratio * 1.5

            return (
              <line
                key={`${from}-${to}-${i}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isHighlighted ? colors.current : colors.border}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                opacity={isHighlighted ? 1 : 0.5}
                markerEnd={isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
              />
            )
          })}

          {/* Nodes */}
          {graphData.nodes.map((nodeId) => {
            const pos = positionMap.get(nodeId)
            if (!pos) return null
            const inDeg = step.inDegree.get(nodeId) ?? 0
            const isProcessed = step.result.includes(nodeId)

            return (
              <g key={nodeId}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={20}
                  fill={getNodeColor(nodeId)}
                  stroke={isProcessed ? colors.accent : colors.border}
                  strokeWidth={2}
                  animate={{ scale: step.currentNode === nodeId ? 1.1 : 1 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isProcessed || step.currentNode === nodeId ? colors.bg : colors.text}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                >
                  {nodeId}
                </text>
                {/* In-degree badge */}
                <circle cx={pos.x + 15} cy={pos.y - 15} r={10} fill={colors.surface} stroke={colors.border} strokeWidth={1} />
                <text
                  x={pos.x + 15}
                  y={pos.y - 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={inDeg === 0 ? colors.accent : colors.textMuted}
                  fontSize={10}
                  fontWeight={600}
                >
                  {inDeg}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="flex flex-wrap gap-4 justify-center mt-3 text-xs" style={{ color: colors.textMuted }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.current }} />
            <span>Processando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.accent }} />
            <span>Ordenado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.visited }} />
            <span>Na fila</span>
          </div>
        </div>

        <AnimatePresence>
          {step.queue.length > 0 && !isFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center"
            >
              <span className="text-xs" style={{ color: colors.textMuted }}>Fila: </span>
              <span className="font-mono text-xs" style={{ color: colors.visited }}>[{step.queue.join(', ')}]</span>
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
                {step.result.length === graphData.nodes.length ? 'Ordenacao Concluida' : 'Ciclo Detectado!'}
              </div>
              <div className="text-xs mt-1 font-mono" style={{ color: colors.text }}>
                {step.result.join(' -> ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      <div className="rounded-xl border p-3" style={{ background: colors.surface, borderColor: colors.border }}>
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          Ordem Topologica
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {step.result.map((nodeId, index) => (
            <motion.div
              key={`${nodeId}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm"
              style={{ background: colors.accent, color: colors.bg }}
            >
              <span className="text-xs opacity-60">{index + 1}.</span>
              <span className="font-mono font-bold">{nodeId}</span>
            </motion.div>
          ))}
          {step.result.length === 0 && (
            <span className="text-xs" style={{ color: colors.textMuted }}>Nenhum vertice ordenado ainda</span>
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
