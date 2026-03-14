// src/algorithms/bucket-sort/interview.ts
import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'bucket-sort-q1',
      question: 'Explique como o Bucket Sort funciona e quando voce o usaria.',
      difficulty: 'medium',
      companies: ['Google', 'Amazon', 'Microsoft'],
      tip: 'Pense em como dividir o problema em partes menores.',
      rubric: [
        {
          id: 'r1',
          point: 'Explica que distribui elementos em buckets baseado em seu valor',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que cada bucket e ordenado individualmente',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica a concatenacao dos buckets para formar o resultado',
          required: true,
        },
        {
          id: 'r4',
          point: 'Menciona que funciona melhor com dados uniformemente distribuidos',
          required: true,
        },
        {
          id: 'r5',
          point: 'Complexidade O(n+k) no caso medio',
          required: false,
        },
      ],
      idealAnswer: `O Bucket Sort e um algoritmo de ordenacao distributiva que funciona da seguinte forma:

1. **Criar buckets**: Divide o intervalo de valores em n buckets (geralmente o mesmo numero de elementos do array).

2. **Distribuir elementos**: Cada elemento e colocado no bucket apropriado baseado em seu valor. Para numeros entre 0 e 1, o indice do bucket e calculado como floor(valor * n).

3. **Ordenar buckets**: Cada bucket e ordenado individualmente usando outro algoritmo (geralmente Insertion Sort).

4. **Concatenar**: Os buckets sao concatenados em ordem para formar o array ordenado.

**Quando usar:**
- Dados uniformemente distribuidos em um intervalo conhecido
- Numeros de ponto flutuante entre 0 e 1
- Quando a distribuicao permite poucos elementos por bucket

**Complexidade:**
- Tempo: O(n + k) no caso medio (n elementos, k buckets)
- Espaco: O(n + k) para armazenar os buckets`,
    },
    {
      id: 'bucket-sort-q2',
      question: 'Por que o Bucket Sort pode ter O(n) no caso medio mas O(n²) no pior caso?',
      difficulty: 'medium',
      companies: ['Facebook', 'Apple'],
      tip: 'O que acontece quando todos os elementos vao para o mesmo bucket?',
      followUp: 'Como voce poderia mitigar o pior caso?',
      rubric: [
        {
          id: 'r1',
          point: 'Explica que o caso medio assume distribuicao uniforme',
          required: true,
        },
        {
          id: 'r2',
          point: 'Menciona que no pior caso todos os elementos vao para o mesmo bucket',
          required: true,
        },
        {
          id: 'r3',
          point: 'Explica que a ordenacao interna do bucket domina a complexidade',
          required: true,
        },
        {
          id: 'r4',
          point: 'Sugere formas de mitigar (mais buckets, algoritmo interno melhor)',
          required: false,
        },
      ],
      idealAnswer: `**Por que O(n) no caso medio:**
- Com distribuicao uniforme, cada bucket tem aproximadamente n/k elementos
- Ordenar cada bucket com Insertion Sort: O((n/k)²)
- Com k = n buckets, cada bucket tem ~1 elemento
- Tempo total: O(n) para distribuir + O(k) para concatenar = O(n + k) = O(n)

**Por que O(n²) no pior caso:**
- Se todos os elementos vao para o mesmo bucket (dados nao uniformes)
- Um bucket com n elementos precisa ser ordenado com Insertion Sort
- Insertion Sort no pior caso: O(n²)
- Exemplo: array [0.11, 0.12, 0.13, 0.14, 0.15] com 5 buckets - todos vao para bucket 0

**Mitigacoes:**
1. Usar mais buckets se a distribuicao for desconhecida
2. Usar algoritmo O(n log n) para ordenar buckets (como Merge Sort)
3. Analisar a distribuicao dos dados antes de escolher o algoritmo`,
    },
    {
      id: 'bucket-sort-q3',
      question: 'Compare Bucket Sort com Counting Sort e Radix Sort. Quando usar cada um?',
      difficulty: 'hard',
      companies: ['Google', 'Microsoft', 'Uber'],
      tip: 'Pense no tipo de dados que cada algoritmo manipula.',
      rubric: [
        {
          id: 'r1',
          point: 'Counting Sort: inteiros em faixa limitada',
          required: true,
        },
        {
          id: 'r2',
          point: 'Radix Sort: inteiros ou strings com digitos/caracteres fixos',
          required: true,
        },
        {
          id: 'r3',
          point: 'Bucket Sort: numeros de ponto flutuante uniformemente distribuidos',
          required: true,
        },
        {
          id: 'r4',
          point: 'Compara complexidades corretamente',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona estabilidade dos algoritmos',
          required: false,
        },
      ],
      idealAnswer: `**Comparacao:**

| Aspecto | Bucket Sort | Counting Sort | Radix Sort |
|---------|-------------|---------------|------------|
| Tipo de dados | Floats uniformes | Inteiros limitados | Inteiros/strings |
| Complexidade tempo | O(n + k) | O(n + k) | O(d * (n + k)) |
| Complexidade espaco | O(n + k) | O(k) | O(n + k) |
| Estavel | Sim* | Sim | Sim |

*Depende do algoritmo interno

**Quando usar cada um:**

**Counting Sort:**
- Inteiros em faixa conhecida e pequena (ex: idades 0-150)
- k (range) nao e muito maior que n
- Precisa de estabilidade
- Melhor quando k = O(n)

**Radix Sort:**
- Inteiros com numero fixo de digitos
- Strings de tamanho fixo
- Quando d (digitos) e pequeno e constante
- CPFs, telefones, datas

**Bucket Sort:**
- Numeros de ponto flutuante entre 0 e 1
- Dados uniformemente distribuidos
- Quando a distribuicao e conhecida
- Pode ser adaptado para ranges arbitrarios

**Escolha:**
- Inteiros 0-100: Counting Sort
- Inteiros grandes uniformes: Radix Sort
- Floats 0-1 uniformes: Bucket Sort
- Dados com distribuicao desconhecida: algoritmos de comparacao (Quick/Merge)`,
    },
  ],
}
