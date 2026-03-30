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
  const getAnimateProps = () => {
    const base = { opacity, scale: 1 }

    if (animation === 'float') {
      return {
        ...base,
        y: [0, -10, 0],
        rotate: [-3, 3, -3],
      }
    }

    if (animation === 'pulse') {
      return {
        ...base,
        opacity: [opacity, opacity * 1.5, opacity],
      }
    }

    // parallax - handled by scroll, just return base
    return base
  }

  const getTransition = () => {
    const base = { delay, duration: 0.5 }

    if (animation === 'float') {
      return {
        ...base,
        y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' as const },
        rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' as const },
      }
    }

    if (animation === 'pulse') {
      return {
        ...base,
        opacity: { duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' as const },
      }
    }

    return base
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

export function FloatingIcons({ count = 25, className = '' }: Props) {
  const icons = useMemo(() => {
    const allIcons = [
      ...ICONS.languages,
      ...ICONS.symbols,
      ...ICONS.notation,
      ...ICONS.shapes,
    ]

    const animations: AnimationType[] = ['float', 'float', 'parallax', 'parallax', 'pulse']

    return Array.from({ length: count }, (_, i) => {
      const icon = allIcons[i % allIcons.length]
      const animation = animations[Math.floor(Math.random() * animations.length)]

      return {
        id: i,
        icon,
        position: {
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 90,
        },
        size: 16 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.3,
        animation,
        delay: Math.random() * 0.5,
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
