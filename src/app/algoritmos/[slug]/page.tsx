// src/app/algoritmos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { algorithms } from '@/generated/algorithms'
import { AlgorithmFullPage } from '@/components/algorithm/AlgorithmFullPage'

// Visualizers (manual - contain animation logic)
import { BubbleSortVisualizer } from '@/algorithms/bubble-sort/Visualizer'
import { BucketSortVisualizer } from '@/algorithms/bucket-sort/Visualizer'
import { SingleCycleVisualizer } from '@/algorithms/single-cycle/Visualizer'
import { TwoSumVisualizer } from '@/algorithms/two-sum/Visualizer'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Visualizers for each algorithm
const visualizers: Record<string, React.ComponentType> = {
  'bubble-sort': BubbleSortVisualizer,
  'bucket-sort': BucketSortVisualizer,
  'single-cycle-check': SingleCycleVisualizer,
  'two-sum': TwoSumVisualizer,
}

export async function generateStaticParams() {
  return Object.keys(algorithms).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const algorithm = algorithms[slug as keyof typeof algorithms]

  if (!algorithm) {
    return { title: 'AlgoViz' }
  }

  return {
    title: `${algorithm.name} | AlgoViz`,
    description: algorithm.description,
  }
}

export default async function AlgorithmPage({ params }: PageProps) {
  const { slug } = await params
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
