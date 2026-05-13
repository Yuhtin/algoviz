import type { KnapsackItem } from './config'

export type KnapsackStepType =
  | 'init'
  | 'cant-fit'
  | 'compare-and-fill'
  | 'row-done'
  | 'fill-complete'
  | 'backtrack-start'
  | 'backtrack-take'
  | 'backtrack-skip'
  | 'done'

export type FillDecision = 'skip' | 'take' | 'tied-skip'

export interface KnapsackStep {
  type: KnapsackStepType
  dp: number[][]
  activeI: number | null
  activeW: number | null
  skipValue: number | null
  takeValue: number | null
  takeSourceW: number | null
  decision: FillDecision | null
  chosenItems: number[]
  backtrackI: number | null
  backtrackW: number | null
  cellsHighlight: Array<{ i: number; w: number }>
  description: string
}

export function computeSteps(input: {
  items: KnapsackItem[]
  capacity: number
}): {
  steps: KnapsackStep[]
  finalValue: number
  finalItems: number[]
} {
  const { items, capacity } = input
  const n = items.length
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  )
  const steps: KnapsackStep[] = []
  const path: Array<{ i: number; w: number }> = []

  const snap = (extras: Partial<KnapsackStep>): KnapsackStep => ({
    type: 'init',
    dp: dp.map((row) => [...row]),
    activeI: null,
    activeW: null,
    skipValue: null,
    takeValue: null,
    takeSourceW: null,
    decision: null,
    chosenItems: [],
    backtrackI: null,
    backtrackW: null,
    cellsHighlight: [...path],
    description: '',
    ...extras,
  })

  steps.push(
    snap({
      type: 'init',
      description: `Tabela ${n + 1}×${capacity + 1} zerada. Linha 0 (sem itens) e coluna 0 (sem capacidade) ficam em zero.`,
    })
  )

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]

    for (let w = 0; w <= capacity; w++) {
      if (item.weight > w) {
        dp[i][w] = dp[i - 1][w]
        steps.push(
          snap({
            type: 'cant-fit',
            activeI: i,
            activeW: w,
            skipValue: dp[i - 1][w],
            description: `dp[${i}][${w}]: ${item.icon} pesa ${item.weight} > ${w}, herda dp[${i - 1}][${w}] = ${dp[i - 1][w]}.`,
          })
        )
      } else {
        const skip = dp[i - 1][w]
        const take = dp[i - 1][w - item.weight] + item.value
        const sourceW = w - item.weight
        let decision: FillDecision
        if (take > skip) decision = 'take'
        else if (take < skip) decision = 'skip'
        else decision = 'tied-skip'
        dp[i][w] = Math.max(skip, take)
        steps.push(
          snap({
            type: 'compare-and-fill',
            activeI: i,
            activeW: w,
            skipValue: skip,
            takeValue: take,
            takeSourceW: sourceW,
            decision,
            description: `dp[${i}][${w}]: skip=${skip}, take=${take} → ${decision === 'take' ? 'pega' : 'pula'} ${item.icon}, dp[${i}][${w}]=${dp[i][w]}.`,
          })
        )
      }
    }

    steps.push(
      snap({
        type: 'row-done',
        activeI: i,
        description: `Linha do ${item.icon} ${item.name} completa.`,
      })
    )
  }

  steps.push(
    snap({
      type: 'fill-complete',
      description: `Tabela preenchida. Valor máximo: dp[${n}][${capacity}] = ${dp[n][capacity]}.`,
    })
  )

  let bi = n
  let bw = capacity
  const chosen: number[] = []
  path.push({ i: bi, w: bw })

  steps.push(
    snap({
      type: 'backtrack-start',
      backtrackI: bi,
      backtrackW: bw,
      chosenItems: [],
      cellsHighlight: [...path],
      description: `Backtrack começando em dp[${bi}][${bw}].`,
    })
  )

  while (bi > 0) {
    const item = items[bi - 1]
    if (dp[bi][bw] !== dp[bi - 1][bw]) {
      chosen.push(bi - 1)
      const oldW = bw
      bw -= item.weight
      bi -= 1
      path.push({ i: bi, w: bw })
      steps.push(
        snap({
          type: 'backtrack-take',
          backtrackI: bi,
          backtrackW: bw,
          chosenItems: [...chosen],
          cellsHighlight: [...path],
          description: `dp[${bi + 1}][${oldW}] ≠ dp[${bi}][${oldW}] → ${item.icon} ${item.name} foi escolhido. w: ${oldW} → ${bw}.`,
        })
      )
    } else {
      bi -= 1
      path.push({ i: bi, w: bw })
      steps.push(
        snap({
          type: 'backtrack-skip',
          backtrackI: bi,
          backtrackW: bw,
          chosenItems: [...chosen],
          cellsHighlight: [...path],
          description: `dp[${bi + 1}][${bw}] = dp[${bi}][${bw}] → ${item.icon} ${item.name} não foi escolhido.`,
        })
      )
    }
  }

  const finalItems = chosen.slice().reverse()
  steps.push(
    snap({
      type: 'done',
      backtrackI: 0,
      backtrackW: bw,
      chosenItems: [...chosen],
      cellsHighlight: [...path],
      description: `Mochila ótima: ${finalItems.map((idx) => items[idx].icon).join(' ')} com valor total ${dp[n][capacity]}.`,
    })
  )

  return { steps, finalValue: dp[n][capacity], finalItems }
}
