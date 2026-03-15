// src/app/algoritmos/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { GamificationBadge } from '@/components/gamification/GamificationBadge'
import { useProgressStore } from '@/stores/progress-store'
import { getAllAlgorithms, getAlgorithmsByCategory, categoryInfo, type Category } from '@/lib/algorithms'
import { colors } from '@/lib/colors'

const difficultyColors = {
  'Fácil': colors.accent,
  'Média': colors.current,
  'Difícil': colors.warning,
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

type ViewMode = 'modules' | 'list'

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('modules')
  const [search, setSearch] = useState('')
  const algorithms = getAllAlgorithms()
  const groupedAlgorithms = getAlgorithmsByCategory()
  const { xp, level, streak, recordActivity } = useProgressStore()

  // Load preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('algoviz-view-mode')
    if (saved === 'modules' || saved === 'list') {
      setViewMode(saved)
    }
    recordActivity()
  }, [recordActivity])

  // Save preference to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('algoviz-view-mode', mode)
  }

  const filteredAlgorithms = useMemo(() => {
    if (!search.trim()) return algorithms
    const query = search.toLowerCase()
    return algorithms.filter(
      (algo) =>
        algo.name.toLowerCase().includes(query) ||
        algo.description.toLowerCase().includes(query) ||
        algo.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [algorithms, search])

  const filteredGrouped = useMemo(() => {
    if (!search.trim()) return groupedAlgorithms
    const query = search.toLowerCase()
    const result: Partial<Record<Category, typeof algorithms>> = {}

    for (const [category, algos] of Object.entries(groupedAlgorithms)) {
      const filtered = algos?.filter(
        (algo) =>
          algo.name.toLowerCase().includes(query) ||
          algo.description.toLowerCase().includes(query) ||
          algo.tags.some((tag) => tag.toLowerCase().includes(query))
      )
      if (filtered && filtered.length > 0) {
        result[category as Category] = filtered
      }
    }

    return result
  }, [groupedAlgorithms, search])

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text }}>
      <Navbar
        rightSlot={
          <GamificationBadge
            xp={xp}
            level={level}
            streak={streak.current}
            bestStreak={streak.best}
          />
        }
      />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-80"
              style={{ color: colors.textMuted }}
            >
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold mb-2">Catalogo de Algoritmos</h1>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {algorithms.length} algoritmos disponiveis
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Buscar algoritmos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />

            {/* View Toggle */}
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: `1px solid ${colors.border}` }}
            >
              <button
                onClick={() => handleViewModeChange('modules')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: viewMode === 'modules' ? colors.accent : colors.surface,
                  color: viewMode === 'modules' ? colors.bg : colors.textMuted,
                }}
              >
                Modulos
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: viewMode === 'list' ? colors.accent : colors.surface,
                  color: viewMode === 'list' ? colors.bg : colors.textMuted,
                }}
              >
                Lista
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'modules' ? (
            <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
              {Object.entries(filteredGrouped).map(([category, algos]) => {
                const info = categoryInfo[category as Category]
                return (
                  <motion.div key={category} variants={fadeIn}>
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ background: `${colors.accent}22`, color: colors.accent }}
                      >
                        {info?.icon || '?'}
                      </div>
                      <div>
                        <h2 className="font-semibold">{info?.name || category}</h2>
                        <p className="text-xs" style={{ color: colors.textMuted }}>
                          {info?.description}
                        </p>
                      </div>
                    </div>

                    {/* Algorithms Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pl-13">
                      {algos?.map((algo) => (
                        <AlgorithmCard key={algo.slug} algo={algo} />
                      ))}
                    </div>
                  </motion.div>
                )
              })}

              {Object.keys(filteredGrouped).length === 0 && (
                <p className="text-center py-8" style={{ color: colors.textMuted }}>
                  Nenhum algoritmo encontrado para "{search}"
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {filteredAlgorithms.map((algo) => (
                <motion.div key={algo.slug} variants={fadeIn}>
                  <AlgorithmCard algo={algo} />
                </motion.div>
              ))}

              {filteredAlgorithms.length === 0 && (
                <p className="col-span-full text-center py-8" style={{ color: colors.textMuted }}>
                  Nenhum algoritmo encontrado para "{search}"
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

interface AlgorithmCardProps {
  algo: {
    slug: string
    name: string
    description: string
    difficulty: 'Fácil' | 'Média' | 'Difícil'
    complexity: { time: string }
  }
}

function AlgorithmCard({ algo }: AlgorithmCardProps) {
  return (
    <Link
      href={`/algoritmos/${algo.slug}`}
      className="block p-4 rounded-xl border transition-all hover:scale-[1.02]"
      style={{ background: colors.surface, borderColor: colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-medium"
          style={{
            background: `${difficultyColors[algo.difficulty]}22`,
            color: difficultyColors[algo.difficulty],
          }}
        >
          {algo.difficulty}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-mono"
          style={{ background: `${colors.visited}22`, color: colors.visited }}
        >
          {algo.complexity.time}
        </span>
      </div>
      <h3 className="font-semibold mb-1">{algo.name}</h3>
      <p className="text-xs line-clamp-2" style={{ color: colors.textMuted }}>
        {algo.description}
      </p>
    </Link>
  )
}
