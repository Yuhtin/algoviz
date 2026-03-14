// src/algorithms/bucket-sort/theory.ts
export const theory = {
  howItWorks: {
    title: 'Como o Bucket Sort Funciona',
    content:
      'Bucket Sort e um algoritmo de ordenacao distributiva que funciona dividindo o array em varios "buckets" (baldes). Cada bucket armazena uma faixa de valores, e apos distribuir todos os elementos, cada bucket e ordenado individualmente (geralmente com insertion sort). Finalmente, os buckets sao concatenados para formar o array ordenado.',
    steps: [
      'Criar n buckets vazios (onde n e o tamanho do array)',
      'Distribuir cada elemento para o bucket apropriado baseado em seu valor',
      'Ordenar cada bucket individualmente',
      'Concatenar todos os buckets em ordem para obter o resultado final',
    ],
  },
  bigO: {
    time: {
      notation: 'O(n + k)',
      explanation:
        'No caso medio, quando os elementos estao uniformemente distribuidos, o tempo e linear. n e o numero de elementos e k e o numero de buckets.',
      proof:
        'Distribuicao: O(n) para colocar elementos nos buckets. Ordenacao: O(n/k * log(n/k)) por bucket, totalizando O(n) quando bem distribuido. Concatenacao: O(k).',
    },
    space: {
      notation: 'O(n + k)',
      explanation: 'Precisamos de espaco para os n elementos distribuidos em k buckets.',
    },
    bestCase: {
      notation: 'O(n + k)',
      explanation: 'Quando elementos estao uniformemente distribuidos entre os buckets.',
    },
    worstCase: {
      notation: 'O(n²)',
      explanation:
        'Quando todos os elementos vao para o mesmo bucket, degradando para o algoritmo de ordenacao interno.',
    },
  },
  comparisons: [
    { name: 'Bucket Sort', slug: 'bucket-sort', time: 'O(n+k)', space: 'O(n+k)', stable: true, bestFor: 'Dados uniformemente distribuidos' },
    { name: 'Bubble Sort', slug: 'bubble-sort', time: 'O(n²)', space: 'O(1)', stable: true, bestFor: 'Arrays pequenos' },
    { name: 'Counting Sort', time: 'O(n+k)', space: 'O(k)', stable: true, bestFor: 'Inteiros em faixa conhecida' },
    { name: 'Radix Sort', time: 'O(d*n)', space: 'O(n+k)', stable: true, bestFor: 'Inteiros com digitos fixos' },
  ],
  keyInsight:
    'Bucket Sort e mais eficiente quando os dados estao uniformemente distribuidos no intervalo. E particularmente util para ordenar numeros de ponto flutuante entre 0 e 1.',
  commonMistakes: [
    'Assumir que sempre sera O(n) - depende da distribuicao dos dados',
    'Usar poucos buckets, causando muitos elementos por bucket',
    'Nao considerar o custo do algoritmo de ordenacao interno',
    'Aplicar em dados nao uniformemente distribuidos sem ajustar os buckets',
  ],
}
