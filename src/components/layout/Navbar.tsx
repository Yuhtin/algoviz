// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { colors } from '@/lib/colors'

interface NavbarProps {
  rightSlot?: React.ReactNode
}

const navLinks = [
  { href: '/trilhas', label: 'Trilhas' },
  { href: '/algoritmos', label: 'Algoritmos' },
]

export function Navbar({ rightSlot }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-10 py-4"
      style={{ background: `${colors.bg}ee`, backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: colors.text }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {rightSlot && (
          <div className="flex items-center">
            {rightSlot}
          </div>
        )}
      </div>
    </nav>
  )
}
