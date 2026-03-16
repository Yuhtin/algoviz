'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  height?: string
}

export function HomeSection({ children, className = '', height = '100vh' }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.3 })

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center ${className}`}
      style={{ minHeight: height }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4"
      >
        {children}
      </motion.div>
    </section>
  )
}
