// src/components/controls/StepController.tsx
'use client'

import { colors } from '@/lib/colors'

interface StepControllerProps {
  isPlaying: boolean
  isFinished: boolean
  canGoBack: boolean
  canGoForward: boolean
  speed: number
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
}

export function StepController({
  isPlaying,
  isFinished,
  canGoBack,
  canGoForward,
  speed,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
}: StepControllerProps) {
  const buttonBase = "px-4 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200 font-mono disabled:cursor-default"

  const playButtonLabel = isPlaying ? '⏸ Pausar' : isFinished ? '↻ Replay' : '▶ Play'

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPlayPause}
        className={buttonBase}
        style={{
          border: `1px solid ${colors.accent}`,
          background: isPlaying ? colors.accentGlow : 'transparent',
          color: colors.accent,
        }}
      >
        {playButtonLabel}
      </button>

      <button
        onClick={onPrev}
        disabled={!canGoBack}
        className={buttonBase}
        style={{
          border: `1px solid ${colors.border}`,
          background: 'transparent',
          color: canGoBack ? colors.textMuted : colors.border,
        }}
      >
        ← Anterior
      </button>

      <button
        onClick={onNext}
        disabled={!canGoForward}
        className={buttonBase}
        style={{
          border: `1px solid ${colors.border}`,
          background: 'transparent',
          color: canGoForward ? colors.textMuted : colors.border,
        }}
      >
        Proximo →
      </button>

      <button
        onClick={onReset}
        className={buttonBase}
        style={{
          border: `1px solid ${colors.border}`,
          background: 'transparent',
          color: colors.textMuted,
        }}
      >
        Reset
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs" style={{ color: colors.textMuted }}>
          Velocidade:
        </span>
        <input
          type="range"
          min={300}
          max={2000}
          step={100}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-24"
          style={{ accentColor: colors.accent }}
        />
        <span className="text-xs font-mono" style={{ color: colors.accent }}>
          {speed}ms
        </span>
      </div>
    </div>
  )
}
