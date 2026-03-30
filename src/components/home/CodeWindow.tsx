'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { colors } from '@/lib/colors'

// Simulated bubble sort steps
const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45]

function generateSortSteps(arr: number[]) {
  const steps: { array: number[]; comparing: [number, number] | null; swapping: boolean }[] = []
  const array = [...arr]

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      steps.push({ array: [...array], comparing: [j, j + 1], swapping: false })
      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        steps.push({ array: [...array], comparing: [j, j + 1], swapping: true })
      }
    }
  }
  steps.push({ array: [...array], comparing: null, swapping: false })
  return steps
}

const SORT_STEPS = generateSortSteps(INITIAL_ARRAY)

const CODE_LINES = [
  { text: 'def bubble_sort(arr):', color: colors.accent },
  { text: '    n = len(arr)', color: colors.textMuted },
  { text: '    for i in range(n):', color: colors.textMuted },
  { text: '        for j in range(0, n-i-1):', color: colors.textMuted },
  { text: '            if arr[j] > arr[j+1]:', color: colors.current, highlight: true },
  { text: '                arr[j], arr[j+1] = arr[j+1], arr[j]', color: colors.warning, highlight: true },
  { text: '    return arr', color: colors.textMuted },
]

export function CodeWindow() {
  const [stepIndex, setStepIndex] = useState(0)
  const [activeCodeLine, setActiveCodeLine] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = (prev + 1) % SORT_STEPS.length
        // Update active code line based on step
        const step = SORT_STEPS[next]
        if (step.swapping) {
          setActiveCodeLine(5)
        } else if (step.comparing) {
          setActiveCodeLine(4)
        } else {
          setActiveCodeLine(6)
        }
        return next
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const currentStep = SORT_STEPS[stepIndex]
  const maxValue = Math.max(...INITIAL_ARRAY)

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
      style={{
        backgroundColor: '#1e1e1e',
        border: `1px solid ${colors.border}`,
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: '#323233', borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-mono" style={{ color: colors.textMuted }}>
            bubble_sort.py — AlgoViz
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex"
        style={{ backgroundColor: '#252526', borderBottom: `1px solid ${colors.border}` }}
      >
        <div
          className="px-4 py-2 text-sm font-mono flex items-center gap-2"
          style={{ backgroundColor: '#1e1e1e', color: colors.text, borderRight: `1px solid ${colors.border}` }}
        >
          <span style={{ color: '#6d8a88' }}>🐍</span>
          bubble_sort.py
        </div>
        <div
          className="px-4 py-2 text-sm font-mono"
          style={{ color: colors.textMuted }}
        >
          visualization.tsx
        </div>
      </div>

      {/* Content area - split view */}
      <div className="flex flex-col md:flex-row">
        {/* Code panel */}
        <div className="flex-1 p-4 font-mono text-sm overflow-hidden" style={{ minHeight: 240 }}>
          {/* Line numbers + code */}
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              className="flex transition-all duration-200"
              style={{
                backgroundColor: activeCodeLine === i ? `${colors.accent}15` : 'transparent',
                borderLeft: activeCodeLine === i ? `2px solid ${colors.accent}` : '2px solid transparent',
              }}
            >
              <span
                className="w-8 text-right pr-3 select-none"
                style={{ color: colors.textMuted }}
              >
                {i + 1}
              </span>
              <span style={{ color: line.color }}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Visualization panel */}
        <div
          className="flex-1 p-6 flex flex-col items-center justify-center"
          style={{
            backgroundColor: '#252526',
            borderLeft: `1px solid ${colors.border}`,
            minHeight: 240,
          }}
        >
          {/* Array visualization */}
          <div className="flex items-end gap-1 h-32 mb-4">
            {currentStep.array.map((value, i) => {
              const isComparing = currentStep.comparing?.includes(i)
              const height = (value / maxValue) * 100

              let barColor: string = colors.textMuted
              if (isComparing && currentStep.swapping) {
                barColor = colors.warning
              } else if (isComparing) {
                barColor = colors.accent
              }

              return (
                <motion.div
                  key={i}
                  className="w-8 rounded-t-sm"
                  style={{ backgroundColor: barColor }}
                  animate={{ height: `${height}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )
            })}
          </div>

          {/* Array values */}
          <div className="flex gap-1 font-mono text-xs" style={{ color: colors.textMuted }}>
            {currentStep.array.map((value, i) => (
              <div key={i} className="w-8 text-center">
                {value}
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="mt-4 text-sm font-mono" style={{ color: colors.accent }}>
            {currentStep.comparing
              ? currentStep.swapping
                ? `Trocando: arr[${currentStep.comparing[0]}] ↔ arr[${currentStep.comparing[1]}]`
                : `Comparando: arr[${currentStep.comparing[0]}] > arr[${currentStep.comparing[1]}]?`
              : '✓ Array ordenado!'
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}
