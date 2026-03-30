# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform AlgoViz homepage into a premium, Atthena-inspired experience with elegant typography, floating icons, and sophisticated animations.

**Architecture:** Update color system and fonts first (foundation), then build new components (FloatingIcons, HighlightText), then update each section sequentially. Use CSS animations for float effects, Framer Motion for scroll-triggered animations.

**Tech Stack:** Next.js 16, React 19, Framer Motion, Tailwind CSS 4, Playfair Display font (Google Fonts)

---

## File Structure

**Core files to modify:**
- `src/lib/colors.ts` - Update color palette (green-tinted bg, cream text)
- `src/app/layout.tsx` - Add Playfair Display font

**New components:**
- `src/components/home/FloatingIcons.tsx` - Icon system with mixed animations
- `src/components/home/HighlightText.tsx` - Animated highlight wrapper

**Section updates:**
- `src/components/home/sections/HeroSection.tsx` - Complete rewrite
- `src/components/home/sections/VisualizationSection.tsx` - Typography update
- `src/components/home/sections/FeaturesSection.tsx` - Cards + hover effects
- `src/components/home/sections/HowItWorksSection.tsx` - Serif titles + stagger
- `src/components/home/sections/AlgorithmsPreviewSection.tsx` - Gradient borders
- `src/components/home/sections/TrailsSection.tsx` - Premium cards
- `src/components/home/sections/CTASection.tsx` - Glow button + sparse icons
- `src/components/home/Particles.tsx` - Reduce count

---

### Task 1: Update Color Palette

**Files:**
- Modify: `src/lib/colors.ts`

- [ ] **Step 1: Update colors.ts with new palette**

```typescript
// src/lib/colors.ts
/**
 * AlgoViz Design System - Semantic Color Palette
 * Updated with green-tinted backgrounds and cream text
 */

export const colors = {
  // Backgrounds (green-tinted)
  bg: '#0a1210',
  surface: '#121a18',
  surfaceLight: '#1a2a28',
  border: '#2a3a38',
  code: '#1a2420',

  // Text (warm cream)
  text: '#e8e6e3',
  textMuted: '#7a8a8a',

  // Semantic (unchanged)
  accent: '#00d4aa',
  accentGlow: '#00d4aa33',
  warning: '#ff6b6b',
  warningGlow: '#ff6b6b33',
  visited: '#6c5ce7',
  visitedGlow: '#6c5ce722',
  current: '#ffd93d',
  currentGlow: '#ffd93d44',

  // Aliases
  positive: '#00d4aa',
  negative: '#ff6b6b',
} as const

export type ColorKey = keyof typeof colors
```

- [ ] **Step 2: Verify dev server runs without errors**

