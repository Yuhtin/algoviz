// src/algorithms/single-cycle/theory.ts
export const theory = {
  howItWorks: {
    title: 'Como Funciona',
    content: `
O algoritmo de Ciclo Unico verifica se e possivel visitar todos os elementos de um array
exatamente uma vez, seguindo os saltos indicados por cada elemento, e retornar ao indice inicial.

Cada elemento do array representa o numero de posicoes para saltar (positivo = direita, negativo = esquerda).
O array e circular, entao saltos alem do final voltam ao inicio.
    `.trim(),
    steps: [
      'Comeca no indice 0',
      'Salta o numero de posicoes indicado pelo elemento atual',
      'Usa modulo para tratar o array como circular',
      'Marca cada posicao visitada',
      'Repete ate visitar n elementos',
      'Verifica se terminou no indice 0',
      'Retorna true se visitou todos exatamente uma vez e voltou ao inicio',
    ],
  },

  bigO: {
    time: {
      notation: 'O(n)',
      explanation: 'Visita cada elemento no maximo uma vez.',
      proof: 'Loop executa exatamente n iteracoes, cada operacao e O(1).',
    },
    space: {
      notation: 'O(1)',
      explanation: 'Usa apenas variaveis auxiliares, sem estruturas adicionais.',
    },
    bestCase: {
      notation: 'O(n)',
      explanation: 'Sempre precisa verificar todos os elementos.',
    },
    worstCase: {
      notation: 'O(n)',
      explanation: 'Complexidade constante independente do input.',
    },
  },

  comparisons: [
    {
      name: 'Ciclo Unico',
      slug: 'single-cycle-check',
      time: 'O(n)',
      space: 'O(1)',
      bestFor: 'Verificar ciclo hamiltoniano em array',
    },
    {
      name: 'Floyd Cycle Detection',
      slug: 'floyd-cycle',
      time: 'O(n)',
      space: 'O(1)',
      bestFor: 'Detectar ciclo em linked list',
    },
    {
      name: 'DFS para Ciclos',
      slug: 'dfs-cycle',
      time: 'O(V+E)',
      space: 'O(V)',
      bestFor: 'Detectar ciclo em grafos',
    },
  ],

  keyInsight: 'A chave e garantir que visitamos EXATAMENTE n elementos e terminamos no indice 0.',

  commonMistakes: [
    'Esquecer de tratar indices negativos no calculo do modulo',
    'Nao verificar se voltou ao indice 0 no final',
    'Usar estrutura de dados extra (set) quando nao e necessario',
    'Confundir deteccao de ciclo com verificacao de ciclo unico',
  ],
}
