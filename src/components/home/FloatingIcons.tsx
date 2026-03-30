'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { colors } from '@/lib/colors'

// Icon definitions by category
const ICONS = {
  languages: [
    { content: '🐍', type: 'emoji' },
    { content: 'JS', type: 'text', color: '#f7df1e' },
    { content: 'TS', type: 'text', color: '#3178c6' },
    { content: 'Rust', type: 'text', color: colors.warning },
    { content: 'Go', type: 'text', color: colors.accent },
    { content: 'Java', type: 'text', color: '#ed8b00' },
  ],
  symbols: [
    { content: '{ }', type: 'code' },
    { content: '[ ]', type: 'code' },
    { content: '=>', type: 'code' },
    { content: '</>', type: 'code' },
    { content: '&&', type: 'code' },
    { content: '::', type: 'code' },
  ],
  notation: [
    { content: 'O(n)', type: 'notation' },
    { content: 'O(log n)', type: 'notation' },
    { content: 'O(1)', type: 'notation' },
    { content: 'BFS', type: 'notation' },
    { content: 'DFS', type: 'notation' },
  ],
  shapes: [
    { content: 'tree', type: 'svg' },
    { content: 'graph', type: 'svg' },
    { content: 'array', type: 'svg' },
  ],
}

// SVG shapes
function MiniTree() {
  return (
    <svg width="40" height="35" viewBox="0 0 40 35">
      <circle cx="20" cy="6" r="4" fill={colors.accent} />
      <circle cx="10" cy="25" r="3" fill={colors.visited} />
      <circle cx="30" cy="25" r="3" fill={colors.visited} />
      <line x1="20" y1="10" x2="10" y2="22" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="20" y1="10" x2="30" y2="22" stroke={colors.textMuted} strokeWidth="1.5" />
    </svg>
  )
}

function MiniGraph() {
  return (
    <svg width="45" height="35" viewBox="0 0 45 35">
      <circle cx="8" cy="17" r="4" fill={colors.current} />
      <circle cx="22" cy="6" r="4" fill={colors.accent} />
      <circle cx="22" cy="28" r="4" fill={colors.accent} />
      <circle cx="37" cy="17" r="4" fill={colors.warning} />
      <line x1="12" y1="15" x2="18" y2="8" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="12" y1="19" x2="18" y2="26" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="26" y1="8" x2="33" y2="15" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="26" y1="26" x2="33" y2="19" stroke={colors.textMuted} strokeWidth="1.5" />
    </svg>
  )
}

function MiniArray() {
  return (
    <div className="flex gap-0.5 items-end">
      <div className="w-3 h-5 rounded-sm" style={{ backgroundColor: colors.warning }} />
      <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: colors.accent }} />
      <div className="w-3 h-4 rounded-sm" style={{ backgroundColor: colors.visited }} />
      <div className="w-3 h-7 rounded-sm" style={{ backgroundColor: colors.current }} />
    </div>
  )
}

type AnimationType = 'float' | 'parallax' | 'pulse'

interface FloatingIconProps {
  icon: typeof ICONS.languages[0] | typeof ICONS.symbols[0] | typeof ICONS.notation[0] | typeof ICONS.shapes[0]
  position: { x: number; y: number }
  size: number
  opacity: number
  animation: AnimationType
  delay: number
}

