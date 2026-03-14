// src/algorithms/bucket-sort/FullPage.tsx
'use client'

import { AlgorithmFullPage } from '@/components/algorithm/AlgorithmFullPage'
import { config } from './config'
import { theory } from './theory'
import { pythonCode, rustCode } from './annotations'
import { interview } from './interview'
import { BucketSortVisualizer } from './Visualizer'

export function BucketSortFullPage() {
  return (
    <AlgorithmFullPage
      config={config}
      theory={theory}
      pythonCode={pythonCode}
      rustCode={rustCode}
      interview={interview}
      Visualizer={BucketSortVisualizer}
    />
  )
}
