// src/app/algoritmos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { algorithms } from '@/generated/algorithms'
import { AlgorithmFullPage } from '@/components/algorithm/AlgorithmFullPage'

// Old imports for algorithms not yet migrated
import { BucketSortFullPage } from '@/algorithms/bucket-sort/FullPage'
import { SingleCycleFullPage } from '@/algorithms/single-cycle/FullPage'
import { TwoSumFullPage } from '@/algorithms/two-sum/FullPage'

// Visualizers (still manual)
import { BubbleSortVisualizer } from '@/algorithms/bubble-sort/Visualizer'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Algorithms using old system (not yet migrated)
const legacyFullPages: Record<string, React.ComponentType> = {
  'bucket-sort': BucketSortFullPage,
  'single-cycle-check': SingleCycleFullPage,
  'two-sum': TwoSumFullPage,
}

// Visualizers for new system
const visualizers: Record<string, React.ComponentType> = {
  'bubble-sort': BubbleSortVisualizer,
}

export async function generateStaticParams() {
  // Combine generated slugs with legacy slugs
  const generatedSlugs = Object.keys(algorithms)
  const legacySlugs = Object.keys(legacyFullPages)
  const allSlugs = [...new Set([...generatedSlugs, ...legacySlugs])]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  // Try generated first
  const algorithm = algorithms[slug as keyof typeof algorithms]
  if (algorithm) {
    return {
      title: `${algorithm.name} | AlgoViz`,
      description: algorithm.description,
    }
  }

  // Fallback to legacy - minimal metadata
  return {
    title: `AlgoViz`,
  }
}

export default async function AlgorithmPage({ params }: PageProps) {
  const { slug } = await params

  // Check if it's a legacy algorithm
  const LegacyFullPage = legacyFullPages[slug]
  if (LegacyFullPage) {
    return <LegacyFullPage />
  }

  // Use new generated system
  const algorithm = algorithms[slug as keyof typeof algorithms]
  const Visualizer = visualizers[slug]

  if (!algorithm || !Visualizer) {
    notFound()
  }

  return (
    <AlgorithmFullPage
      config={algorithm}
      theory={algorithm.theory}
      pythonCode={algorithm.code.python}
      rustCode={algorithm.code.rust}
      interview={algorithm.interview}
      Visualizer={Visualizer}
    />
  )
}
