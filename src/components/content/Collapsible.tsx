'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '@/lib/colors'

interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className="my-4 rounded-lg overflow-hidden"
      style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
        style={{ color: colors.text }}
      >
        <span className="font-medium">{title}</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
