'use client'
import { motion } from 'framer-motion'
import { colors } from '@/lib/colors'

interface SectionProps {
  id: string
  title: string
  icon?: string
  variant?: 'default' | 'highlighted' | 'gradient'
  children: React.ReactNode
}

const variantStyles = {
  default: { background: 'transparent' },
  highlighted: { background: `${colors.visited}10` },
  gradient: { background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surfaceLight} 100%)` },
}

export function Section({ id, title, icon, variant = 'default', children }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="py-12 px-6 rounded-lg my-8"
      style={variantStyles[variant]}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      <div className="prose prose-invert max-w-none" style={{ color: colors.text, lineHeight: 1.75 }}>
        {children}
      </div>
    </motion.section>
  )
}
