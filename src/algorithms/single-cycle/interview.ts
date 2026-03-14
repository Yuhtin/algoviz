import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'single-cycle-q1',
      question: 'Explique o que significa um "ciclo unico" em um array e como verificar se um array possui essa propriedade.',
      difficulty: 'easy',
      companies: ['Google', 'Facebook', 'Amazon'],
      tip: 'Pense no array como circular e no que significa visitar cada elemento exatamente uma vez.',
      rubric: [
        {
          id: 'r1',
          point: 'Define ciclo unico: visitar todos os elementos exatamente uma vez e retornar ao inicio',
          required: true,
        },
        {
          id: 'r2',
          point: 'Explica que cada elemento indica quantas posicoes saltar',
          required: true,
        },
        {
          id: 'r3',
          point: 'Menciona que o array e tratado como circular (usando modulo)',
          required: true,
        },
        {
          id: 'r4',
          point: 'Complexidade O(n) tempo e O(1) espaco',
          required: false,
        },
      ],
      idealAnswer: `Um ciclo unico em um array significa que, comecando do indice 0 e seguindo os saltos indicados por cada elemento, conseguimos visitar todos os elementos exatamente uma vez e retornar ao indice 0.

Cada elemento do array representa o numero de posicoes para saltar: valores positivos saltam para a direita, negativos para a esquerda. O array e circular, entao saltos alem do final voltam ao inicio.

Para verificar, mantemos um contador de elementos visitados e o indice atual. A cada iteracao, saltamos para o proximo indice usando modulo. Se visitarmos n elementos e terminarmos no indice 0, temos um ciclo unico.

Complexidade: O(n) tempo (visitamos cada elemento uma vez) e O(1) espaco (apenas variaveis auxiliares).`,
    },
    {
      id: 'single-cycle-q2',
      question: 'Como voce trataria indices negativos ao calcular o proximo indice em um array circular?',
      difficulty: 'medium',
      companies: ['Microsoft', 'Apple', 'Uber'],
      tip: 'O operador modulo em algumas linguagens retorna valores negativos para operandos negativos.',
      followUp: 'Como isso difere entre Python e outras linguagens como Java ou C++?',
      rubric: [
        {
          id: 'r1',
          point: 'Identifica que modulo pode retornar negativo em algumas linguagens',
          required: true,
        },
        {
          id: 'r2',
          point: 'Apresenta a formula ((x % n) + n) % n para garantir resultado positivo',
          required: true,
        },
        {
          id: 'r3',
          point: 'Menciona que Python ja trata isso automaticamente',
          required: false,
        },
        {
          id: 'r4',
          point: 'Explica por que indices negativos ocorrem (saltos negativos grandes)',
          required: false,
        },
      ],
      idealAnswer: `O operador modulo se comporta diferentemente em varias linguagens quando o operando e negativo.

Em linguagens como C++, Java e Rust, -7 % 5 retorna -2. Isso pode causar indices negativos invalidos.

A solucao universal e usar a formula: ((x % n) + n) % n

Por exemplo: ((-7 % 5) + 5) % 5 = (-2 + 5) % 5 = 3

Em Python, o modulo ja retorna valores positivos para divisores positivos, entao -7 % 5 = 3 diretamente.

Indices negativos ocorrem quando temos saltos negativos que ultrapassam o inicio do array, como saltar -10 posicoes a partir do indice 2 em um array de tamanho 5.`,
    },
    {
      id: 'single-cycle-q3',
      question: 'Qual a diferenca entre detectar se existe um ciclo e verificar se o ciclo e unico (hamiltoniano)?',
      difficulty: 'hard',
      companies: ['Google', 'Amazon', 'Bloomberg'],
      tip: 'Pense em grafos: um ciclo pode existir sem passar por todos os vertices.',
      followUp: 'Como voce adaptaria o algoritmo de Floyd para este problema?',
      rubric: [
        {
          id: 'r1',
          point: 'Distingue deteccao de ciclo (existe loop) vs ciclo hamiltoniano (passa por todos)',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que Floyd detecta existencia mas nao garante unicidade',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica que ciclo unico requer contar elementos visitados',
          required: true,
        },
        {
          id: 'r4',
          point: 'Discute complexidade: ambos O(n) tempo, mas ciclo unico precisa verificar contagem',
          required: false,
        },
        {
          id: 'r5',
          point: 'Menciona que problema de ciclo hamiltoniano em grafos gerais e NP-completo',
          required: false,
        },
      ],
      idealAnswer: `Deteccao de ciclo e verificacao de ciclo unico sao problemas diferentes:

**Deteccao de ciclo:** Verifica se existe algum loop na estrutura. O algoritmo de Floyd (tartaruga e lebre) faz isso em O(n) tempo e O(1) espaco usando dois ponteiros em velocidades diferentes.

**Ciclo unico (hamiltoniano):** Verifica se o ciclo passa por TODOS os elementos exatamente uma vez. Isso requer contar quantos elementos visitamos.

A diferenca pratica: um array como [2, 2, 2, 2] tem um ciclo (volta ao inicio), mas nao e um ciclo unico pois nao visita todos os elementos.

Para adaptar Floyd ao problema de ciclo unico, nao basta detectar que os ponteiros se encontram - precisamos verificar que encontraram apos visitar exatamente n elementos e que terminaram no indice 0.

Nota: Em grafos gerais, encontrar ciclo hamiltoniano e NP-completo. Porem, para arrays com saltos determinados (cada vertice tem exatamente uma aresta de saida), podemos resolver em O(n).`,
    },
  ],
}
