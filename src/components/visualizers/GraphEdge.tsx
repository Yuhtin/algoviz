// src/components/visualizers/GraphEdge.tsx
'use client'

import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

export type EdgeState = 'default' | 'highlighted' | 'relaxed' | 'path'

interface GraphEdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  weight?: number
  state: EdgeState
}

const stateStyles: Record<EdgeState, { stroke: string; strokeWidth: number; opacity: number }> = {
  default: {
    stroke: colors.border,
    strokeWidth: 1.5,
    opacity: 0.5,
  },
  highlighted: {
    stroke: colors.current,
    strokeWidth: 2.5,
    opacity: 1,
  },
  relaxed: {
    stroke: colors.accent,
    strokeWidth: 2.5,
    opacity: 1,
  },
  path: {
    stroke: colors.accent,
    strokeWidth: 3,
    opacity: 1,
  },
}

export function GraphEdge({ x1, y1, x2, y2, weight, state }: GraphEdgeProps) {
  const style = stateStyles[state]
  const isActive = state === 'highlighted' || state === 'relaxed'

  // Calculate midpoint for weight label
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  // Calculate angle for proper label positioning
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const offsetX = Math.sin(angle) * 10
  const offsetY = -Math.cos(angle) * 10

  // Shorten line to not overlap with nodes (smaller radius now)
  const nodeRadius = 22
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)

  if (len === 0) return null

  const ratio = nodeRadius / len

  const startX = x1 + dx * ratio
  const startY = y1 + dy * ratio
  const endX = x2 - dx * ratio
  const endY = y2 - dy * ratio

  return (
    <g>
      {/* Edge glow for highlighted/relaxed */}
      {isActive && (
        <motion.line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={style.stroke}
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          style={{ filter: 'blur(3px)' }}
        />
      )}

      {/* Main edge line */}
      <motion.line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        strokeLinecap="round"
        initial={false}
        animate={{
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          opacity: style.opacity,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Weight label background (only if weight is provided) */}
      {weight !== undefined && (
        <rect
          x={midX + offsetX - 10}
          y={midY + offsetY - 8}
          width={20}
          height={16}
          rx={4}
          fill={isActive ? style.stroke : colors.bg}
          opacity={0.9}
        />
      )}

      {/* Weight label (only if weight is provided) */}
      {weight !== undefined && (
        <text
          x={midX + offsetX}
          y={midY + offsetY + 4}
          textAnchor="middle"
          fill={isActive ? colors.bg : colors.textMuted}
          fontSize={10}
          fontWeight={600}
          fontFamily="monospace"
          style={{ userSelect: 'none' }}
        >
          {weight}
        </text>
      )}
    </g>
  )
}
