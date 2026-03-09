// src/algorithms/bubble-sort/interview.ts
import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'bubble-sort-q1',
      question: 'Explique como funciona o Bubble Sort e qual sua complexidade de tempo e espaco.',
      difficulty: 'easy',
      companies: ['Google', 'Amazon', 'Microsoft'],
      tip: 'Pense em como os elementos "borbulham" para suas posicoes corretas.',
      rubric: [
        {
          id: 'r1',
          point: 'Explica que compara elementos adjacentes e troca se estiverem fora de ordem',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que repete o processo ate que nenhuma troca seja necessaria',
          required: true,
        },
        {
          id: 'r3',
          point: 'Complexidade de tempo: O(n^2) no pior e medio caso, O(n) no melhor caso (ja ordenado)',
          required: true,
        },
        {
          id: 'r4',
          point: 'Complexidade de espaco: O(1) - algoritmo in-place',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona que o maior elemento "borbulha" para o final a cada passagem',
          required: false,
        },
      ],
      idealAnswer: `O Bubble Sort funciona comparando pares de elementos adjacentes e trocando-os se estiverem na ordem errada. O processo e repetido do inicio ao fim do array multiplas vezes ate que nenhuma troca seja necessaria, indicando que o array esta ordenado.

A cada passagem completa pelo array, o maior elemento nao ordenado "borbulha" para sua posicao correta no final. Por isso, a cada iteracao, podemos ignorar um elemento a mais no final.

Complexidade de tempo:
- Pior caso: O(n^2) - quando o array esta em ordem reversa
- Caso medio: O(n^2)
- Melhor caso: O(n) - quando o array ja esta ordenado (com otimizacao de flag)

Complexidade de espaco: O(1) - e um algoritmo in-place, pois so usa variaveis auxiliares constantes para realizar as trocas.`,
    },
    {
      id: 'bubble-sort-q2',
      question: 'Quais otimizacoes podem ser aplicadas ao Bubble Sort basico? Implemente uma versao otimizada.',
      difficulty: 'medium',
      companies: ['Facebook', 'Apple', 'Bloomberg'],
      tip: 'Considere como detectar quando o array ja esta ordenado e como reduzir comparacoes desnecessarias.',
      followUp: 'Como a otimizacao afeta a complexidade no melhor caso?',
      rubric: [
        {
          id: 'r1',
          point: 'Usa flag para detectar se houve troca - termina cedo se nenhuma troca ocorrer',
          required: true,
        },
        {
          id: 'r2',
          point: 'Reduz o limite do loop interno a cada passagem (ignora elementos ja ordenados)',
          required: true,
        },
        {
          id: 'r3',
          point: 'Implementacao correta com ambas otimizacoes',
          required: true,
        },
        {
          id: 'r4',
          point: 'Explica que o melhor caso passa de O(n^2) para O(n) com a flag',
          required: false,
        },
        {
          id: 'r5',
          point: 'Menciona otimizacao adicional: rastrear ultima posicao de troca',
          required: false,
        },
      ],
      idealAnswer: `Duas otimizacoes principais podem ser aplicadas:

1. **Flag de troca**: Se nenhuma troca ocorrer em uma passagem completa, o array ja esta ordenado e podemos terminar. Isso melhora o melhor caso para O(n).

2. **Reduzir limite do loop interno**: A cada passagem, o maior elemento vai para sua posicao final. Entao, podemos reduzir o numero de comparacoes a cada iteracao.

Implementacao otimizada:

\`\`\`python
def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        # Reduz limite: n-i-1 elementos ja estao ordenados
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # Se nenhuma troca, array ordenado
        if not swapped:
            break
    return arr
\`\`\`

Uma otimizacao adicional e rastrear a ultima posicao onde ocorreu uma troca. Todos os elementos apos essa posicao ja estao ordenados.`,
    },
    {
      id: 'bubble-sort-q3',
      question: 'Compare Bubble Sort com outros algoritmos de ordenacao O(n^2) como Insertion Sort e Selection Sort. Quando voce escolheria cada um?',
      difficulty: 'hard',
      companies: ['Google', 'Microsoft', 'Uber'],
      tip: 'Considere estabilidade, numero de trocas, e comportamento com dados parcialmente ordenados.',
      followUp: 'Por que Insertion Sort e geralmente preferido na pratica sobre Bubble Sort?',
      rubric: [
        {
          id: 'r1',
          point: 'Compara corretamente as complexidades de tempo dos tres algoritmos',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que Insertion Sort e mais eficiente para dados parcialmente ordenados',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica estabilidade: Bubble e Insertion sao estaveis, Selection nao e',
          required: true,
        },
        {
          id: 'r4',
          point: 'Selection Sort minimiza numero de trocas (O(n)), util quando trocas sao caras',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona que Insertion Sort e usado em algoritmos hibridos como Timsort',
          required: false,
        },
        {
          id: 'r6',
          point: 'Discute comportamento de cache e localidade de referencia',
          required: false,
        },
      ],
      idealAnswer: `**Comparacao:**

| Aspecto | Bubble Sort | Insertion Sort | Selection Sort |
|---------|-------------|----------------|----------------|
| Tempo (pior) | O(n^2) | O(n^2) | O(n^2) |
| Tempo (melhor) | O(n)* | O(n) | O(n^2) |
| Trocas (pior) | O(n^2) | O(n^2) | O(n) |
| Estavel | Sim | Sim | Nao |

*Com otimizacao de flag

**Quando usar cada um:**

**Bubble Sort**: Raramente usado na pratica. Util apenas para fins educacionais ou datasets muito pequenos. Sua unica vantagem e a deteccao facil de array ja ordenado.

**Insertion Sort**: Melhor escolha para:
- Dados quase ordenados (desempenho proximo a O(n))
- Datasets pequenos (overhead baixo)
- Ordenacao online (pode ordenar conforme dados chegam)
- Usado em algoritmos hibridos (Timsort usa para subarrays pequenos)
- Boa localidade de cache

**Selection Sort**: Preferido quando:
- Trocas sao muito caras (faz apenas O(n) trocas)
- Memoria auxiliar e extremamente limitada
- Nao precisa de estabilidade

Na pratica, Insertion Sort e quase sempre preferido sobre Bubble Sort porque:
1. Faz menos comparacoes em dados parcialmente ordenados
2. Melhor localidade de referencia
3. Mais eficiente em termos de movimentacao de dados`,
    },
  ],
}
