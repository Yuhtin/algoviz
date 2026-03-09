'use client'

import { useEffect, useState } from 'react'
import { colors } from '@/lib/colors'

interface ReadingProgressProps {
  readingTime: number
}

export function ReadingProgress({ readingTime }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const percentage = Math.round((scrolled / scrollHeight) * 100)
      setProgress(Math.min(100, Math.max(0, percentage)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.visited})`,
          boxShadow: `0 0 10px ${colors.accentGlow}`,
        }}
      />
      <div
        className="absolute top-2 right-4 text-xs font-medium px-2 py-1 rounded"
        style={{ background: colors.surface, color: colors.textMuted }}
      >
        {readingTime} min
      </div>
    </div>
  )
}
