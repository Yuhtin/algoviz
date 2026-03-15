// src/components/layout/AlgorithmLayout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { colors } from '@/lib/colors'

interface AlgorithmLayoutProps {
  name: string
  description: string
  difficulty: 'Fácil' | 'Média' | 'Difícil'
  complexity: { time: string; space: string }
  tags: string[]
  children: React.ReactNode
  codePanel?: React.ReactNode
  explanationPanel?: React.ReactNode
}

const difficultyColors = {
  'Fácil': colors.accent,
  'Média': colors.current,
  'Difícil': colors.warning,
}

export function AlgorithmLayout({
  name,
  description,
  difficulty,
  complexity,
  tags,
  children,
  codePanel,
  explanationPanel,
}: AlgorithmLayoutProps) {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'explanation'>('visualizer')

  const tabs = [
    { id: 'visualizer' as const, label: 'Visualizador' },
    ...(explanationPanel ? [{ id: 'explanation' as const, label: 'Explicacao' }] : []),
    ...(codePanel ? [{ id: 'code' as const, label: 'Codigo' }] : []),
  ]

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text }}>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-10 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs mb-6 transition-colors hover:opacity-80"
          style={{ color: colors.textMuted }}
        >
          ← Voltar
        </Link>

        <div className="flex items-center gap-3 mb-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: colors.accent, boxShadow: `0 0 12px ${colors.accent}` }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            Algoritmo
          </span>
        </div>

        <h1
          className="text-4xl font-bold tracking-tight mb-1"
          style={{ color: colors.accent }}
        >
          {name}
        </h1>

        <p className="text-sm max-w-2xl mb-4" style={{ color: colors.textMuted }}>
          {description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="px-2.5 py-1 rounded text-xs font-medium"
            style={{
              background: `${difficultyColors[difficulty]}22`,
              color: difficultyColors[difficulty],
              border: `1px solid ${difficultyColors[difficulty]}44`,
            }}
          >
            {difficulty}
          </span>
          <span
            className="px-2.5 py-1 rounded text-xs font-mono"
            style={{
              background: `${colors.visited}22`,
              color: colors.visited,
              border: `1px solid ${colors.visited}44`,
            }}
          >
            {complexity.time} / {complexity.space}
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded text-xs"
              style={{
                background: colors.surfaceLight,
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto mt-5 px-10">
        <div className="flex gap-0" style={{ borderBottom: `1px solid ${colors.border}` }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${colors.accent}` : '2px solid transparent',
                color: activeTab === tab.id ? colors.accent : colors.textMuted,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-10 py-6">
        {activeTab === 'visualizer' && children}
        {activeTab === 'code' && codePanel}
        {activeTab === 'explanation' && explanationPanel}
      </div>
    </div>
  )
}
