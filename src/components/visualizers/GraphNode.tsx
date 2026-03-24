// src/components/visualizers/GraphNode.tsx
'use client'

import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

export type NodeState = 'default' | 'current' | 'visited' | 'queued' | 'target'

interface GraphNodeProps {
  id: string
  x: number
  y: number
  state: NodeState
  distance?: number
  isStart?: boolean
  badge?: string
}

const stateStyles: Record<NodeState, { bg: string; border: string; glow: string }> = {
  default: {
    bg: colors.surfaceLight,
    border: colors.border,
    glow: 'transparent',
  },
  current: {
    bg: colors.current,
    border: colors.current,
    glow: colors.current,
  },
  visited: {
    bg: colors.accent,
    border: colors.accent,
    glow: colors.accent,
  },
  queued: {
    bg: `${colors.visited}44`,
    border: colors.visited,
    glow: 'transparent',
  },
  target: {
    bg: `${colors.warning}66`,
    border: colors.warning,
    glow: colors.warning,
  },
}

export function GraphNode({ id, x, y, state, distance, isStart, badge }: GraphNodeProps) {
  const style = stateStyles[state]
  const isCurrent = state === 'current'
  const isVisited = state === 'visited'
  const isActive = isCurrent || isVisited

  // Smaller node radius
  const nodeRadius = 20

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: isCurrent ? 1.1 : 1,
        x,
        y,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glow effect for active states */}
      {isActive && (
        <motion.circle
          r={nodeRadius + 8}
          fill="none"
          stroke={style.glow}
          strokeWidth={3}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          style={{ filter: 'blur(6px)' }}
        />
      )}

      {/* Main circle */}
      <motion.circle
        r={nodeRadius}
        fill={style.bg}
        stroke={style.border}
        strokeWidth={2.5}
        animate={{
          fill: style.bg,
          stroke: style.border,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Node label */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isActive ? colors.bg : colors.text}
        fontSize={14}
        fontWeight={700}
        fontFamily="monospace"
        style={{ userSelect: 'none' }}
      >
        {id}
      </text>

      {/* Distance/Badge - positioned below node (only if distance or badge provided) */}
      {(distance !== undefined || badge) && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <rect
            x={-16}
            y={nodeRadius + 6}
            width={32}
            height={18}
            rx={4}
            fill={isVisited ? colors.accent : colors.surface}
            stroke={isVisited ? colors.accent : colors.border}
            strokeWidth={1}
          />
          <text
            y={nodeRadius + 17}
            textAnchor="middle"
            fill={isVisited ? colors.bg : colors.textMuted}
            fontSize={11}
            fontWeight={600}
            fontFamily="monospace"
            style={{ userSelect: 'none' }}
          >
            {badge ?? (distance === Infinity ? '∞' : distance)}
          </text>
        </motion.g>
      )}

      {/* Start indicator */}
      {isStart && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <circle
            cx={14}
            cy={-14}
            r={8}
            fill={colors.accent}
            stroke={colors.bg}
            strokeWidth={1}
          />
          <text
            x={14}
            y={-11}
            textAnchor="middle"
            fill={colors.bg}
            fontSize={9}
            fontWeight={700}
            style={{ userSelect: 'none' }}
          >
            S
          </text>
        </motion.g>
      )}
    </motion.g>
  )
}
