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

## Contribuindo

Quer adicionar um algoritmo? O sistema usa YAML para definir conteúdo:

```
src/content/algorithms/{slug}/
├── algorithm.yml   # Configuração, teoria, perguntas
├── code.py         # Implementação Python
└── code.rs         # Implementação Rust
```

Rode `npm run generate` para gerar os tipos TypeScript a partir do YAML.

## Licença

MIT
