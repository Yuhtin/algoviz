import type { CodeAnnotation, CodeFile } from '@/types/code'

export const pythonAnnotations: CodeAnnotation[] = [
  {
    lineStart: 1,
    lineEnd: 1,
    conceptId: 'function-def',
    conceptLabel: 'Definicao',
    explanation: 'Recebe um array de inteiros e retorna True se forma um ciclo unico.',
  },
  {
    lineStart: 2,
    lineEnd: 3,
    conceptId: 'init',
    conceptLabel: 'Inicializacao',
    explanation: 'Comeca no indice 0 e conta elementos visitados.',
  },
  {
    lineStart: 5,
    lineEnd: 5,
    conceptId: 'main-loop',
    conceptLabel: 'Loop Principal',
    explanation: 'Executa exatamente n vezes para visitar todos os elementos.',
  },
  {
    lineStart: 6,
    lineEnd: 8,
    conceptId: 'direction-check',
    conceptLabel: 'Verificacao de Direcao',
    explanation: 'Garante que todos os saltos sao na mesma direcao (todos positivos ou todos negativos).',
  },
  {
    lineStart: 10,
    lineEnd: 10,
    conceptId: 'next-index',
    conceptLabel: 'Proximo Indice',
    explanation: 'Calcula o proximo indice usando modulo para tratar o array como circular.',
  },
  {
    lineStart: 11,
    lineEnd: 11,
    conceptId: 'increment',
    conceptLabel: 'Incremento',
    explanation: 'Conta mais um elemento visitado.',
  },
  {
    lineStart: 13,
    lineEnd: 13,
    conceptId: 'return',
    conceptLabel: 'Retorno',
    explanation: 'Retorna True se visitou todos os elementos e voltou ao indice 0.',
  },
]

export const pythonCode: CodeFile = {
  language: 'python',
  code: `def has_single_cycle(array):
    current_idx = 0
    num_visited = 0

    while num_visited < len(array):
        if num_visited > 0 and current_idx == 0:
            return False  # Voltou ao inicio antes de visitar todos

        num_visited += 1
        current_idx = (current_idx + array[current_idx]) % len(array)

    return current_idx == 0`,
  annotations: pythonAnnotations,
}

export const rustCode: CodeFile = {
  language: 'rust',
  code: `pub fn has_single_cycle(array: &[i32]) -> bool {
    let n = array.len() as i32;
    let mut current_idx: i32 = 0;
    let mut num_visited = 0;

    while num_visited < array.len() {
        if num_visited > 0 && current_idx == 0 {
            return false; // Voltou ao inicio antes de visitar todos
        }

        num_visited += 1;
        current_idx = ((current_idx + array[current_idx as usize]) % n + n) % n;
    }

    current_idx == 0
}`,
  annotations: [
    {
      lineStart: 1,
      lineEnd: 1,
      conceptId: 'function-def',
      conceptLabel: 'Definicao',
      explanation: 'Funcao que recebe slice de i32 e retorna bool.',
    },
    {
      lineStart: 2,
      lineEnd: 4,
      conceptId: 'init',
      conceptLabel: 'Inicializacao',
      explanation: 'Variaveis mutaveis para indice atual e contagem de visitados.',
    },
    {
      lineStart: 11,
      lineEnd: 11,
      conceptId: 'modulo-rust',
      conceptLabel: 'Modulo em Rust',
      explanation: 'Rust usa resto com sinal, entao precisamos de ((x % n) + n) % n para garantir positivo.',
    },
  ],
}
