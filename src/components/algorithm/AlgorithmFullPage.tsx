// src/components/algorithm/AlgorithmFullPage.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { colors } from '@/lib/colors'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useProgressStore } from '@/stores/progress-store'

// Layout & Navigation
import { ReadingProgress } from '@/components/content/ReadingProgress'
import { TableOfContents, type TocSection } from '@/components/navigation/TableOfContents'

// Content Components
import { Section } from '@/components/content/Section'
import { PullQuote } from '@/components/content/PullQuote'
import { Collapsible } from '@/components/content/Collapsible'
import { BigOAnalysis } from '@/components/content/BigOAnalysis'
import { ComparisonTable } from '@/components/content/ComparisonTable'

// Code Components
import { CodeViewer } from '@/components/code/CodeViewer'
import { LanguageTabs } from '@/components/code/LanguageTabs'

// Interview Components
import { QuestionCard } from '@/components/interview/QuestionCard'
import { ChatDrawer } from '@/components/interview/ChatDrawer'

// Gamification
import { GamificationBadge } from '@/components/gamification/GamificationBadge'

// Types
import type { CodeFile } from '@/types/code'
import type { InterviewData } from '@/types/interview'

interface AlgorithmConfig {
  slug: string
  name: string
  description: string
  difficulty: 'Fácil' | 'Média' | 'Difícil'
  complexity: { time: string; space: string }
  tags: string[]
}

interface AlgorithmTheory {
  howItWorks: {
    title: string
    content: string
    steps: string[]
  }
  bigO: {
    time: { notation: string; explanation: string; proof?: string }
    space: { notation: string; explanation: string }
    bestCase?: { notation: string; explanation: string }
    worstCase?: { notation: string; explanation: string }
  }
  comparisons: Array<{
    name: string
    slug?: string
    time: string
    space: string
    stable?: boolean
    bestFor?: string
  }>
  keyInsight: string
  commonMistakes: string[]
}

interface AlgorithmFullPageProps {
  config: AlgorithmConfig
  theory: AlgorithmTheory
  pythonCode: CodeFile
  rustCode: CodeFile
  interview: InterviewData
  Visualizer: React.ComponentType
}

const ALL_SECTIONS: TocSection[] = [
  { id: 'visualizador', label: 'Visualizador' },
  { id: 'como-funciona', label: 'Como Funciona' },
  { id: 'complexidade', label: 'Complexidade' },
  { id: 'comparacoes', label: 'Comparacoes' },
  { id: 'dicas', label: 'Dicas' },
  { id: 'perguntas', label: 'Pratica' },
  { id: 'implementacao', label: 'Codigo' },
]

const difficultyColors = {
  'Fácil': colors.accent,
  'Média': colors.current,
  'Difícil': colors.warning,
}

export function AlgorithmFullPage({
  config,
  theory,
  pythonCode,
  rustCode,
  interview,
  Visualizer,
}: AlgorithmFullPageProps) {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'rust'>('python')
  const [activeConcept, setActiveConcept] = useState<string | null>(null)
  const handleConceptHover = (conceptId: string | null) => setActiveConcept(conceptId)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const sectionIds = ALL_SECTIONS.map(s => s.id)
  const activeSection = useScrollSpy(sectionIds, { updateUrl: true })

  const { xp, level, streak, recordActivity } = useProgressStore()

  useEffect(() => {
    recordActivity()
  }, [recordActivity])

  const currentCode = activeLanguage === 'python' ? pythonCode : rustCode
  const currentQuestion = interview.questions.find(q => q.id === selectedQuestion) || null

  const handleStartChat = (questionId: string) => {
    setSelectedQuestion(questionId)
    setChatOpen(true)
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text }}>
      <ReadingProgress readingTime={8} />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs transition-colors hover:opacity-80"
            style={{ color: colors.textMuted }}
          >
            ← Voltar
          </Link>
          <GamificationBadge
            xp={xp}
            level={level}
            streak={streak.current}
            bestStreak={streak.best}
          />
        </div>

        {/* Title Section */}
        <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: colors.accent }}>
          {config.name}
        </h1>

        <p className="text-base max-w-2xl mb-3" style={{ color: colors.text, lineHeight: 1.75 }}>
          {config.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <span
            className="px-3 py-1.5 rounded text-sm font-medium"
            style={{
              background: `${difficultyColors[config.difficulty]}22`,
              color: difficultyColors[config.difficulty],
              border: `1px solid ${difficultyColors[config.difficulty]}44`,
            }}
          >
            {config.difficulty}
          </span>
          <span
            className="px-3 py-1.5 rounded text-sm font-mono"
            style={{
              background: `${colors.visited}22`,
              color: colors.visited,
              border: `1px solid ${colors.visited}44`,
            }}
          >
            {config.complexity.time} / {config.complexity.space}
          </span>
          {config.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded text-sm"
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

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          <TableOfContents sections={ALL_SECTIONS} activeSection={activeSection} />

          <div className="flex-1 max-w-[680px]">
            <Section id="visualizador" title="Visualizador Interativo">
              <Visualizer />
            </Section>

            <Section id="como-funciona" title={theory.howItWorks.title}>
              <p className="mb-4" style={{ color: colors.text, lineHeight: 1.75 }}>
                {theory.howItWorks.content}
              </p>

              <PullQuote>{theory.keyInsight}</PullQuote>

              <h3 className="text-lg font-semibold mt-6 mb-3" style={{ color: colors.text }}>
                Passo a Passo
              </h3>
              <ol className="list-decimal list-inside space-y-1" style={{ color: colors.text }}>
                {theory.howItWorks.steps.map((step, i) => (
                  <li key={i} className="pl-2" style={{ lineHeight: 1.75 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="complexidade" title="Análise de Complexidade" variant="highlighted">
              <BigOAnalysis
                time={theory.bigO.time}
                space={theory.bigO.space}
                bestCase={theory.bigO.bestCase}
                worstCase={theory.bigO.worstCase}
              />
            </Section>

            <Section id="comparacoes" title="Comparação com Outros Algoritmos">
              <ComparisonTable
                algorithms={theory.comparisons}
                currentSlug={config.slug}
              />
            </Section>

            <Section id="dicas" title="Dicas e Erros Comuns">
              <Collapsible title="Erros Comuns" defaultOpen>
                <ul className="list-disc list-inside space-y-1" style={{ color: colors.text }}>
                  {theory.commonMistakes.map((mistake, i) => (
                    <li key={i} style={{ lineHeight: 1.75 }}>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </Collapsible>
            </Section>

            <Section id="perguntas" title="Perguntas de Entrevista">
              <p className="mb-4" style={{ color: colors.text }}>
                Pratique respondendo a perguntas comuns de entrevistas tecnicas.
                Clique em uma pergunta para iniciar uma sessao de pratica com IA.
              </p>

              <div className="space-y-3">
                {interview.questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onStartChat={handleStartChat}
                  />
                ))}
              </div>
            </Section>

            <Section id="implementacao" title="Implementacao">
              <div className="mb-6">
                <LanguageTabs
                  languages={['python', 'rust']}
                  active={activeLanguage}
                  onChange={setActiveLanguage}
                />
              </div>

              <CodeViewer
                codeFile={currentCode}
                highlightedConcept={activeConcept ?? undefined}
                onConceptHover={handleConceptHover}
              />
            </Section>
          </div>
        </div>
      </div>

      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        question={currentQuestion}
        algorithmSlug={config.slug}
      />
    </div>
  )
}
