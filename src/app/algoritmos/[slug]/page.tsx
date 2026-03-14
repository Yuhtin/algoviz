// src/app/algoritmos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getAlgorithm, getAllAlgorithms } from '@/lib/algorithms'
import { BubbleSortFullPage } from '@/algorithms/bubble-sort/FullPage'
import { BucketSortFullPage } from '@/algorithms/bucket-sort/FullPage'
import { SingleCycleFullPage } from '@/algorithms/single-cycle/FullPage'
import { TwoSumFullPage } from '@/algorithms/two-sum/FullPage'

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

const fullPages: Record<string, React.ComponentType> = {
  'bubble-sort': BubbleSortFullPage,
  'bucket-sort': BucketSortFullPage,
  'single-cycle-check': SingleCycleFullPage,
  'two-sum': TwoSumFullPage,
}

export default async function AlgorithmPage({ params }: PageProps) {
  const { slug } = await params
  const algorithm = getAlgorithm(slug)

  if (!algorithm) {
    notFound()
  }

  const FullPage = fullPages[slug]
  if (!FullPage) {
    notFound()
  }

  return <FullPage />
}
