# Bibliocodes

Gerador online de códigos de notação de autor **Cutter-Sanborn** e **PHA**. Uma ferramenta para bibliotecários e catalogadores que processa dados totalmente no navegador, sem necessidade de servidor ou cadastro.

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
![Node](https://img.shields.io/badge/node-20%2B-brightgreen)
![React](https://img.shields.io/badge/react-19-61dafb)

---

## ✨ Funcionalidades

- 🔍 **Gerador em tempo real** — Digite um sobrenome e obtenha o código instantaneamente
- 📊 **Tabela Cutter-Sanborn** — Consulte mais de 2.000 entradas alfabéticas
- 🇧🇷 **Tabela PHA** — Adaptação brasileira otimizada para nomes em português
- ⚡ **Sem servidor** — Tudo roda no navegador, dados em JSON
- 🎨 **Interface moderna** — Design limpo com Tailwind CSS e componentes Radix UI
- 📱 **Responsivo** — Funciona em desktop, tablet e mobile
- 🚀 **Rápido** — Busca por intervalo otimizada em memória

---

## 🎯 Como Funciona

O algoritmo segue 4 passos:

1. **Normalização** — Processa acentos, capitalização e partículas do sobrenome
2. **Análise** — Extrai o prefixo alfabético da palavra para busca
3. **Consulta** — Busca por intervalo na tabela carregada em memória
4. **Resultado** — Monta o código final (letra + número + complemento)

### Exemplo

```
Entrada: Silva, João

Cutter-Sanborn: S586
PHA: S578
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- Bun (recomendado) ou npm

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/bibliocodes.git
cd bibliocodes

# Instalar dependências
bun install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
bun run dev
```

Abre `http://localhost:3000` no navegador.

### Build para Produção

```bash
# Compilar para produção
bun run build

# Visualizar build localmente
bun run preview
```

---

## 📦 Stack Tecnológico

### Framework & Frontend
- **TanStack Start** — Full-stack React framework com SSR/SSG
- **React 19** — Framework UI
- **TanStack Router** — Roteamento file-based com type safety
- **TanStack Query** — Gerenciamento de estado assíncrono
- **Tailwind CSS v4** — Estilização utilitária com CSS variables
- **Radix UI / shadcn** — Componentes acessíveis (accordion, dialog, etc.)
- **TypeScript** — Type safety

### Build & Dev
- **Vite 8** — Build tool moderno e rápido
- **Bun** — Runtime e gerenciador de pacotes
- **ESLint** — Linting de código
- **Prettier** — Code formatter

### Dados
- `public/data/cutter.json` — Tabela Cutter-Sanborn (2.100+ entradas)
- `public/data/pha.json` — Tabela PHA

---

## 📁 Estrutura do Projeto

```
bibliocodes/
├── src/
│   ├── routes/              # Rotas (TanStack Start file-based routing)
│   │   ├── __root.tsx       # Layout raiz (HTML shell + providers)
│   │   ├── index.tsx        # Home
│   │   ├── gerar.tsx        # Gerador
│   │   ├── cutter.tsx       # Tabela Cutter-Sanborn
│   │   └── pha.tsx          # Tabela PHA
│   ├── components/          # Componentes React
│   │   ├── SiteHeader.tsx   # Cabeçalho
│   │   ├── TableViewer.tsx  # Visualizador de tabelas
│   │   └── ui/              # Componentes shadcn/ui (Radix)
│   ├── lib/
│   │   ├── cutter-search.ts # Lógica de busca Cutter
│   │   ├── utils.ts         # Utilitários (cn, etc.)
│   │   └── ...              # Outros utilitários
│   ├── hooks/               # Custom React hooks
│   ├── router.tsx           # Configuração do TanStack Router
│   ├── server.ts            # Entry point SSR (wrapper)
│   ├── start.ts             # Configuração do TanStack Start
│   └── styles.css           # Estilos globais (Tailwind v4 + tokens)
├── public/
│   └── data/
│       ├── cutter.json      # Dados Cutter-Sanborn
│       └── pha.json         # Dados PHA
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
├── package.json
└── README.md
```

> **Nota sobre rotas:** `routeTree.gen.ts` é auto-gerado pelo plugin do TanStack Router. **Não edite manualmente.**

---

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `bun run dev` | Inicia servidor dev em `http://localhost:3000` |
| `bun run build` | Compila para produção |
| `bun run build:dev` | Compila para produção em modo development |
| `bun run preview` | Visualiza build localmente |
| `bun run lint` | Executa ESLint |
| `bun run format` | Formata código com Prettier |

---

## 🎨 Customização

### Adicionar novas rotas

Crie arquivos em `src/routes/` seguindo as convenções do TanStack Router:

```typescript
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => <div>Sobre</div>,
});
```

| Padrão de arquivo | URL | Tipo |
|---|---|---|
| `index.tsx` | `/` | Página inicial |
| `about.tsx` | `/about` | Página estática |
| `users/$id.tsx` | `/users/:id` | Segmento dinâmico |
| `posts/{-$category}.tsx` | `/posts/:category?` | Segmento opcional |
| `_layout.tsx` | — | Layout (renders via `<Outlet />`) |

> **Importante:** `src/routes/__root.tsx` é o layout raiz. Ele deve sempre renderizar `<Outlet />` para que as rotas filhas apareçam. Não crie `src/routes/_app/index.tsx` — isso conflita com `src/routes/index.tsx`.

### Estilizar componentes

Use as classes Tailwind CSS e os componentes shadcn/ui em `src/components/ui/`. As cores são definidas via CSS variables no `src/styles.css` (sistema de tokens oklch).

### Alterar metadados

Edite o `head()` nas rotas para título, description, Open Graph, etc.:

```typescript
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bibliocodes — Gerador de códigos" },
      { name: "description", content: "Gerador online de códigos Cutter-Sanborn e PHA." },
    ],
  }),
  component: Index,
});
```

---

## 🐛 Troubleshooting

### Build falha com erro de importação
Certifique-se de que todos os imports resolvem para arquivos existentes. O TanStack Start exige strict TypeScript — imports quebrados causam falha de build.

### Tabelas não carregam
- Verifique se `public/data/cutter.json` e `public/data/pha.json` existem
- Verifique o path de fetch no componente consumidor

### 404 em desenvolvimento
O TanStack Router usa file-based routing. Certifique-se de que o arquivo da rota existe em `src/routes/` com o nome correto.

---

## 📚 Referências

- **Cutter-Sanborn Three-Figure Table** — Sistema padrão internacional de notação de autor
- **PHA** — Adaptação brasileira para catalogação em português

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para mudanças, por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📞 Suporte

Encontrou um problema? Abra uma [issue](https://github.com/gpsnts/bibliocodes/issues) no GitHub.

---

**Feito com ❤️ para bibliotecários e catalogadores.**
