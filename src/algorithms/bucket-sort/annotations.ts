// src/algorithms/bucket-sort/annotations.ts
import type { CodeAnnotation, CodeFile } from '@/types/code'

export const pythonAnnotations: CodeAnnotation[] = [
  {
    lineStart: 1,
    lineEnd: 1,
    conceptId: 'function-def',
    conceptLabel: 'Definicao',
    explanation: 'Funcao que ordena um array de numeros entre 0 e 1.',
  },
  {
    lineStart: 2,
    lineEnd: 3,
    conceptId: 'empty-check',
    conceptLabel: 'Caso Base',
    explanation: 'Verifica se o array esta vazio para evitar divisao por zero.',
  },
  {
    lineStart: 5,
    lineEnd: 6,
    conceptId: 'buckets-init',
    conceptLabel: 'Inicializacao',
    explanation: 'Cria n buckets vazios, onde n e o tamanho do array.',
  },
  {
    lineStart: 8,
    lineEnd: 10,
    conceptId: 'distribution',
    conceptLabel: 'Distribuicao',
    explanation: 'Distribui cada elemento para o bucket apropriado baseado em seu valor.',
  },
  {
    lineStart: 12,
    lineEnd: 13,
    conceptId: 'bucket-sort',
    conceptLabel: 'Ordenacao',
    explanation: 'Ordena cada bucket individualmente usando o sort nativo.',
  },
  {
    lineStart: 15,
    lineEnd: 18,
    conceptId: 'concatenation',
    conceptLabel: 'Concatenacao',
    explanation: 'Concatena todos os buckets para formar o resultado final.',
  },
]

export const pythonCode: CodeFile = {
  language: 'python',
  code: `def bucket_sort(arr):
    if len(arr) == 0:
        return arr

    n = len(arr)
    buckets = [[] for _ in range(n)]

    # Distribuir elementos nos buckets
    for num in arr:
        index = min(int(num * n), n - 1)
        buckets[index].append(num)

    # Ordenar cada bucket
    for bucket in buckets:
        bucket.sort()

    # Concatenar buckets
    result = []
    for bucket in buckets:
        result.extend(bucket)

    return result`,
  annotations: pythonAnnotations,
}

export const rustCode: CodeFile = {
  language: 'rust',
  code: `fn bucket_sort(arr: &mut [f64]) {
    if arr.is_empty() {
        return;
    }

    let n = arr.len();
    let mut buckets: Vec<Vec<f64>> = vec![vec![]; n];

    // Distribuir elementos nos buckets
    for &num in arr.iter() {
        let index = ((num * n as f64) as usize).min(n - 1);
        buckets[index].push(num);
    }

    // Ordenar cada bucket
    for bucket in &mut buckets {
        bucket.sort_by(|a, b| a.partial_cmp(b).unwrap());
    }

    // Concatenar buckets
    let mut idx = 0;
    for bucket in buckets {
        for num in bucket {
            arr[idx] = num;
            idx += 1;
        }
    }
}`,
  annotations: [
    {
      lineStart: 1,
      lineEnd: 1,
      conceptId: 'function-def',
      conceptLabel: 'Definicao',
      explanation: 'Funcao que recebe um slice mutavel de f64.',
    },
    {
      lineStart: 2,
      lineEnd: 4,
      conceptId: 'empty-check',
      conceptLabel: 'Caso Base',
      explanation: 'Verifica se o array esta vazio usando is_empty().',
    },
    {
      lineStart: 6,
      lineEnd: 7,
      conceptId: 'buckets-init',
      conceptLabel: 'Inicializacao',
      explanation: 'Cria um vetor de vetores vazios usando vec! macro.',
    },
    {
      lineStart: 9,
      lineEnd: 13,
      conceptId: 'distribution',
      conceptLabel: 'Distribuicao',
      explanation: 'Distribui elementos usando indice calculado com conversao de tipos.',
    },
    {
      lineStart: 15,
      lineEnd: 18,
      conceptId: 'bucket-sort',
      conceptLabel: 'Ordenacao',
      explanation: 'Ordena cada bucket usando sort_by com partial_cmp para f64.',
    },
    {
      lineStart: 20,
      lineEnd: 26,
      conceptId: 'concatenation',
      conceptLabel: 'Concatenacao',
      explanation: 'Copia elementos de volta para o array original, modificando in-place.',
    },
  ],
}