Run: `npm run dev`
Expected: Server starts, no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/colors.ts
git commit -m "style: update color palette with green-tinted backgrounds and cream text"
```

---

### Task 2: Add Playfair Display Font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx to add Playfair Display**

```typescript
// src/app/layout.tsx
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "AlgoViz - Algoritmos Visualizados",
  description: "Plataforma de visualizacoes interativas de algoritmos em portugues",
  keywords: ["algoritmos", "visualizacao", "entrevistas", "programacao"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify font loads**

Run: `npm run dev`
Open browser DevTools, check that `--font-serif` CSS variable is available

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Playfair Display serif font for headlines"
```

---

### Task 3: Create HighlightText Component

**Files:**
- Create: `src/components/home/HighlightText.tsx`

- [ ] **Step 1: Create HighlightText component**

```tsx
'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import { colors } from '@/lib/colors'

interface Props {
  children: ReactNode
  delay?: number
  duration?: number
}

export function HighlightText({ children, delay = 0.5, duration = 0.8 }: Props) {
  return (
    <span className="relative inline-block">
      <motion.span
        className="absolute inset-0 -inset-x-2"
        style={{ backgroundColor: colors.accentGlow }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration, ease: 'easeOut' }}
      />
      <span className="relative">{children}</span>
    </span>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HighlightText.tsx
git commit -m "feat: add HighlightText component with slide-in animation"
```

---

### Task 4: Create FloatingIcons Component

**Files:**
- Create: `src/components/home/FloatingIcons.tsx`

- [ ] **Step 1: Create FloatingIcons component with icon data**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { colors } from '@/lib/colors'

// Icon definitions by category
const ICONS = {
  languages: [
    { content: '🐍', type: 'emoji' },
    { content: 'JS', type: 'text', color: '#f7df1e' },
    { content: 'TS', type: 'text', color: '#3178c6' },
    { content: 'Rust', type: 'text', color: colors.warning },
    { content: 'Go', type: 'text', color: colors.accent },
    { content: 'Java', type: 'text', color: '#ed8b00' },
  ],
  symbols: [
    { content: '{ }', type: 'code' },
    { content: '[ ]', type: 'code' },
    { content: '=>', type: 'code' },
    { content: '</>', type: 'code' },
    { content: '&&', type: 'code' },
    { content: '::', type: 'code' },
  ],
  notation: [
    { content: 'O(n)', type: 'notation' },
    { content: 'O(log n)', type: 'notation' },
    { content: 'O(1)', type: 'notation' },
    { content: 'BFS', type: 'notation' },
    { content: 'DFS', type: 'notation' },
  ],
  shapes: [
    { content: 'tree', type: 'svg' },
    { content: 'graph', type: 'svg' },
    { content: 'array', type: 'svg' },
  ],
}

// SVG shapes
function MiniTree() {
  return (
    <svg width="40" height="35" viewBox="0 0 40 35">
      <circle cx="20" cy="6" r="4" fill={colors.accent} />
      <circle cx="10" cy="25" r="3" fill={colors.visited} />
      <circle cx="30" cy="25" r="3" fill={colors.visited} />
      <line x1="20" y1="10" x2="10" y2="22" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="20" y1="10" x2="30" y2="22" stroke={colors.textMuted} strokeWidth="1.5" />
    </svg>
  )
}

function MiniGraph() {
  return (
    <svg width="45" height="35" viewBox="0 0 45 35">
      <circle cx="8" cy="17" r="4" fill={colors.current} />
      <circle cx="22" cy="6" r="4" fill={colors.accent} />
      <circle cx="22" cy="28" r="4" fill={colors.accent} />
      <circle cx="37" cy="17" r="4" fill={colors.warning} />
      <line x1="12" y1="15" x2="18" y2="8" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="12" y1="19" x2="18" y2="26" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="26" y1="8" x2="33" y2="15" stroke={colors.textMuted} strokeWidth="1.5" />
      <line x1="26" y1="26" x2="33" y2="19" stroke={colors.textMuted} strokeWidth="1.5" />
    </svg>
  )
}

function MiniArray() {
  return (
    <div className="flex gap-0.5 items-end">
      <div className="w-3 h-5 rounded-sm" style={{ backgroundColor: colors.warning }} />
      <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: colors.accent }} />
      <div className="w-3 h-4 rounded-sm" style={{ backgroundColor: colors.visited }} />
      <div className="w-3 h-7 rounded-sm" style={{ backgroundColor: colors.current }} />
    </div>
  )
}

type AnimationType = 'float' | 'parallax' | 'pulse'

interface FloatingIconProps {
  icon: typeof ICONS.languages[0] | typeof ICONS.symbols[0] | typeof ICONS.notation[0] | typeof ICONS.shapes[0]
  position: { x: number; y: number }
  size: number
  opacity: number
  animation: AnimationType
  delay: number
}

function FloatingIcon({ icon, position, size, opacity, animation, delay }: FloatingIconProps) {
  const animationVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [-3, 3, -3],
      transition: {
        y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    parallax: {
      // Parallax handled by scroll in parent
    },
    pulse: {
      opacity: [opacity, opacity * 1.5, opacity],
      transition: {
        opacity: { duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
      },
    },
  }

  const renderContent = () => {
    if (icon.type === 'emoji') {
      return <span style={{ fontSize: size }}>{icon.content}</span>
    }
    if (icon.type === 'text') {
      return (
        <span
          className="font-mono font-bold"
          style={{ fontSize: size * 0.7, color: 'color' in icon ? icon.color : colors.accent }}
        >
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'code') {
      return (
        <span className="font-mono" style={{ fontSize: size * 0.8, color: colors.accent }}>
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'notation') {
      return (
        <span className="font-serif italic" style={{ fontSize: size * 0.7, color: colors.current }}>
          {icon.content}
        </span>
      )
    }
    if (icon.type === 'svg') {
      if (icon.content === 'tree') return <MiniTree />
      if (icon.content === 'graph') return <MiniGraph />
      if (icon.content === 'array') return <MiniArray />
    }
    return null
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity,
        scale: 1,
        ...(animation === 'float' ? animationVariants.float : {}),
        ...(animation === 'pulse' ? animationVariants.pulse : {}),
      }}
      transition={{ delay, duration: 0.5 }}
    >
      {renderContent()}
    </motion.div>
  )
}

interface Props {
  count?: number
  className?: string
}

export function FloatingIcons({ count = 25, className = '' }: Props) {
  const icons = useMemo(() => {
    const allIcons = [
      ...ICONS.languages,
      ...ICONS.symbols,
      ...ICONS.notation,
      ...ICONS.shapes,
    ]

    const animations: AnimationType[] = ['float', 'float', 'parallax', 'parallax', 'pulse']

    return Array.from({ length: count }, (_, i) => {
      const icon = allIcons[i % allIcons.length]
      const animation = animations[Math.floor(Math.random() * animations.length)]

      return {
        id: i,
        icon,
        position: {
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 90,
        },
        size: 16 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.3,
        animation,
        delay: Math.random() * 0.5,
      }
    })
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {icons.map((props) => (
        <FloatingIcon key={props.id} {...props} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/FloatingIcons.tsx
git commit -m "feat: add FloatingIcons component with mixed animation behaviors"
```

---

### Task 5: Redesign HeroSection

**Files:**
- Modify: `src/components/home/sections/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection with new design**

```tsx
'use client'

import { motion } from 'framer-motion'
import { HomeSection } from '../HomeSection'
import { FloatingIcons } from '../FloatingIcons'
import { HighlightText } from '../HighlightText'
import { colors } from '@/lib/colors'

export function HeroSection() {
  return (
    <HomeSection className="relative">
      {/* Floating icons background */}
      <FloatingIcons count={30} className="z-0" />

      {/* Content */}
      <div className="relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl mb-6"
          style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Entenda algoritmos
          <br />
          <HighlightText delay={1} duration={0.8}>
            de verdade
          </HighlightText>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-8"
          style={{ color: colors.textMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Pare de decorar. Comece a ver.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span style={{ color: colors.textMuted }} className="text-sm">
            Role para explorar
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: colors.accent }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test in browser**

Run: `npm run dev`
Open http://localhost:3000
Expected: Hero shows with floating icons and animated highlight

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/HeroSection.tsx
git commit -m "feat: redesign HeroSection with floating icons and highlight animation"
```

---

### Task 6: Update VisualizationSection

**Files:**
- Modify: `src/components/home/sections/VisualizationSection.tsx`

- [ ] **Step 1: Update with serif typography**

```tsx
'use client'

import { HomeSection } from '../HomeSection'
import { HighlightText } from '../HighlightText'
import { colors } from '@/lib/colors'

export function VisualizationSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl mb-6"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Veja cada passo
        <br />
        <HighlightText delay={0.3}>acontecer</HighlightText>
      </h2>

      <p
        className="text-lg md:text-xl max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Acompanhe cada troca, cada comparacao. Sem cortes, sem pulos.
      </p>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test in browser**

Expected: Section shows with serif headline and highlight

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/VisualizationSection.tsx
git commit -m "style: update VisualizationSection with serif typography"
```

---

### Task 7: Update FeaturesSection

**Files:**
- Modify: `src/components/home/sections/FeaturesSection.tsx`

- [ ] **Step 1: Update with hover effects and serif titles**

```tsx
'use client'

import { motion } from 'framer-motion'
import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

const features = [
  {
    title: 'Passo a passo',
    description: 'Cada operacao acontece na sua frente. Sem magica, sem abstracoes escondidas.',
  },
  {
    title: 'Aprenda no seu ritmo',
    description: 'Pause, volte, repita. O controle e seu.',
  },
  {
    title: 'Do basico ao avancado',
    description: 'Comece com ordenacao simples. Termine com grafos e programacao dinamica.',
  },
]

export function FeaturesSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl mb-16"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Por que funciona
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: `0 8px 30px ${colors.accentGlow}` }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
            className="text-left p-6 rounded-2xl cursor-default transition-shadow"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold mb-4"
              style={{ backgroundColor: colors.accentGlow, color: colors.accent }}
            >
              {index + 1}
            </div>
            <h3
              className="text-xl mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
            >
              {feature.title}
            </h3>
            <p style={{ color: colors.textMuted }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test hover effects**

Expected: Cards lift and glow on hover

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/FeaturesSection.tsx
git commit -m "style: update FeaturesSection with hover effects and serif titles"
```

---

### Task 8: Update HowItWorksSection

**Files:**
- Modify: `src/components/home/sections/HowItWorksSection.tsx`

- [ ] **Step 1: Update with serif and connecting line**

```tsx
'use client'

import { motion } from 'framer-motion'
import { HomeSection } from '../HomeSection'
import { colors } from '@/lib/colors'

const steps = [
  { step: 'Escolha', text: 'Selecione um algoritmo ou comece uma trilha guiada' },
  { step: 'Execute', text: 'Rode a visualizacao e acompanhe cada mudanca nos dados' },
  { step: 'Entenda', text: 'Veja o codigo destacado enquanto a animacao roda' },
  { step: 'Pratique', text: 'Responda quizzes e ganhe XP conforme avanca' },
]

export function HowItWorksSection() {
  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-5xl mb-4"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Como usar
      </h2>
      <p
        className="text-lg mb-12 max-w-xl mx-auto"
        style={{ color: colors.textMuted }}
      >
        Quatro passos entre voce e entender algoritmos de verdade
      </p>

      <div className="max-w-2xl mx-auto relative">
        {/* Connecting line */}
        <div
          className="absolute left-6 top-6 bottom-6 w-0.5 hidden md:block"
          style={{
            background: `linear-gradient(to bottom, ${colors.accent}, ${colors.visited}, ${colors.current}, ${colors.warning})`,
          }}
        />

        {steps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 mb-8 text-left relative"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 relative z-10"
              style={{ backgroundColor: colors.accent, color: colors.bg }}
            >
              {index + 1}
            </motion.div>
            <div className="pt-2">
              <span
                className="text-lg"
                style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
              >
                {item.step}
              </span>
              <span style={{ color: colors.textMuted }}> — {item.text}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test staggered animation**

Expected: Steps animate in sequence with connecting line visible on desktop

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/HowItWorksSection.tsx
git commit -m "style: update HowItWorksSection with connecting line and serif titles"
```

---

### Task 9: Update AlgorithmsPreviewSection

**Files:**
- Modify: `src/components/home/sections/AlgorithmsPreviewSection.tsx`

- [ ] **Step 1: Update with gradient borders and hover**

```tsx
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
```

- [ ] **Step 2: Test hover effects**

Expected: Cards show gradient border and "Explorar" on hover

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/AlgorithmsPreviewSection.tsx
git commit -m "style: update AlgorithmsPreviewSection with gradient borders and complexity badges"
```

---

### Task 10: Update TrailsSection

**Files:**
- Modify: `src/components/home/sections/TrailsSection.tsx`

- [ ] **Step 1: Update with premium cards**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { HighlightText } from '../HighlightText'
import { getAllTrails } from '@/lib/trails'
import { colors } from '@/lib/colors'

export function TrailsSection() {
  const trails = getAllTrails()

  const levelColors = [colors.accent, colors.visited, colors.warning]
  const levelLabels = ['Comecar aqui', 'Proximo passo', 'Avancado']

  return (
    <HomeSection>
      <h2
        className="text-4xl md:text-6xl mb-12"
        style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
      >
        Siga sua
        <br />
        <HighlightText delay={0.3}>trilha</HighlightText>
      </h2>

      <div className="relative max-w-md mx-auto text-left">
        {/* Connecting line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, ${colors.accent}, ${colors.visited}, ${colors.warning})`,
          }}
        />

        <div className="space-y-8">
          {trails.slice(0, 3).map((trail, index) => (
            <motion.div
              key={trail.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-12"
            >
              <div
                className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: levelColors[index], color: colors.bg }}
              >
                {index + 1}
              </div>

              <Link href={`/trilhas/${trail.slug}`}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 8px 30px ${levelColors[index]}22` }}
                  className="p-4 rounded-xl transition-shadow"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: levelColors[index] }}
                  >
                    {levelLabels[index]}
                  </div>
                  <h3
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
                  >
                    {trail.name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {trail.missions.length} missoes • {trail.difficulty}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test hover effects**

Expected: Trail cards lift with colored shadow on hover

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/TrailsSection.tsx
git commit -m "style: update TrailsSection with premium card styling"
```

---

### Task 11: Update CTASection

**Files:**
- Modify: `src/components/home/sections/CTASection.tsx`

- [ ] **Step 1: Update with glow button and sparse icons**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeSection } from '../HomeSection'
import { FloatingIcons } from '../FloatingIcons'
import { useProgressStore } from '@/stores/progress-store'
import { colors } from '@/lib/colors'

export function CTASection() {
  const { xp, level } = useProgressStore()
  const hasProgress = xp > 0

  return (
    <HomeSection height="50vh" className="relative">
      {/* Sparse floating icons */}
      <FloatingIcons count={10} className="z-0 opacity-50" />

      <div className="relative z-10">
        <h2
          className="text-4xl md:text-5xl mb-6"
          style={{ fontFamily: 'var(--font-serif)', color: colors.text }}
        >
          {hasProgress ? 'Continue sua jornada' : 'Comece agora'}
        </h2>

        {hasProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <span style={{ color: colors.accent }}>Level {level}</span>
            <span style={{ color: colors.textMuted }}>•</span>
            <span style={{ color: colors.text }}>{xp} XP</span>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/trilhas">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 30px ${colors.accentGlow}, 0 0 60px ${colors.accentGlow}`,
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium text-lg transition-shadow"
              style={{ backgroundColor: colors.accent, color: colors.bg }}
            >
              {hasProgress ? 'Continuar' : 'Comecar'} →
            </motion.button>
          </Link>

          <Link href="/algoritmos">
            <motion.button
              whileHover={{ scale: 1.05, borderColor: colors.accent }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium text-lg transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              Explorar algoritmos
            </motion.button>
          </Link>
        </div>
      </div>
    </HomeSection>
  )
}
```

- [ ] **Step 2: Test button glow**

Expected: Primary button glows on hover

- [ ] **Step 3: Commit**

```bash
git add src/components/home/sections/CTASection.tsx
git commit -m "style: update CTASection with glow button and sparse floating icons"
```

---

### Task 12: Reduce Particle Count

**Files:**
- Modify: `src/components/home/Particles.tsx`

- [ ] **Step 1: Update default count and opacity**

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './ScrollProgress'

interface Props {
  count?: number
}

export function Particles({ count = 200 }: Props) {
  const mesh = useRef<THREE.Points>(null)
  const { progress } = useScrollProgress()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color('#00d4aa'), // accent
      new THREE.Color('#6c5ce7'), // visited
      new THREE.Color('#ff6b6b'), // warning
      new THREE.Color('#ffd93d'), // yellow
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    // Rotate slowly
    mesh.current.rotation.x = time * 0.05
    mesh.current.rotation.y = time * 0.08

    // Move based on scroll
    mesh.current.position.z = -progress * 5

    // Pulse size based on scroll
    const material = mesh.current.material as THREE.PointsMaterial
    material.size = 0.04 + Math.sin(time * 2) * 0.015
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
```

- [ ] **Step 2: Update page.tsx to use new count**

The component already has a prop, but verify `page.tsx` passes `count={200}`:

```tsx
// In src/app/page.tsx, update the Particles line:
<Particles count={200} />
```

- [ ] **Step 3: Test performance**

Expected: Smoother animation with fewer particles

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Particles.tsx src/app/page.tsx
git commit -m "perf: reduce particle count and opacity for better performance"
```

---

### Task 13: Final Testing and Cleanup

**Files:**
- All modified files

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Test all sections in browser**

Run: `npm run dev`
Checklist:
- [ ] Hero: floating icons animate, highlight slides in
- [ ] Visualization: serif headline, highlight works
- [ ] Features: cards hover with lift and glow
- [ ] How It Works: connecting line visible, stagger animation
- [ ] Algorithms: gradient borders on hover, complexity badges
- [ ] Trails: premium cards with colored shadows
- [ ] CTA: button glows, sparse icons in background
- [ ] Colors: green-tinted background visible, cream text

- [ ] **Step 3: Test mobile responsiveness**

Resize browser to mobile width
Expected: Icons reduce, layout adapts

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete homepage redesign with Atthena-inspired design"
```

---

## Summary

13 tasks covering:
1. Color palette update (foundation)
2. Font addition (foundation)
3. HighlightText component (new)
4. FloatingIcons component (new)
5-11. Section updates (7 sections)
12. Particle optimization
13. Final testing

Each task is self-contained and can be verified independently.