function FloatingIcon({ icon, position, size, opacity, animation, delay }: FloatingIconProps) {
  // Use deterministic random based on position for consistent animations
  const seed = position.x + position.y
  const randomOffset = (seed % 10) / 10

  const getAnimateProps = () => {
    const base = { opacity, scale: 1 }

    if (animation === 'float') {
      // Much more dramatic movement
      return {
        ...base,
        y: [0, -25 - randomOffset * 15, 0],
        x: [0, 10 + randomOffset * 10, 0],
        rotate: [-8, 8, -8],
        scale: [1, 1.05, 1],
      }
    }

    if (animation === 'pulse') {
      return {
        ...base,
        opacity: [opacity, Math.min(opacity * 2, 0.6), opacity],
        scale: [1, 1.1, 1],
      }
    }

    // parallax - gentle drift
    return {
      ...base,
      y: [0, -15, 0],
      rotate: [-5, 5, -5],
    }
  }

  const getTransition = () => {
    const base = { delay, duration: 0.8 }

    if (animation === 'float') {
      const duration = 4 + randomOffset * 3
      return {
        ...base,
        y: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        x: { duration: duration * 1.3, repeat: Infinity, ease: 'easeInOut' as const },
        rotate: { duration: duration * 1.5, repeat: Infinity, ease: 'easeInOut' as const },
        scale: { duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' as const },
      }
    }

    if (animation === 'pulse') {
      const duration = 3 + randomOffset * 2
      return {
        ...base,
        opacity: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        scale: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' as const },
      }
    }

    // parallax
    const duration = 5 + randomOffset * 3
    return {
      ...base,
      y: { duration, repeat: Infinity, ease: 'easeInOut' as const },
      rotate: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' as const },
    }
  }

  const renderContent = () => {
    if (icon.type === 'emoji') {
      return <span style={{ fontSize: size }}>{icon.content}</span>
    }
    if (icon.type === 'text') {
      return (
        <span
          className="font-mono font-bold"
          style={{ fontSize: size * 0.7, color: 'color' in icon ? icon.color : colors.accent }}
        >
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'code') {
      return (
        <span className="font-mono" style={{ fontSize: size * 0.8, color: colors.accent }}>
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'notation') {
      return (
        <span className="font-serif italic" style={{ fontSize: size * 0.7, color: colors.current }}>
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'svg') {
      if (icon.content === 'tree') return <MiniTree />
      if (icon.content === 'graph') return <MiniGraph />
      if (icon.content === 'array') return <MiniArray />
    }
    return null
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={getAnimateProps()}
      transition={getTransition()}
    >
      {renderContent()}
    </motion.div>
  )
}

interface Props {
  count?: number
  className?: string
}

export function FloatingIcons({ count = 18, className = '' }: Props) {
  const icons = useMemo(() => {
    const allIcons = [
      ...ICONS.languages,
      ...ICONS.symbols,
      ...ICONS.notation,
      ...ICONS.shapes,
    ]

    const animations: AnimationType[] = ['float', 'float', 'float', 'parallax', 'pulse']

    // Create a grid-based distribution to avoid clustering
    const cols = Math.ceil(Math.sqrt(count * 1.5))
    const rows = Math.ceil(count / cols)
    const cellWidth = 100 / cols
    const cellHeight = 100 / rows

    return Array.from({ length: count }, (_, i) => {
      const icon = allIcons[i % allIcons.length]
      const animation = animations[i % animations.length] // Deterministic animation assignment

      // Grid position with randomness within cell
      const col = i % cols
      const row = Math.floor(i / cols)

      // Position with jitter within grid cell, avoiding center area
      let x = col * cellWidth + (cellWidth * 0.2) + (Math.random() * cellWidth * 0.6)
      let y = row * cellHeight + (cellHeight * 0.2) + (Math.random() * cellHeight * 0.6)

      // Push icons away from center (where text is)
      const centerX = 50
      const centerY = 45
      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      if (distFromCenter < 25) {
        // Push outward from center
        const angle = Math.atan2(y - centerY, x - centerX)
        x = centerX + Math.cos(angle) * 30
        y = centerY + Math.sin(angle) * 30
      }

      return {
        id: i,
        icon,
        position: { x, y },
        size: 18 + (i % 5) * 4, // 18-34px, deterministic variety
        opacity: 0.15 + (i % 4) * 0.1, // 0.15-0.45, subtle but visible
        animation,
        delay: (i % 8) * 0.15, // Staggered entrance
      }
    })
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {icons.map((props) => (
        <FloatingIcon key={props.id} {...props} />
      ))}
    </div>
  )
}
