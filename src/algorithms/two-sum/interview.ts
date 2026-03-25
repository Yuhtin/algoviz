import type { InterviewData } from '@/types/interview'

export const interview: InterviewData = {
  questions: [
    {
      id: 'two-sum-q1',
      question: 'Explique como resolver o Two Sum de forma ótima e por que usar um hash map.',
      difficulty: 'easy',
      companies: ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple'],
      tip: 'Pense em como transformar uma busca linear em busca constante.',
      rubric: [
        {
          id: 'r1',
          point: 'Explica que precisamos encontrar dois números que somam ao target',
          required: true,
        },
        {
          id: 'r2',
          point: 'Usa hash map para armazenar números já vistos',
          required: true,
        },
        {
          id: 'r3',
          point: 'Calcula o complemento (target - número atual)',
          required: true,
        },
        {
          id: 'r4',
          point: 'Complexidade O(n) tempo e O(n) espaço',
          required: true,
        },
        {
          id: 'r5',
          point: 'Compara com solução de força bruta O(n²)',
          required: false,
        },
      ],
      idealAnswer: `O Two Sum pede para encontrar dois números que somam a um valor target.

A solução de força bruta usa dois loops aninhados O(n²), comparando cada par.

A solução ótima usa um hash map:
1. Para cada número, calculamos o complemento (target - número)
2. Verificamos se o complemento já está no hash map (O(1))
3. Se sim, encontramos o par e retornamos os índices
4. Se não, adicionamos o número atual ao hash map

O hash map transforma a busca interna de O(n) para O(1), resultando em O(n) total.

Complexidade: O(n) tempo (uma passagem pelo array) e O(n) espaço (hash map pode ter até n elementos).`,
    },
    {
      id: 'two-sum-q2',
      question: 'E se o array estiver ordenado? Você consegue resolver com O(1) espaço?',
      difficulty: 'medium',
      companies: ['Amazon', 'Microsoft', 'Bloomberg'],
      tip: 'Dois ponteiros podem ser úteis quando o array está ordenado.',
      followUp: 'E se precisarmos retornar todos os pares, não apenas um?',
      rubric: [
        {
          id: 'r1',
          point: 'Propõe técnica de dois ponteiros (um no início, outro no fim)',
          required: true,
        },
        {
          id: 'r2',
          point: 'Explica quando mover cada ponteiro baseado na soma',
          required: true,
        },
        {
          id: 'r3',
          point: 'Identifica complexidade O(n) tempo e O(1) espaço',
          required: true,
        },
        {
          id: 'r4',
          point: 'Menciona que array não ordenado precisaria ordenar primeiro O(n log n)',
          required: false,
        },
      ],
      idealAnswer: `Se o array está ordenado, podemos usar dois ponteiros:

1. Ponteiro esquerdo começa no início (menor elemento)
2. Ponteiro direito começa no fim (maior elemento)
3. Calculamos a soma dos dois elementos
4. Se soma == target: encontramos!
5. Se soma < target: movemos ponteiro esquerdo para direita (aumenta soma)
6. Se soma > target: movemos ponteiro direito para esquerda (diminui soma)

Complexidade: O(n) tempo e O(1) espaço!

Se o array não está ordenado, podemos ordenar primeiro em O(n log n), mas aí o hash map pode ser melhor dependendo do caso de uso.

Para retornar todos os pares, continuamos movendo ponteiros após encontrar cada par, cuidando para pular duplicatas.`,
    },
    {
      id: 'two-sum-q3',
      question: 'Como você estenderia o Two Sum para Three Sum? E para k-Sum?',
      difficulty: 'hard',
      companies: ['Google', 'Facebook', 'Uber', 'LinkedIn'],
      tip: 'Three Sum pode ser reduzido a múltiplos Two Sum.',
      followUp: 'Como evitar duplicatas no resultado?',
      rubric: [
        {
          id: 'r1',
          point: 'Three Sum: fixa um elemento e aplica Two Sum no restante',
          required: true,
        },
        {
          id: 'r2',
          point: 'Complexidade do Three Sum: O(n²)',
          required: true,
        },
        {
          id: 'r3',
          point: 'k-Sum generaliza: fixa k-2 elementos e aplica Two Sum',
          required: true,
        },
        {
          id: 'r4',
          point: 'Para evitar duplicatas: pula elementos iguais consecutivos',
          required: true,
        },
        {
          id: 'r5',
          point: 'Menciona que ordenar primeiro facilita remoção de duplicatas',
          required: false,
        },
      ],
      idealAnswer: `Three Sum (soma = 0):
1. Ordena o array O(n log n)
2. Para cada elemento A[i], aplica Two Sum no subarray A[i+1:] com target = -A[i]
3. Usa dois ponteiros para o Two Sum interno
4. Complexidade: O(n²)

Para evitar duplicatas:
- Pula elementos iguais: if i > 0 and A[i] == A[i-1]: continue
- Após encontrar um par, move ambos ponteiros e pula duplicatas

k-Sum generalizado:
- Base case: k == 2 → Two Sum com dois ponteiros
- Recursão: fixa um elemento, chama (k-1)-Sum no restante
- Complexidade: O(n^(k-1))

Exemplo para 4-Sum:
- Fixa primeiro elemento, aplica 3-Sum no restante
- 3-Sum fixa segundo elemento, aplica 2-Sum
- Total: O(n³)

A ordenação inicial é crucial para:
1. Permitir dois ponteiros no caso base
2. Facilitar skip de duplicatas
3. Permitir early termination (se mínimo > target, para)`,
    },
  ],
}
