// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { colors } from '@/lib/colors'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-10 py-4"
      style={{ background: `${colors.bg}ee`, backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: colors.accent, boxShadow: `0 0 12px ${colors.accent}` }}
          />
          <span className="text-lg font-bold" style={{ color: colors.accent }}>
            AlgoViz
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#algoritmos"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: colors.textMuted }}
          >
            Algoritmos
          </Link>
          <Link
            href="/#sobre"
            className="text-sm transition-colors hover:opacity-80"
            style={{ color: colors.textMuted }}
          >
            Sobre
          </Link>
        </div>
      </div>
    </nav>
  )
}
