// src/algorithms/bubble-sort/theory.ts
export const theory = {
  howItWorks: {
    title: 'Como Funciona',
    content: `
O Bubble Sort é um algoritmo de ordenação simples que percorre repetidamente a lista,
compara elementos adjacentes e os troca se estiverem na ordem errada.

O processo é repetido até que a lista esteja ordenada. O nome "bubble" (bolha) vem do
fato de que os elementos maiores "flutuam" para o final da lista a cada iteração.
    `.trim(),
    steps: [
      'Começamos do primeiro elemento do array',
      'Comparamos o elemento atual com o próximo',
      'Se o atual for maior, trocamos os dois',
      'Movemos para o próximo par de elementos',
      'Repetimos até o final do array',
      'A cada passagem, o maior elemento "flutua" para o final',
      'Repetimos o processo n-1 vezes',
    ],
  },

  bigO: {
    time: {
      notation: 'O(n²)',
      explanation: 'Dois loops aninhados: o externo roda n-1 vezes, o interno roda em média n/2 vezes.',
      proof: 'Total de comparações: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)',
    },
    space: {
      notation: 'O(1)',
      explanation: 'Ordenação in-place. Usa apenas variáveis auxiliares para troca.',
    },
    bestCase: {
      notation: 'O(n)',
      explanation: 'Quando o array já está ordenado e usamos a otimização de flag.',
    },
    worstCase: {
      notation: 'O(n²)',
      explanation: 'Quando o array está em ordem reversa.',
    },
  },

  comparisons: [
    {
      name: 'Bubble Sort',
      slug: 'bubble-sort',
      time: 'O(n²)',
      space: 'O(1)',
      stable: true,
      bestFor: 'Arrays pequenos, quase ordenados',
    },
    {
      name: 'Merge Sort',
      slug: 'merge-sort',
      time: 'O(n log n)',
      space: 'O(n)',
      stable: true,
      bestFor: 'Grandes datasets, estabilidade necessária',
    },
    {
      name: 'Quick Sort',
      slug: 'quick-sort',
      time: 'O(n log n)',
      space: 'O(log n)',
      stable: false,
      bestFor: 'Uso geral, performance média',
    },
    {
      name: 'Insertion Sort',
      slug: 'insertion-sort',
      time: 'O(n²)',
      space: 'O(1)',
      stable: true,
      bestFor: 'Arrays pequenos, streaming de dados',
    },
  ],

  keyInsight: 'O Bubble Sort é didático, mas ineficiente. Na prática, use Merge Sort ou Quick Sort.',

  commonMistakes: [
    'Esquecer de reduzir o range interno a cada iteração (elementos já estão no lugar)',
    'Não implementar a otimização de early exit quando nenhuma troca é feita',
    'Confundir índices ao fazer a troca',
  ],
}
