'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

const algorithms = [
  { name: 'Bubble Sort', slug: 'bubble-sort', category: 'Ordenacao' },
  { name: 'Dijkstra', slug: 'dijkstra', category: 'Grafos' },
  { name: 'Two Sum', slug: 'two-sum', category: 'Arrays' },
  { name: 'Bucket Sort', slug: 'bucket-sort', category: 'Ordenacao' },
]

export function AlgorithmsPreviewSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: colors.text }}
      >
        Algoritmos
        <br />
        <span style={{ color: colors.visited }}>disponiveis</span>
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
              <div
                className="p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer text-left"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  {algo.category}
                </span>
                <h3
                  className="font-semibold mt-1"
                  style={{ color: colors.text }}
                >
                  {algo.name}
                </h3>
              </div>
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
