// src/algorithms/bfs/Visualizer.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3'
import { StepController } from '@/components/controls/StepController'
import { StepLog, type LogEntry } from '@/components/controls/StepLog'
import { Presets } from '@/components/controls/Presets'
import { GraphNode, type NodeState } from '@/components/visualizers/GraphNode'
import { GraphEdge, type EdgeState } from '@/components/visualizers/GraphEdge'
import { colors } from '@/lib/colors'
import { config } from './config'
import { computeSteps, type GraphData, type BFSStep } from './engine'

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

    const density = edges.length / (nodes.length * (nodes.length - 1) / 2)
    const linkDistance = density > 0.5 ? 80 : 100
    const chargeStrength = density > 0.5 ? -200 : -300

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))

    simulation.on('tick', () => {
      const padding = 45
      const newPositions = simulation.nodes().map((node) => ({
        id: node.id,
        x: Math.max(padding, Math.min(width - padding, node.x ?? width / 2)),
        y: Math.max(padding, Math.min(height - padding, node.y ?? height / 2)),
      }))
      setPositions(newPositions)
    })

    simulation.alpha(1).restart()
    setTimeout(() => simulation.stop(), 2000)

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, width, height])

  return positions
}

export function BFSVisualizer() {
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

  const handlePresetSelect = useCallback(
    (data: GraphData) => {
      setGraphData(data)
      reset()
    },
    [reset]
  )

  const handlePlayPause = useCallback(() => {
    if (isFinished) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }, [isFinished, isPlaying])

  const getNodeState = (nodeId: string): NodeState => {
    if (step.currentNode === nodeId) return 'current'
    if (step.targetNode === nodeId) return 'target'
    if (step.visitOrder.includes(nodeId)) return 'visited'
    if (step.visited.has(nodeId)) return 'queued'
    return 'default'
  }

  const getEdgeState = (from: string, to: string): EdgeState => {
    if (
      step.highlightedEdge &&
      ((step.highlightedEdge[0] === from && step.highlightedEdge[1] === to) ||
        (step.highlightedEdge[0] === to && step.highlightedEdge[1] === from))
    ) {
      return step.type === 'enqueue' ? 'relaxed' : 'highlighted'
    }
    return 'default'
  }

  const logEntries: LogEntry[] = steps.slice(0, currentStep + 1).map((s, i) => ({
    step: i,
    description: s.description,
  }))

  const positionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    positions.forEach((p) => map.set(p.id, { x: p.x, y: p.y }))
    return map
  }, [positions])

  return (
    <div className="space-y-5">
      {/* Presets */}
      <Presets
        options={config.presets.map((p) => ({ label: p.label, data: p.data as GraphData }))}
        selected={graphData}
        onSelect={handlePresetSelect}
        compare={(a, b) => JSON.stringify(a.nodes) === JSON.stringify(b.nodes)}
      />

      {/* Main Visualization */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            BFS - Busca em Largura
          </span>
          <span className="text-xs font-mono" style={{ color: colors.accent }}>
            Inicio: {graphData.start}
          </span>
          <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
            Passo {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </span>
        </div>

        {/* Graph SVG */}
        <svg
          ref={svgRef}
          viewBox="0 0 580 320"
          className="w-full h-[320px]"
          style={{ background: colors.bg, borderRadius: 10 }}
        >
          {/* Edges */}
          <g>
            {graphData.edges.map(([from, to], i) => {
              const fromPos = positionMap.get(from)
              const toPos = positionMap.get(to)
              if (!fromPos || !toPos) return null

              return (
                <GraphEdge
                  key={`${from}-${to}-${i}`}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  state={getEdgeState(from, to)}
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g>
            {graphData.nodes.map((nodeId) => {
              const pos = positionMap.get(nodeId)
              if (!pos) return null

              const distance = step.distances.get(nodeId)

              return (
                <GraphNode
                  key={nodeId}
                  id={nodeId}
                  x={pos.x}
                  y={pos.y}
                  state={getNodeState(nodeId)}
                  distance={distance}
                  isStart={nodeId === graphData.start}
                />
              )
            })}
          </g>
        </svg>

        {/* Legend */}
        <div
          className="flex flex-wrap gap-4 justify-center mt-3 text-xs"
          style={{ color: colors.textMuted }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.current }} />
            <span>Processando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.accent }} />
            <span>Visitado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: colors.visited, background: `${colors.visited}44` }} />
            <span>Na fila</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors.warning }} />
            <span>Explorando</span>
          </div>
        </div>

        {/* Queue */}
        <AnimatePresence>
          {step.queue.length > 0 && !isFinished && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-center overflow-hidden"
            >
              <span className="text-xs" style={{ color: colors.textMuted }}>
                Fila:{' '}
              </span>
              <span className="font-mono text-xs" style={{ color: colors.visited }}>
                [{step.queue.join(', ')}]
              </span>
              <span className="text-xs ml-2" style={{ color: colors.textMuted }}>
                (frente a esquerda)
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result banner */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 rounded-xl mt-3"
              style={{
                background: `${colors.accent}15`,
                border: `1px solid ${colors.accent}33`,
              }}
            >
              <div className="text-sm font-bold" style={{ color: colors.accent }}>
                BFS Concluido
              </div>
              <div className="text-xs mt-1 font-mono" style={{ color: colors.text }}>
                Ordem: {step.visitOrder.join(' -> ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Distance Table */}
      <div
        className="rounded-xl border p-3"
        style={{ background: colors.surface, borderColor: colors.border }}
      >
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          Distancias
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {graphData.nodes.map((nodeId) => {
            const dist = step.distances.get(nodeId)
            const isVisited = step.visitOrder.includes(nodeId)
            const isCurrent = step.currentNode === nodeId

            return (
              <motion.div
                key={nodeId}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-sm"
                style={{
                  background: isCurrent
                    ? colors.current
                    : isVisited
                      ? colors.accent
                      : colors.surfaceLight,
                  borderColor: isCurrent
                    ? colors.current
                    : isVisited
                      ? colors.accent
                      : colors.border,
                  color: isCurrent || isVisited ? colors.bg : colors.text,
                }}
                animate={{ scale: isCurrent ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-mono font-bold">{nodeId}</span>
                <span className="opacity-60">=</span>
                <span className="font-mono">{dist !== undefined ? dist : '-'}</span>
              </motion.div>
            )
          })}
        </div>
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
