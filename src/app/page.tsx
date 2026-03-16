'use client'

import dynamic from 'next/dynamic'
import { ScrollProgressProvider } from '@/components/home/ScrollProgress'
import { HeroSection } from '@/components/home/sections/HeroSection'
import { VisualizationSection } from '@/components/home/sections/VisualizationSection'
import { TrailsSection } from '@/components/home/sections/TrailsSection'
import { CTASection } from '@/components/home/sections/CTASection'
import { Navbar } from '@/components/layout/Navbar'
import { colors } from '@/lib/colors'

// Dynamic import for 3D components (no SSR)
const Scene = dynamic(
  () => import('@/components/home/Scene').then((mod) => mod.Scene),
  { ssr: false }
)
const Particles = dynamic(
  () => import('@/components/home/Particles').then((mod) => mod.Particles),
  { ssr: false }
)
const SortingBars = dynamic(
  () => import('@/components/home/SortingBars').then((mod) => mod.SortingBars),
  { ssr: false }
)

export default function Home() {
  return (
    <ScrollProgressProvider totalScenes={4}>
      <div style={{ backgroundColor: colors.bg }}>
        <Navbar />

        {/* 3D Background */}
        <Scene>
          <Particles count={300} />
          <SortingBars />
        </Scene>

        {/* Scrollable content */}
        <main className="relative z-10">
          <HeroSection />
          <VisualizationSection />
          <TrailsSection />
          <CTASection />
        </main>

        {/* Footer */}
        <footer
          className="relative z-10 py-8 text-center"
          style={{
            backgroundColor: colors.bg,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <p style={{ color: colors.textMuted }}>
            AlgoViz © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </ScrollProgressProvider>
  )
}
