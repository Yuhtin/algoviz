'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { HighlightText } from '../HighlightText'
import { colors } from '@/lib/colors'

const algorithms = [
  { name: 'Bubble Sort', slug: 'bubble-sort', category: 'Ordenacao', complexity: 'O(n²)' },
  { name: 'Dijkstra', slug: 'dijkstra', category: 'Grafos', complexity: 'O(V²)' },
  { name: 'Two Sum', slug: 'two-sum', category: 'Arrays', complexity: 'O(n)' },
  { name: 'Bucket Sort', slug: 'bucket-sort', category: 'Ordenacao', complexity: 'O(n+k)' },
]

export function AlgorithmsPreviewSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl mb-4"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Algoritmos
        <br />
        <HighlightText delay={0.3}>disponiveis</HighlightText>
      </h2>
      <p
        className="text-lg mb-12 max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Classicos que todo dev precisa conhecer. Visualize, entenda, domine.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {algorithms.map((algo, index) => (
          <motion.div
            key={algo.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Link href={`/algoritmos/${algo.slug}`}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-4 rounded-xl text-left relative overflow-hidden"
                style={{ backgroundColor: colors.surface }}
              >
                {/* Gradient border effect */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}33, ${colors.visited}33)`,
                    padding: '1px',
                  }}
                />
                <div
                  className="absolute inset-[1px] rounded-xl"
                  style={{ backgroundColor: colors.surface }}
                />

                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: colors.textMuted }}
                    >
                      {algo.category}
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ backgroundColor: colors.accentGlow, color: colors.accent }}
                    >
                      {algo.complexity}
                    </span>
                  </div>
                  <h3
                    className="font-semibold"
                    style={{ color: colors.text }}
                  >
                    {algo.name}
                  </h3>
                  <span
                    className="text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2 inline-block"
                    style={{ color: colors.accent }}
                  >
                    Explorar →
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <Link
          href="/algoritmos"
          className="text-sm hover:underline"
          style={{ color: colors.accent }}
        >
          Ver todos os algoritmos
        </Link>
      </motion.div>
    </HomeSection>
  )
}
