// src/algorithms/two-sum/theory.ts
export const theory = {
  howItWorks: {
    title: 'Como Funciona',
    content: `
O Two Sum encontra dois numeros em um array que somam a um valor alvo (target).
A solucao otima usa um hash map para armazenar os numeros ja vistos e seus indices.

Para cada numero, calculamos o complemento (target - numero) e verificamos se ja vimos
esse complemento. Se sim, encontramos o par. Se nao, adicionamos o numero atual ao hash map.
    `.trim(),
    steps: [
      'Cria um hash map vazio para armazenar numeros e indices',
      'Para cada numero no array, calcula o complemento (target - numero)',
      'Verifica se o complemento existe no hash map',
      'Se existe, retorna os indices do par encontrado',
      'Se nao existe, adiciona o numero atual ao hash map',
      'Repete ate encontrar ou terminar o array',
    ],
  },

  bigO: {
    time: {
      notation: 'O(n)',
      explanation: 'Percorre o array uma vez, cada lookup no hash map e O(1).',
      proof: 'n iteracoes x O(1) por iteracao = O(n) total.',
    },
    space: {
      notation: 'O(n)',
      explanation: 'Hash map pode armazenar ate n elementos no pior caso.',
    },
    bestCase: {
      notation: 'O(1)',
      explanation: 'Se os dois primeiros elementos formam o par.',
    },
    worstCase: {
      notation: 'O(n)',
      explanation: 'Se o par esta no final ou nao existe.',
    },
  },

  comparisons: [
    {
      name: 'Two Sum (Hash Map)',
      slug: 'two-sum',
      time: 'O(n)',
      space: 'O(n)',
      bestFor: 'Array nao ordenado, busca unica',
    },
    {
      name: 'Two Sum (Dois Ponteiros)',
      slug: 'two-sum-sorted',
      time: 'O(n)',
      space: 'O(1)',
      bestFor: 'Array ja ordenado',
    },
    {
      name: 'Two Sum (Forca Bruta)',
      slug: 'two-sum-brute',
      time: 'O(n²)',
      space: 'O(1)',
      bestFor: 'Apenas para entender o problema',
    },
    {
      name: 'Three Sum',
      slug: 'three-sum',
      time: 'O(n²)',
      space: 'O(1)',
      bestFor: 'Encontrar triplas que somam zero',
    },
  ],

  keyInsight: 'O hash map transforma uma busca O(n) em O(1), reduzindo a complexidade de O(n²) para O(n).',

  commonMistakes: [
    'Usar o mesmo elemento duas vezes (verificar se os indices sao diferentes)',
    'Esquecer de adicionar o elemento ao hash map antes de verificar o proximo',
    'Retornar os valores em vez dos indices',
    'Nao considerar numeros negativos ou zeros',
  ],
}
