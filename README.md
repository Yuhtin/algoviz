# AlgoViz

**Visualize. Entenda. Implemente.**

[algorithms.daviduarte.com.br](https://algorithms.daviduarte.com.br)

---

## Por que esse projeto existe?

Quando estudava para entrevistas técnicas, me frustrava ter que pular entre várias abas: uma para ver a animação do algoritmo, outra para entender a complexidade, outra para copiar o código, outra para ver que tipo de pergunta cai em entrevista.

Não encontrei nenhum lugar que juntasse tudo isso de forma clara e em português. Então construí o AlgoViz.

Cada algoritmo tem:

- **Visualização interativa** — pause, avance passo a passo, volte, mude a velocidade
- **Explicação técnica** — como funciona, análise de complexidade, comparação com alternativas
- **Código pronto** — Python e Rust com syntax highlighting
- **Perguntas de entrevista** — o que costuma cair e como responder

## Rodando localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes
npm run test
```

O servidor local roda em `http://localhost:3000`.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion (animações)
- D3.js (visualização de grafos)
- Vitest (testes)

## Algoritmos disponíveis

| Algoritmo | Categoria | Dificuldade |
|-----------|-----------|-------------|
| Bubble Sort | Ordenação | Fácil |
| Bucket Sort | Ordenação | Média |
| Two Sum | Arrays | Fácil |
| Single Cycle Check | Grafos | Média |
| Dijkstra | Grafos | Média |

## Arquitetura: YAML como fonte de verdade

Um dos problemas de projetos assim é o boilerplate. Cada algoritmo novo significa criar vários arquivos, copiar estruturas, manter tudo sincronizado. Fica tedioso rápido.

A solução foi inverter a lógica: em vez de escrever código que define conteúdo, escrevo conteúdo que gera código.

Cada algoritmo vive em uma pasta com três arquivos:

```
src/content/algorithms/dijkstra/
├── algorithm.yml   # Tudo: metadata, teoria, complexidade, perguntas de entrevista
├── code.py         # Implementação Python com marcadores
└── code.rs         # Implementação Rust com marcadores
```

O `algorithm.yml` define tudo que aparece na página: nome, descrição, dificuldade, tags, explicação passo a passo, análise Big-O, comparações com outros algoritmos, e até perguntas de entrevista com rubrica de avaliação.

Os arquivos de código usam marcadores especiais (`# #@conceito`) que conectam linhas específicas com explicações no YAML. Quando você passa o mouse em "loop principal" na explicação, o código destaca as linhas relevantes.

No build, um script lê todos os YAMLs e gera TypeScript tipado:

```bash
npm run generate
```

O resultado é que adicionar um algoritmo novo é questão de escrever três arquivos de conteúdo. Sem boilerplate, sem copiar componentes, sem manter estruturas duplicadas. O sistema cuida do resto.

## Contribuindo

Quer adicionar um algoritmo?

1. Crie a pasta em `src/content/algorithms/{slug}/`
2. Escreva o `algorithm.yml` seguindo o schema dos existentes
3. Adicione `code.py` e `code.rs` com os marcadores `#@`
4. Crie o engine e visualizer em `src/algorithms/{slug}/`
5. Rode `npm run generate` e teste

## Licença

MIT
