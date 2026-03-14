// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { GamificationBadge } from '@/components/gamification/GamificationBadge'
import { useProgressStore } from '@/stores/progress-store'
import { getAllAlgorithms } from '@/lib/algorithms'
import { colors } from '@/lib/colors'

const difficultyColors = {
  Facil: colors.accent,
  Media: colors.current,
  Dificil: colors.warning,
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function Home() {
  const algorithms = getAllAlgorithms()
  const featuredAlgorithms = algorithms.slice(0, 3)
  const { xp, level, streak, recordActivity } = useProgressStore()

  useEffect(() => {
    recordActivity()
  }, [recordActivity])

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

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <motion.section
          className="pt-24 pb-12"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div className="flex items-center gap-3 mb-3" variants={fadeIn}>
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: colors.accent, boxShadow: `0 0 16px ${colors.accent}` }}
            />
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.textMuted }}>
              Visualizacao Interativa
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            variants={fadeIn}
          >
            <span style={{ color: colors.accent }}>Algoritmos</span>
            <br />
            <span style={{ color: colors.text }}>Visualizados</span>
          </motion.h1>

          <motion.p
            className="text-base max-w-xl mb-6"
            style={{ color: colors.textMuted, lineHeight: 1.75 }}
            variants={fadeIn}
          >
            Domine algoritmos com visualizacoes interativas passo a passo.
            Perfeito para entrevistas tecnicas e estudos.
          </motion.p>

          <motion.div className="flex gap-3" variants={fadeIn}>
            <Link
              href="#algoritmos"
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{ background: colors.accent, color: colors.bg }}
            >
              Explorar Algoritmos
            </Link>
            <Link
              href="#sobre"
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-80"
              style={{ background: 'transparent', color: colors.textMuted, border: `1px solid ${colors.border}` }}
            >
              Saiba Mais
            </Link>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          className="py-10"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '\u25B6', title: 'Passo a Passo', description: 'Controle total sobre a animacao.' },
              { icon: '{ }', title: 'Codigo Sincronizado', description: 'Veja a linha de codigo correspondente.' },
              { icon: '\u25C9', title: 'Input Customizado', description: 'Teste com seus proprios dados.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-xl border"
                style={{ background: colors.surface, borderColor: colors.border }}
                variants={fadeIn}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base mb-3"
                  style={{ background: `${colors.accent}22`, color: colors.accent }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Algorithms Preview */}
        <section id="algoritmos" className="py-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-1">Algoritmos em Destaque</h2>
            <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
              {algorithms.length} algoritmos disponiveis
            </p>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {featuredAlgorithms.map((algo) => (
                <motion.div key={algo.slug} variants={fadeIn}>
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
                </motion.div>
              ))}
            </motion.div>

            {/* Ver Mais Button */}
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/algoritmos"
                className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
                style={{
                  background: 'transparent',
                  color: colors.accent,
                  border: `1px solid ${colors.accent}`,
                }}
              >
                Ver Mais
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <motion.section
          id="sobre"
          className="py-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="p-6 rounded-xl border"
            style={{ background: colors.surface, borderColor: colors.border }}
          >
            <h2 className="text-xl font-bold mb-3">Sobre o AlgoViz</h2>
            <p className="text-sm mb-3" style={{ color: colors.textMuted, lineHeight: 1.75 }}>
              AlgoViz e uma plataforma de visualizacoes interativas de algoritmos em portugues.
              Criada para ajudar desenvolvedores a dominar algoritmos para entrevistas tecnicas.
            </p>
            <p className="text-sm" style={{ color: colors.textMuted, lineHeight: 1.75 }}>
              Cada visualizacao inclui controle passo a passo, explicacao da complexidade,
              e codigo sincronizado com a animacao.
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-6 mt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: colors.accent }} />
              <span className="text-sm font-semibold" style={{ color: colors.accent }}>
                AlgoViz
              </span>
            </div>
            <span className="text-xs" style={{ color: colors.textMuted }}>
              2026 - Algoritmos Visualizados
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
