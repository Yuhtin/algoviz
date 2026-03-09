import type { CodeAnnotation, CodeFile } from '@/types/code'

export const pythonAnnotations: CodeAnnotation[] = [
  {
    lineStart: 1,
    lineEnd: 1,
    conceptId: 'function-def',
    conceptLabel: 'Definição',
    explanation: 'Recebe um array e o ordena in-place, retornando o mesmo array.',
  },
  {
    lineStart: 4,
    lineEnd: 4,
    conceptId: 'outer-loop',
    conceptLabel: 'Loop Externo',
    explanation: 'Executa n-1 vezes. A cada iteração, o maior elemento "flutua" para o final.',
  },
  {
    lineStart: 5,
    lineEnd: 5,
    conceptId: 'optimization-flag',
    conceptLabel: 'Otimização',
    explanation: 'Flag para early exit. Se nenhuma troca ocorrer, o array já está ordenado.',
  },
  {
    lineStart: 7,
    lineEnd: 7,
    conceptId: 'inner-loop',
    conceptLabel: 'Loop Interno',
    explanation: 'Compara pares adjacentes. O range diminui pois os últimos elementos já estão ordenados.',
  },
  {
    lineStart: 9,
    lineEnd: 11,
    conceptId: 'comparison-swap',
    conceptLabel: 'Comparação e Troca',
    explanation: 'Se o elemento atual for maior que o próximo, troca. Isso "empurra" elementos maiores para o final.',
  },
  {
    lineStart: 14,
    lineEnd: 15,
    conceptId: 'early-exit',
    conceptLabel: 'Early Exit',
    explanation: 'Se nenhuma troca ocorreu, o array está ordenado. Otimiza best case para O(n).',
  },
]

export const pythonCode: CodeFile = {
  language: 'python',
  code: `def bubble_sort(array):
    n = len(array)

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            # Compara elementos adjacentes
            if array[j] > array[j + 1]:
                # Troca se fora de ordem
                array[j], array[j + 1] = array[j + 1], array[j]
                swapped = True

        # Otimização: para se nenhuma troca
        if not swapped:
            break

    return array`,
  annotations: pythonAnnotations,
}

export const rustCode: CodeFile = {
  language: 'rust',
  code: `pub fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let n = arr.len();

    for i in 0..n - 1 {
        let mut swapped = false;

        for j in 0..n - i - 1 {
            // Compara elementos adjacentes
            if arr[j] > arr[j + 1] {
                // Troca se fora de ordem
                arr.swap(j, j + 1);
                swapped = true;
            }
        }

        // Otimização: para se nenhuma troca
        if !swapped {
            break;
        }
    }
}`,
  annotations: [
    {
      lineStart: 1,
      lineEnd: 1,
      conceptId: 'generic-function',
      conceptLabel: 'Generics',
      explanation: 'Função genérica que funciona com qualquer tipo que implemente Ord (comparável).',
    },
    {
      lineStart: 4,
      lineEnd: 4,
      conceptId: 'outer-loop',
      conceptLabel: 'Loop Externo',
      explanation: 'Range exclusivo 0..n-1. Executa n-1 vezes.',
    },
    {
      lineStart: 10,
      lineEnd: 11,
      conceptId: 'swap-method',
      conceptLabel: 'Método swap',
      explanation: 'Rust tem swap built-in em slices. Mais seguro que manipular índices manualmente.',
    },
  ],
}
