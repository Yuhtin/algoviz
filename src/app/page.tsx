// src/app/page.tsx
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { getAllAlgorithms } from '@/lib/algorithms'
import { colors } from '@/lib/colors'

const difficultyColors = {
  Facil: colors.accent,
  Media: colors.current,
  Dificil: colors.warning,
}

export default function Home() {
  const algorithms = getAllAlgorithms()

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', color: colors.text }}>
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-10 pt-32 pb-20">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: colors.accent, boxShadow: `0 0 20px ${colors.accent}` }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            Visualizacao Interativa
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold tracking-tight mb-4"
          style={{ color: colors.accent }}
        >
          Algoritmos
          <br />
          <span style={{ color: colors.text }}>Visualizados</span>
        </h1>

        <p
          className="text-lg max-w-xl mb-8"
          style={{ color: colors.textMuted }}
        >
          Domine algoritmos com visualizacoes interativas passo a passo.
          Perfeito para entrevistas tecnicas, estudos e ensino.
        </p>

        <div className="flex gap-4">
          <Link
            href="#algoritmos"
            className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              background: colors.accent,
              color: colors.bg,
            }}
          >
            Explorar Algoritmos
          </Link>
          <Link
            href="#sobre"
            className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
            style={{
              background: 'transparent',
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
            }}
          >
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-10 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '\u25B6',
              title: 'Passo a Passo',
              description: 'Controle total sobre a animacao. Avance, volte e ajuste a velocidade.',
            },
            {
              icon: '{ }',
              title: 'Codigo Sincronizado',
              description: 'Veja a linha de codigo correspondente a cada passo da visualizacao.',
            },
            {
              icon: '\u25C9',
              title: 'Input Customizado',
              description: 'Teste com seus proprios dados ou use presets prontos.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border"
              style={{ background: colors.surface, borderColor: colors.border }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-4"
                style={{ background: `${colors.accent}22`, color: colors.accent }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Algorithms Catalog */}
      <section id="algoritmos" className="max-w-5xl mx-auto px-10 py-16">
        <h2 className="text-3xl font-bold mb-2">Catalogo de Algoritmos</h2>
        <p className="text-sm mb-8" style={{ color: colors.textMuted }}>
          {algorithms.length} algoritmos disponiveis
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithms.map((algo) => (
            <Link
              key={algo.slug}
              href={`/algoritmos/${algo.slug}`}
              className="p-5 rounded-xl border transition-all hover:scale-[1.02]"
              style={{
                background: colors.surface,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
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
                  style={{
                    background: `${colors.visited}22`,
                    color: colors.visited,
                  }}
                >
                  {algo.complexity.time}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{algo.name}</h3>
              <p className="text-xs line-clamp-2" style={{ color: colors.textMuted }}>
                {algo.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="max-w-5xl mx-auto px-10 py-16">
        <div
          className="p-8 rounded-2xl border"
          style={{ background: colors.surface, borderColor: colors.border }}
        >
          <h2 className="text-2xl font-bold mb-4">Sobre o AlgoViz</h2>
          <p className="mb-4" style={{ color: colors.textMuted }}>
            AlgoViz e uma plataforma de visualizacoes interativas de algoritmos em portugues.
            Criada para ajudar desenvolvedores a dominar algoritmos para entrevistas tecnicas,
            estudantes de computacao, e professores que buscam ferramentas visuais de ensino.
          </p>
          <p style={{ color: colors.textMuted }}>
            Cada visualizacao inclui controle passo a passo, explicacao da complexidade,
            e codigo sincronizado com a animacao.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="max-w-5xl mx-auto px-10 py-8 mt-8"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: colors.accent }}
            />
            <span className="text-sm font-semibold" style={{ color: colors.accent }}>
              AlgoViz
            </span>
          </div>
          <span className="text-xs" style={{ color: colors.textMuted }}>
            2026 - Algoritmos Visualizados
          </span>
        </div>
      </footer>
    </div>
  )
}
