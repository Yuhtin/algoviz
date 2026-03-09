// src/lib/colors.ts
/**
 * AlgoViz Design System - Semantic Color Palette
 */

export const colors = {
  // Backgrounds
  bg: '#0a0a0f',
  surface: '#12121a',
  surfaceLight: '#1a1a2e',
  border: '#2a2a3e',
  code: '#1e1e30',

  // Text
  text: '#e0e0f0',
  textMuted: '#7a7a9a',

  // Semantic
  accent: '#00d4aa',
  accentGlow: '#00d4aa33',
  warning: '#ff6b6b',
  warningGlow: '#ff6b6b33',
  visited: '#6c5ce7',
  visitedGlow: '#6c5ce722',
  current: '#ffd93d',
  currentGlow: '#ffd93d44',

  // Aliases
  positive: '#00d4aa',
  negative: '#ff6b6b',
} as const

export type ColorKey = keyof typeof colors
