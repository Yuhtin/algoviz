// src/algorithms/trie/config.ts
import type { PresetOption } from '@/components/controls/Presets'
import type { TrieData } from './engine'

export const config = {
  slug: 'trie',
  name: 'Trie (Prefix Tree)',
  category: 'Strings' as const,
  description: 'Arvore de prefixos para busca eficiente de strings, autocomplete e verificacao de prefixos em O(m).',
  difficulty: 'Difícil' as const,
  complexity: {
    time: 'O(m)',
    space: 'O(n * m)',
  },
  tags: ['Arvore', 'Strings', 'Prefixo', 'Autocomplete', 'Dicionario'],
  presets: [
    {
      label: 'Dicionario Simples',
      data: {
        operations: [
          ['insert', 'app'],
          ['insert', 'apple'],
          ['insert', 'apply'],
          ['insert', 'apt'],
          ['search', 'app'],
          ['search', 'application'],
          ['startsWith', 'app'],
          ['startsWith', 'apl'],
        ] as ['insert' | 'search' | 'startsWith', string][],
      },
    },
    {
      label: 'Autocomplete',
      data: {
        operations: [
          ['insert', 'car'],
          ['insert', 'card'],
          ['insert', 'care'],
          ['insert', 'careful'],
          ['insert', 'cat'],
          ['startsWith', 'car'],
          ['startsWith', 'cat'],
          ['search', 'care'],
        ] as ['insert' | 'search' | 'startsWith', string][],
      },
    },
    {
      label: 'Sistema de Busca',
      data: {
        operations: [
          ['insert', 'hello'],
          ['insert', 'help'],
          ['insert', 'heap'],
          ['insert', 'world'],
          ['insert', 'word'],
          ['search', 'help'],
          ['search', 'hell'],
          ['startsWith', 'hel'],
          ['startsWith', 'wor'],
        ] as ['insert' | 'search' | 'startsWith', string][],
      },
    },
  ] satisfies PresetOption<TrieData>[],
}
