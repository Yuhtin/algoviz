import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'single-cycle-q1',
      question: 'Explique o que significa um "ciclo único" em um array e como verificar se um array possui essa propriedade.',
      difficulty: 'easy',
      companies: ['Google', 'Facebook', 'Amazon'],
      tip: 'Pense no array como circular e no que significa visitar cada elemento exatamente uma vez.',
      rubric: [
        {
          id: 'r1',
          point: 'Define ciclo único: visitar todos os elementos exatamente uma vez e retornar ao início',
          required: true,
        },
        {
          id: 'r2',
          point: 'Explica que cada elemento indica quantas posições saltar',
          required: true,
        },
        {
          id: 'r3',
          point: 'Menciona que o array é tratado como circular (usando módulo)',
          required: true,
        },
        {
          id: 'r4',
          point: 'Complexidade O(n) tempo e O(1) espaço',
          required: false,
        },
      ],
      idealAnswer: `Um ciclo único em um array significa que, começando do índice 0 e seguindo os saltos indicados por cada elemento, conseguimos visitar todos os elementos exatamente uma vez e retornar ao índice 0.

Cada elemento do array representa o número de posições para saltar: valores positivos saltam para a direita, negativos para a esquerda. O array é circular, então saltos além do final voltam ao início.

Para verificar, mantemos um contador de elementos visitados e o índice atual. A cada iteração, saltamos para o próximo índice usando módulo. Se visitarmos n elementos e terminarmos no índice 0, temos um ciclo único.

Complexidade: O(n) tempo (visitamos cada elemento uma vez) e O(1) espaço (apenas variáveis auxiliares).`,
    },
    {
      id: 'single-cycle-q2',
      question: 'Como você trataria índices negativos ao calcular o próximo índice em um array circular?',
      difficulty: 'medium',
      companies: ['Microsoft', 'Apple', 'Uber'],
      tip: 'O operador módulo em algumas linguagens retorna valores negativos para operandos negativos.',
      followUp: 'Como isso difere entre Python e outras linguagens como Java ou C++?',
      rubric: [
        {
          id: 'r1',
          point: 'Identifica que módulo pode retornar negativo em algumas linguagens',
          required: true,
        },
        {
          id: 'r2',
          point: 'Apresenta a fórmula ((x % n) + n) % n para garantir resultado positivo',
          required: true,
        },
        {
          id: 'r3',
          point: 'Menciona que Python já trata isso automaticamente',
          required: false,
        },
        {
          id: 'r4',
          point: 'Explica por que índices negativos ocorrem (saltos negativos grandes)',
          required: false,
        },
      ],
      idealAnswer: `O operador módulo se comporta diferentemente em várias linguagens quando o operando é negativo.

Em linguagens como C++, Java e Rust, -7 % 5 retorna -2. Isso pode causar índices negativos inválidos.

A solução universal é usar a fórmula: ((x % n) + n) % n

Por exemplo: ((-7 % 5) + 5) % 5 = (-2 + 5) % 5 = 3

Em Python, o módulo já retorna valores positivos para divisores positivos, então -7 % 5 = 3 diretamente.

Índices negativos ocorrem quando temos saltos negativos que ultrapassam o início do array, como saltar -10 posições a partir do índice 2 em um array de tamanho 5.`,
    },
    {
      id: 'single-cycle-q3',
      question: 'Qual a diferença entre detectar se existe um ciclo e verificar se o ciclo é único (hamiltoniano)?',
      difficulty: 'hard',
      companies: ['Google', 'Amazon', 'Bloomberg'],
      tip: 'Pense em grafos: um ciclo pode existir sem passar por todos os vértices.',
      followUp: 'Como você adaptaria o algoritmo de Floyd para este problema?',
      rubric: [
        {
          id: 'r1',
          point: 'Distingue detecção de ciclo (existe loop) vs ciclo hamiltoniano (passa por todos)',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que Floyd detecta existência mas não garante unicidade',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica que ciclo único requer contar elementos visitados',
          required: true,
        },
        {
          id: 'r4',
          point: 'Discute complexidade: ambos O(n) tempo, mas ciclo único precisa verificar contagem',
          required: false,
        },
        {
          id: 'r5',
          point: 'Menciona que problema de ciclo hamiltoniano em grafos gerais é NP-completo',
          required: false,
        },
      ],
      idealAnswer: `Detecção de ciclo e verificação de ciclo único são problemas diferentes:

Detecção de ciclo: Verifica se existe algum loop na estrutura. O algoritmo de Floyd (tartaruga e lebre) faz isso em O(n) tempo e O(1) espaço usando dois ponteiros em velocidades diferentes.

Ciclo único (hamiltoniano): Verifica se o ciclo passa por TODOS os elementos exatamente uma vez. Isso requer contar quantos elementos visitamos.

A diferença prática: um array como [2, 2, 2, 2] tem um ciclo (volta ao início), mas não é um ciclo único pois não visita todos os elementos.

Para adaptar Floyd ao problema de ciclo único, não basta detectar que os ponteiros se encontram - precisamos verificar que encontraram após visitar exatamente n elementos e que terminaram no índice 0.

Nota: Em grafos gerais, encontrar ciclo hamiltoniano é NP-completo. Porém, para arrays com saltos determinados (cada vértice tem exatamente uma aresta de saída), podemos resolver em O(n).`,
    },
  ],
}
