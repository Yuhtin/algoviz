// src/lib/colors.ts
/**
 * AlgoViz Design System - Semantic Color Palette
 * Updated with green-tinted backgrounds and cream text
 */

export const colors = {
  // Backgrounds (green-tinted)
  bg: '#0a1210',
  surface: '#121a18',
  surfaceLight: '#1a2a28',
  border: '#2a3a38',
  code: '#1a2420',

  // Text (warm cream)
  text: '#e8e6e3',
  textMuted: '#7a8a8a',

  // Semantic (unchanged)
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
