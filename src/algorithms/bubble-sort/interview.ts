// src/algorithms/bubble-sort/interview.ts
import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'bubble-sort-q1',
      question: 'Explique como funciona o Bubble Sort e qual sua complexidade de tempo e espaço.',
      difficulty: 'easy',
      companies: ['Google', 'Amazon', 'Microsoft'],
      tip: 'Pense em como os elementos "borbulham" para suas posições corretas.',
      rubric: [
        {
          id: 'r1',
          point: 'Explica que compara elementos adjacentes e troca se estiverem fora de ordem',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que repete o processo até que nenhuma troca seja necessária',
          required: true,
        },
        {
          id: 'r3',
          point: 'Complexidade de tempo: O(n²) no pior e médio caso, O(n) no melhor caso (já ordenado)',
          required: true,
        },
        {
          id: 'r4',
          point: 'Complexidade de espaço: O(1) - algoritmo in-place',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona que o maior elemento "borbulha" para o final a cada passagem',
          required: false,
        },
      ],
      idealAnswer: `O Bubble Sort funciona comparando pares de elementos adjacentes e trocando-os se estiverem na ordem errada. O processo é repetido do início ao fim do array múltiplas vezes até que nenhuma troca seja necessária, indicando que o array está ordenado.

A cada passagem completa pelo array, o maior elemento não ordenado "borbulha" para sua posição correta no final. Por isso, a cada iteração, podemos ignorar um elemento a mais no final.

Complexidade de tempo:
- Pior caso: O(n²) - quando o array está em ordem reversa
- Caso médio: O(n²)
- Melhor caso: O(n) - quando o array já está ordenado (com otimização de flag)

Complexidade de espaço: O(1) - é um algoritmo in-place, pois só usa variáveis auxiliares constantes para realizar as trocas.`,
    },
    {
      id: 'bubble-sort-q2',
      question: 'Quais otimizações podem ser aplicadas ao Bubble Sort básico? Implemente uma versão otimizada.',
      difficulty: 'medium',
      companies: ['Facebook', 'Apple', 'Bloomberg'],
      tip: 'Considere como detectar quando o array já está ordenado e como reduzir comparações desnecessárias.',
      followUp: 'Como a otimização afeta a complexidade no melhor caso?',
      rubric: [
        {
          id: 'r1',
          point: 'Usa flag para detectar se houve troca - termina cedo se nenhuma troca ocorrer',
          required: true,
        },
        {
          id: 'r2',
          point: 'Reduz o limite do loop interno a cada passagem (ignora elementos já ordenados)',
          required: true,
        },
        {
          id: 'r3',
          point: 'Implementação correta com ambas otimizações',
          required: true,
        },
        {
          id: 'r4',
          point: 'Explica que o melhor caso passa de O(n²) para O(n) com a flag',
          required: false,
        },
        {
          id: 'r5',
          point: 'Menciona otimização adicional: rastrear última posição de troca',
          required: false,
        },
      ],
      idealAnswer: `Duas otimizações principais podem ser aplicadas:

1. Flag de troca: Se nenhuma troca ocorrer em uma passagem completa, o array já está ordenado e podemos terminar. Isso melhora o melhor caso para O(n).

2. Reduzir limite do loop interno: A cada passagem, o maior elemento vai para sua posição final. Então, podemos reduzir o número de comparações a cada iteração.

Implementação otimizada:

\`\`\`python
def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        # Reduz limite: n-i-1 elementos já estão ordenados
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # Se nenhuma troca, array ordenado
        if not swapped:
            break
    return arr
\`\`\`

Uma otimização adicional é rastrear a última posição onde ocorreu uma troca. Todos os elementos após essa posição já estão ordenados.`,
    },
    {
      id: 'bubble-sort-q3',
      question: 'Compare Bubble Sort com outros algoritmos de ordenação O(n²) como Insertion Sort e Selection Sort. Quando você escolheria cada um?',
      difficulty: 'hard',
      companies: ['Google', 'Microsoft', 'Uber'],
      tip: 'Considere estabilidade, número de trocas, e comportamento com dados parcialmente ordenados.',
      followUp: 'Por que Insertion Sort é geralmente preferido na prática sobre Bubble Sort?',
      rubric: [
        {
          id: 'r1',
          point: 'Compara corretamente as complexidades de tempo dos três algoritmos',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que Insertion Sort é mais eficiente para dados parcialmente ordenados',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica estabilidade: Bubble e Insertion são estáveis, Selection não é',
          required: true,
        },
        {
          id: 'r4',
          point: 'Selection Sort minimiza número de trocas (O(n)), útil quando trocas são caras',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona que Insertion Sort é usado em algoritmos híbridos como Timsort',
          required: false,
        },
        {
          id: 'r6',
          point: 'Discute comportamento de cache e localidade de referência',
          required: false,
        },
      ],
      idealAnswer: `Comparação:

| Aspecto | Bubble Sort | Insertion Sort | Selection Sort |
|---------|-------------|----------------|----------------|
| Tempo (pior) | O(n²) | O(n²) | O(n²) |
| Tempo (melhor) | O(n)* | O(n) | O(n²) |
| Trocas (pior) | O(n²) | O(n²) | O(n) |
| Estável | Sim | Sim | Não |

*Com otimização de flag

Quando usar cada um:

Bubble Sort: Raramente usado na prática. Útil apenas para fins educacionais ou datasets muito pequenos. Sua única vantagem é a detecção fácil de array já ordenado.

Insertion Sort: Melhor escolha para:
- Dados quase ordenados (desempenho próximo a O(n))
- Datasets pequenos (overhead baixo)
- Ordenação online (pode ordenar conforme dados chegam)
- Usado em algoritmos híbridos (Timsort usa para subarrays pequenos)
- Boa localidade de cache

Selection Sort: Preferido quando:
- Trocas são muito caras (faz apenas O(n) trocas)
- Memória auxiliar é extremamente limitada
- Não precisa de estabilidade

Na prática, Insertion Sort é quase sempre preferido sobre Bubble Sort porque:
1. Faz menos comparações em dados parcialmente ordenados
2. Melhor localidade de referência
3. Mais eficiente em termos de movimentação de dados`,
    },
  ],
}
