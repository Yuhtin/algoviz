// src/components/controls/Presets.tsx
'use client'

import { colors } from '@/lib/colors'

export interface PresetOption<T> {
  label: string
  data: T
}

interface PresetsProps<T> {
  options: PresetOption<T>[]
  selected: T
  onSelect: (data: T) => void
  compare?: (a: T, b: T) => boolean
}

export function Presets<T>({
  options,
  selected,
  onSelect,
  compare = (a, b) => JSON.stringify(a) === JSON.stringify(b),
}: PresetsProps<T>) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((preset, i) => {
        const isSelected = compare(selected, preset.data)
        return (
          <button
            key={i}
            data-selected={isSelected}
            onClick={() => onSelect(preset.data)}
            className="px-3.5 py-1.5 rounded-md border text-xs font-medium transition-all duration-200"
            style={{
              border: `1px solid ${isSelected ? colors.accent : colors.border}`,
              background: isSelected ? colors.accentGlow : 'transparent',
              color: isSelected ? colors.accent : colors.textMuted,
            }}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
