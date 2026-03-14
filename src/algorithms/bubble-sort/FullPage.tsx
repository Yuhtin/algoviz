// src/algorithms/bubble-sort/FullPage.tsx
'use client'

import { AlgorithmFullPage } from '@/components/algorithm/AlgorithmFullPage'
import { config } from './config'
import { theory } from './theory'
import { pythonCode, rustCode } from './annotations'
import { interview } from './interview'
import { BubbleSortVisualizer } from './Visualizer'

export function BubbleSortFullPage() {
  return (
    <AlgorithmFullPage
      config={config}
      theory={theory}
      pythonCode={pythonCode}
      rustCode={rustCode}
      interview={interview}
      Visualizer={BubbleSortVisualizer}
    />
  )
}
