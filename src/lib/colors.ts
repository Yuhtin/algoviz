/**
 * AlgoViz Design System - Semantic Color Palette
 *
 * Colors have fixed meaning across the platform
 */

export const colors = {
  /** Success / Target / Positive - Destination element, True result */
  success: '#00D4AA',

  /** Visited / Processed - Already traversed nodes */
  visited: '#6C5CE7',

  /** Current / Active - Current pointer, active element */
  active: '#FFD93D',

  /** Error / Negative / Removal - False result, conflict */
  error: '#FF6B6B',

  /** Background - Main background */
  background: '#0A0A0F',

  /** Surface - Cards, panels */
  surface: '#1A1A2E',

  /** Text primary */
  textPrimary: '#FFFFFF',

  /** Text secondary */
  textSecondary: '#A0A0B0',
} as const

export type ColorKey = keyof typeof colors
