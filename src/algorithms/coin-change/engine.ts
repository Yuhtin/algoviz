export type CoinChangeStepType =
  | 'init'
  | 'try-coin'
  | 'cell-done'
  | 'backtrack-start'
  | 'backtrack-pop'
  | 'done'
  | 'impossible'

export type TryCoinOutcome = 'too-large' | 'unreachable-source' | 'updated' | 'kept'

export interface CoinChangeStep {
  type: CoinChangeStepType
  dp: (number | null)[]
  choice: (number | null)[]
  targetJ: number | null
  coin: number | null
  sourceJ: number | null
  candidate: number | null
  outcome: TryCoinOutcome | null
  previousValue: number | null
  result: number[]
  backtrackJ: number | null
  description: string
}

const INF = null

export function computeSteps(input: { coins: number[]; amount: number }): {
  steps: CoinChangeStep[]
  finalCount: number
  finalCoins: number[]
} {
  const { coins, amount } = input
  const dp: (number | null)[] = new Array(amount + 1).fill(INF)
  dp[0] = 0
  const choice: (number | null)[] = new Array(amount + 1).fill(null)
  const steps: CoinChangeStep[] = []

  const snap = (extras: Partial<CoinChangeStep>): CoinChangeStep => ({
    type: 'init',
    dp: [...dp],
    choice: [...choice],
    targetJ: null,
    coin: null,
    sourceJ: null,
    candidate: null,
    outcome: null,
    previousValue: null,
    result: [],
    backtrackJ: null,
    description: '',
    ...extras,
  })

  steps.push(
    snap({
      type: 'init',
      description: `Inicializando dp[0]=0 e dp[1..${amount}]=∞. Vamos preencher de baixo pra cima.`,
    })
  )

  for (let j = 1; j <= amount; j++) {
    for (const c of coins) {
      if (c > j) {
        steps.push(
          snap({
            type: 'try-coin',
            targetJ: j,
            coin: c,
            outcome: 'too-large',
            description: `dp[${j}]: moeda ${c} não cabe (${c} > ${j}). Pula.`,
          })
        )
        continue
      }

      const prev = dp[j - c]
      if (prev === null) {
        steps.push(
          snap({
            type: 'try-coin',
            targetJ: j,
            coin: c,
            sourceJ: j - c,
            outcome: 'unreachable-source',
            description: `dp[${j}]: dp[${j - c}] ainda é ∞. Não dá pra usar moeda ${c}.`,
          })
        )
        continue
      }

      const candidate = prev + 1
      const current = dp[j]

      if (current === null || candidate < current) {
        const previousValue = current
        dp[j] = candidate
        choice[j] = c
        steps.push(
          snap({
            type: 'try-coin',
            targetJ: j,
            coin: c,
            sourceJ: j - c,
            candidate,
            outcome: 'updated',
            previousValue,
            description: `dp[${j}]: moeda ${c} → dp[${j - c}]+1 = ${candidate}. Melhora ${previousValue === null ? '∞' : previousValue} → ${candidate}.`,
          })
        )
      } else {
        steps.push(
          snap({
            type: 'try-coin',
            targetJ: j,
            coin: c,
            sourceJ: j - c,
            candidate,
            outcome: 'kept',
            description: `dp[${j}]: moeda ${c} → ${candidate} ≥ ${current}. Mantém ${current}.`,
          })
        )
      }
    }

    steps.push(
      snap({
        type: 'cell-done',
        targetJ: j,
        description:
          dp[j] === null
            ? `dp[${j}] permanece ∞ (nenhuma moeda funciona).`
            : `dp[${j}] = ${dp[j]} fixado.`,
      })
    )
  }

  if (dp[amount] === null) {
    steps.push(
      snap({
        type: 'impossible',
        description: `dp[${amount}] = ∞. Impossível formar ${amount} com essas moedas.`,
      })
    )
    return { steps, finalCount: -1, finalCoins: [] }
  }

  const result: number[] = []
  let j = amount
  steps.push(
    snap({
      type: 'backtrack-start',
      backtrackJ: j,
      result: [],
      description: `Backtrack a partir de dp[${amount}] para reconstruir as moedas.`,
    })
  )

  while (j > 0) {
    const c = choice[j]!
    result.push(c)
    const nextJ = j - c
    steps.push(
      snap({
        type: 'backtrack-pop',
        backtrackJ: nextJ,
        coin: c,
        sourceJ: j,
        result: [...result],
        description: `Usando moeda ${c}. j: ${j} → ${nextJ}.`,
      })
    )
    j = nextJ
  }

  steps.push(
    snap({
      type: 'done',
      result: [...result],
      backtrackJ: 0,
      description: `Pronto! Mínimo: ${result.length} moedas → [${result.join(', ')}].`,
    })
  )

  return { steps, finalCount: dp[amount]!, finalCoins: result }
}
