import type { CodeAnnotation, CodeFile } from '@/types/code'

export const pythonAnnotations: CodeAnnotation[] = [
  {
    lineStart: 1,
    lineEnd: 1,
    conceptId: 'function-def',
    conceptLabel: 'Definicao',
    explanation: 'Recebe array e target, retorna indices dos dois numeros que somam ao target.',
  },
  {
    lineStart: 2,
    lineEnd: 2,
    conceptId: 'hash-map',
    conceptLabel: 'Hash Map',
    explanation: 'Dicionario que mapeia valor -> indice para busca O(1).',
  },
  {
    lineStart: 4,
    lineEnd: 4,
    conceptId: 'enumerate',
    conceptLabel: 'Enumerate',
    explanation: 'Itera com indice e valor simultaneamente.',
  },
  {
    lineStart: 5,
    lineEnd: 5,
    conceptId: 'complement',
    conceptLabel: 'Complemento',
    explanation: 'Calcula qual numero precisamos encontrar: target - num.',
  },
  {
    lineStart: 7,
    lineEnd: 8,
    conceptId: 'lookup',
    conceptLabel: 'Busca O(1)',
    explanation: 'Verifica se o complemento ja foi visto. Hash map permite busca em O(1).',
  },
  {
    lineStart: 10,
    lineEnd: 10,
    conceptId: 'store',
    conceptLabel: 'Armazena',
    explanation: 'Adiciona o numero atual ao hash map para futuras buscas.',
  },
  {
    lineStart: 12,
    lineEnd: 12,
    conceptId: 'not-found',
    conceptLabel: 'Nao Encontrado',
    explanation: 'Retorna None se nao existe par que soma ao target.',
  },
]

export const pythonCode: CodeFile = {
  language: 'python',
  code: `def two_sum(nums, target):
    seen = {}  # valor -> indice

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return None`,
  annotations: pythonAnnotations,
}

export const rustCode: CodeFile = {
  language: 'rust',
  code: `use std::collections::HashMap;

pub fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut seen: HashMap<i32, usize> = HashMap::new();

    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;

        if let Some(&j) = seen.get(&complement) {
            return Some((j, i));
        }

        seen.insert(num, i);
    }

    None
}`,
  annotations: [
    {
      lineStart: 1,
      lineEnd: 1,
      conceptId: 'import',
      conceptLabel: 'Import',
      explanation: 'Importa HashMap da biblioteca padrao.',
    },
    {
      lineStart: 3,
      lineEnd: 3,
      conceptId: 'function-def',
      conceptLabel: 'Definicao',
      explanation: 'Retorna Option para representar caso de nao encontrar.',
    },
    {
      lineStart: 4,
      lineEnd: 4,
      conceptId: 'hash-map',
      conceptLabel: 'HashMap',
      explanation: 'Tipo explicito: chave i32, valor usize.',
    },
    {
      lineStart: 9,
      lineEnd: 11,
      conceptId: 'pattern-match',
      conceptLabel: 'Pattern Matching',
      explanation: 'if let Some extrai o valor se existir, elegante e seguro.',
    },
  ],
}
