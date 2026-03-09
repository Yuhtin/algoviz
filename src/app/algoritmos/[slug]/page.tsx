// src/app/algoritmos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getAlgorithm, getAllAlgorithms } from '@/lib/algorithms'
import { AlgorithmLayout } from '@/components/layout/AlgorithmLayout'
import { SingleCycleVisualizer } from '@/algorithms/single-cycle/Visualizer'
import { BubbleSortVisualizer } from '@/algorithms/bubble-sort/Visualizer'
import { TwoSumVisualizer } from '@/algorithms/two-sum/Visualizer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllAlgorithms().map((algo) => ({
    slug: algo.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const algorithm = getAlgorithm(slug)
  if (!algorithm) return {}

  return {
    title: `${algorithm.name} | AlgoViz`,
    description: algorithm.description,
  }
}

const visualizers: Record<string, React.ComponentType> = {
  'single-cycle-check': SingleCycleVisualizer,
  'bubble-sort': BubbleSortVisualizer,
  'two-sum': TwoSumVisualizer,
}

export default async function AlgorithmPage({ params }: PageProps) {
  const { slug } = await params
  const algorithm = getAlgorithm(slug)

  if (!algorithm) {
    notFound()
  }

  const Visualizer = visualizers[slug]

  return (
    <AlgorithmLayout
      name={algorithm.name}
      description={algorithm.description}
      difficulty={algorithm.difficulty}
      complexity={algorithm.complexity}
      tags={algorithm.tags}
    >
      <Visualizer />
    </AlgorithmLayout>
  )
}
