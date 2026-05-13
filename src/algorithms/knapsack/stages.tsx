import type { DPStage } from '@/components/dp/DPDesignFlow'

export const knapsackStages: DPStage[] = [
  {
    id: 'state',
    title: 'Identificar Estado',
    question: 'Quais informações eu preciso lembrar para resolver um subproblema?',
    answer: (
      <>
        <p>
          Diferente do Coin Change (1 dimensão), aqui temos <strong>dois eixos
          de variação</strong>: quais itens já considerei e quanta capacidade
          ainda tenho na mochila. Os dois precisam estar no estado.
        </p>
        <p className="mt-2">
          Indexamos linhas pelos itens (0 = nenhum item, n = todos) e colunas pela
          capacidade restante (0 a W). Cada célula guarda o melhor valor possível
          dentro desses limites.
        </p>
      </>
    ),
    formula:
      'dp[i][w] = melhor valor usando apenas os primeiros i itens com capacidade w',
    codeLanguage: 'python',
    codeSnippet: `def knapsack(weights, values, capacity):
    n = len(weights)
▶    dp = [[0] * (capacity + 1) for _ in range(n + 1)]`,
  },
  {
    id: 'base',
    title: 'Caso Base',
    question: 'Que combinações de eixos têm resposta trivial sem cálculo?',
    answer: (
      <>
        <p>
          Quando i = 0, nenhum item está disponível: não tem como ter valor, então
          dp[0][w] = 0 para todo w. Quando w = 0, a mochila não cabe nada:
          dp[i][0] = 0 para todo i.
        </p>
        <p className="mt-2">
          A tabela inteira começa em zero, então tanto a linha 0 quanto a coluna 0
          já vêm corretas. Isso simplifica o código — nenhuma inicialização especial
          é necessária.
        </p>
      </>
    ),
    formula: 'dp[0][w] = 0  ∀ w     dp[i][0] = 0  ∀ i',
    codeLanguage: 'python',
    codeSnippet: `    n = len(weights)
▶    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    # linha 0 e coluna 0 já zeradas — caso base satisfeito`,
  },
  {
    id: 'recurrence',
    title: 'Recorrência',
    question: 'Para cada novo item considerado, quais são minhas opções e qual delas é a melhor?',
    answer: (
      <>
        <p>
          Para cada par (item i, capacidade w) temos uma decisão binária:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>
            <strong>Skip:</strong> ignoro este item — herdo dp[i−1][w].
          </li>
          <li>
            <strong>Take:</strong> levo este item — gasto wi da capacidade e
            ganho vi de valor, somando a dp[i−1][w−wi].
          </li>
        </ul>
        <p className="mt-2">
          Take só está disponível se o item couber (wi ≤ w). Pegamos sempre o
          maior dos dois.
        </p>
      </>
    ),
    formula:
      'dp[i][w] = max( dp[i−1][w],   dp[i−1][w − wi] + vi  se wi ≤ w )',
    codeLanguage: 'python',
    codeSnippet: `    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] > w:
                dp[i][w] = dp[i - 1][w]
            else:
                skip = dp[i - 1][w]
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
▶                dp[i][w] = max(skip, take)`,
  },
  {
    id: 'order',
    title: 'Ordem de Preenchimento',
    question: 'Cada célula olha para quais células antes dela? Qual ordem garante que estejam prontas?',
    answer: (
      <>
        <p>
          dp[i][w] depende apenas de células com índice <strong>i−1</strong>
          (linha anterior). Isso significa que, percorrendo as linhas de cima
          para baixo, sempre que chegamos em dp[i][w], a linha i−1 já está pronta.
        </p>
        <p className="mt-2">
          Dentro de uma linha, a ordem das colunas não importa para a correção —
          cada célula só lê valores da linha anterior, não da linha atual. (Esse
          fato permite a otimização para O(W) de espaço, com cuidado na direção
          do loop.)
        </p>
      </>
    ),
    formula: 'i: 0 → 1 → 2 → ... → n     dentro de i, w: 0 → W',
    codeLanguage: 'python',
    codeSnippet: `▶    for i in range(1, n + 1):
▶        for w in range(capacity + 1):
            # cada dp[i][w] só lê dp[i-1][...]
            # → a linha anterior sempre está pronta`,
  },
  {
    id: 'reconstruction',
    title: 'Reconstrução',
    question: 'Como descubro quais itens foram escolhidos, e não só o valor total?',
    answer: (
      <>
        <p>
          Não precisamos de uma tabela auxiliar de "choice" aqui — a própria DP
          já tem informação suficiente. Comparamos: se dp[i][w] = dp[i−1][w], o
          item i <em>não</em> foi escolhido (o valor é o mesmo que sem ele).
          Caso contrário, o item entrou, e devemos descontar seu peso da
          capacidade restante.
        </p>
        <p className="mt-2">
          Começamos no canto inferior direito (dp[n][W]) e subimos linha a linha,
          ajustando w sempre que pegamos um item. Quando i chega em 0, terminamos.
        </p>
      </>
    ),
    formula:
      'i ← n, w ← W;  enquanto i > 0:  se dp[i][w] ≠ dp[i−1][w], pega item i, w ← w − wi;  i ← i − 1',
    codeLanguage: 'python',
    codeSnippet: `    chosen = []
    i, w = n, capacity
▶    while i > 0:
▶        if dp[i][w] != dp[i - 1][w]:
▶            chosen.append(i - 1)
▶            w -= weights[i - 1]
        i -= 1
    return dp[n][capacity], list(reversed(chosen))`,
  },
]
