import type { DPStage } from '@/components/dp/DPDesignFlow'

export const coinChangeStages: DPStage[] = [
  {
    id: 'state',
    title: 'Identificar Estado',
    question: 'Qual a menor unidade de problema que, se eu souber resolver, me ajuda a resolver o todo?',
    answer: (
      <>
        <p>
          Aqui o "problema" é formar um valor exato com moedas. A menor unidade é
          formar <strong>cada valor menor que o alvo</strong>. Se eu souber a
          resposta para todos os valores menores, posso derivar a do alvo.
        </p>
        <p className="mt-2">
          Defino então um estado indexado pelo valor: para cada j de 0 até
          amount, quanto custa formar j?
        </p>
      </>
    ),
    formula: 'dp[j] = mínimo de moedas para formar o valor j',
    codeLanguage: 'python',
    codeSnippet: `def coin_change(coins, amount):
    INF = float('inf')
▶    dp = [INF] * (amount + 1)
    dp[0] = 0
    choice = [None] * (amount + 1)`,
  },
  {
    id: 'base',
    title: 'Caso Base',
    question: 'Qual é o estado mais simples cuja resposta eu já sei sem fazer nenhum cálculo?',
    answer: (
      <>
        <p>
          O caso base é o "chão" do qual partiremos. Para formar o valor zero,
          gastamos zero moedas — fim. Todos os outros valores começam como
          inalcançáveis (∞).
        </p>
        <p className="mt-2">
          Inicializar com ∞ é crucial: na hora de comparar candidatos, ∞ + 1
          continua sendo pior que qualquer combinação real.
        </p>
      </>
    ),
    formula: 'dp[0] = 0    e    dp[j] = ∞ para j > 0',
    codeLanguage: 'python',
    codeSnippet: `    INF = float('inf')
    dp = [INF] * (amount + 1)
▶    dp[0] = 0
    choice = [None] * (amount + 1)`,
  },
  {
    id: 'recurrence',
    title: 'Recorrência',
    question: 'Como derivo a resposta de dp[j] a partir dos dp[k] menores que já resolvi?',
    answer: (
      <>
        <p>
          Para formar j, uma das moedas disponíveis precisa ser a "última" colocada.
          Se essa última moeda for c, então antes dela eu formava j − c.
        </p>
        <p className="mt-2">
          Como quero o mínimo, testo cada moeda e pego a melhor opção. Cada
          escolha gasta uma moeda a mais que dp[j − c].
        </p>
      </>
    ),
    formula: 'dp[j] = min sobre todas as moedas c, com c ≤ j, de ( dp[j − c] + 1 )',
    codeLanguage: 'python',
    codeSnippet: `    for j in range(1, amount + 1):
        for c in coins:
▶            if c <= j and dp[j - c] != INF:
▶                candidate = dp[j - c] + 1
▶                if candidate < dp[j]:
▶                    dp[j] = candidate
                    choice[j] = c`,
  },
  {
    id: 'order',
    title: 'Ordem de Preenchimento',
    question: 'Em que ordem posso preencher a tabela para que, ao calcular cada dp[j], suas dependências já estejam prontas?',
    answer: (
      <>
        <p>
          dp[j] depende de dp[j − c] com c &gt; 0, portanto sempre depende de
          índices <strong>menores</strong>. Logo, percorrer j de 1 até amount em
          ordem crescente garante que dp[j − c] já foi resolvido quando vamos
          usá-lo.
        </p>
        <p className="mt-2">
          Este é o padrão clássico de DP bottom-up: começamos pelo caso base e
          construímos para cima, em ondas.
        </p>
      </>
    ),
    formula: 'j: 0 → 1 → 2 → ... → amount  (crescente)',
    codeLanguage: 'python',
    codeSnippet: `    dp[0] = 0
▶    for j in range(1, amount + 1):
        for c in coins:
            if c <= j and dp[j - c] != INF:
                candidate = dp[j - c] + 1
                # ...`,
  },
  {
    id: 'reconstruction',
    title: 'Reconstrução',
    question: 'Como recupero não só o valor ótimo, mas a sequência de escolhas que o produziu?',
    answer: (
      <>
        <p>
          dp[amount] é o número mínimo, mas perdemos quais moedas formaram esse
          mínimo. Para resgatar a combinação, guardamos em choice[j] qual moeda
          foi usada quando dp[j] foi atualizado.
        </p>
        <p className="mt-2">
          No fim, fazemos backtrack: partimos de j = amount, pegamos choice[j],
          subtraímos do j e repetimos até chegar em zero.
        </p>
      </>
    ),
    formula: 'j ← amount;  enquanto j > 0:  coleta choice[j], j ← j − choice[j]',
    codeLanguage: 'python',
    codeSnippet: `    if dp[amount] == INF:
        return -1, []
    coins_used = []
    j = amount
▶    while j > 0:
▶        coins_used.append(choice[j])
▶        j -= choice[j]
    return dp[amount], coins_used`,
  },
]
