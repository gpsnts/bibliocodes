# Bibliocodes

Gerador online de códigos de notação de autor **Cutter-Sanborn** e **PHA**. Uma ferramenta para bibliotecários e catalogadores que processa dados totalmente no navegador, sem necessidade de servidor ou cadastro.

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
![Node](https://img.shields.io/badge/node-20%2B-brightgreen)
![React](https://img.shields.io/badge/react-19-61dafb)

## ✨ Funcionalidades

- 🔍 **Gerador em tempo real** — Digite um sobrenome e obtenha o código instantaneamente
- 📊 **Tabela Cutter-Sanborn** — Consulte mais de 2.000 entradas alfabéticas
- 🇧🇷 **Tabela PHA** — Adaptação brasileira otimizada para nomes em português
- ⚡ **Sem servidor** — Tudo roda no navegador, dados em JSON
- 🎨 **Interface moderna** — Design limpo com Tailwind CSS e componentes Radix UI
- 📱 **Responsivo** — Funciona em desktop, tablet e mobile
- 🚀 **Rápido** — Busca por intervalo otimizada em memória

## 🎯 Como Funciona

O algoritmo segue 4 passos:

1. **Normalização** — Processa acentos, capitalização e partículas do sobrenome
2. **Análise** — Extrai o prefixo alfabético da palavra para busca
3. **Consulta** — Busca por intervalo na tabela carregada em memória
4. **Resultado** — Monta o código final (letra + número + complemento)

### Exemplo

```
Entrada: Silva, João

Cutter-Sanborn: S585
PHA: Si
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/bibliocodes.git
cd bibliocodes

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Abre `http://localhost:5173` no navegador.

### Build para Produção

```bash
# Compilar para produção
npm run build

# Visualizar build localmente
npm run preview
```

A pasta `dist/` estará pronta para deploy.

---

## 📦 Stack Tecnológico

### Frontend
- **React 19** — Framework UI
- **TanStack Router** — Roteamento de página única (SPA)
- **TanStack Query** — Gerenciamento de estado assíncrono
- **Tailwind CSS** — Estilização utilitária
- **Radix UI** — Componentes acessíveis (accordion, dialog, etc.)
- **TypeScript** — Type safety

### Build & Dev
- **Vite** — Build tool moderno e rápido
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
│   ├── routes/              # Páginas (TanStack Router)
│   │   ├── __root.tsx       # Layout raiz
│   │   ├── index.tsx        # Home
│   │   ├── gerar.tsx        # Gerador
│   │   ├── cutter.tsx       # Tabela Cutter-Sanborn
│   │   └── pha.tsx          # Tabela PHA
│   ├── components/          # Componentes React
│   │   ├── SiteHeader.tsx   # Cabeçalho
│   │   ├── TableViewer.tsx  # Visualizador de tabelas
│   │   └── ui/              # Componentes Radix UI
│   ├── lib/
│   │   ├── cutter-search.ts # Lógica de busca Cutter
│   │   ├── utils.ts         # Utilitários
│   │   └── config.server.ts # Configurações
│   ├── hooks/               # Custom React hooks
│   ├── router.tsx           # Configuração do router
│   ├── main.tsx             # Entry point
│   └── styles.css           # Estilos globais
├── public/
│   └── data/
│       ├── cutter.json      # Dados Cutter-Sanborn
│       └── pha.json         # Dados PHA
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
├── package.json
└── README.md
```

---

## 🔧 Disponíveis Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor dev em `http://localhost:5173` |
| `npm run build` | Compila para produção em `dist/` |
| `npm run preview` | Visualiza build em `http://localhost:4173/bibliocodes/` |
| `npm run lint` | Executa ESLint |
| `npm run format` | Formata código com Prettier |

---

## 📤 Deploy

### GitHub Pages (Recomendado)

O projeto está configurado para deploy automático via GitHub Actions.

#### 1. Pré-requisitos
- Repositório no GitHub
- Branch `main` como padrão

#### 2. Ativar GitHub Pages

1. Vá para **Settings → Pages**
2. Em "Build and deployment", selecione **"GitHub Actions"**

#### 3. Deploy automático

```bash
git add .
git commit -m "Deploy para GitHub Pages"
git push origin main
```

O workflow `.github/workflows/deploy.yml` roda automaticamente:
- ✅ Instala dependências
- ✅ Faz build
- ✅ Publica em `https://seu-usuario.github.io/bibliocodes/`

#### 4. Verificar publicação

Após alguns minutos, seu site estará disponível em:
```
https://seu-usuario.github.io/bibliocodes/
```

---

## 🧪 Testando Localmente

### Teste 1: Desenvolvimento
```bash
npm run dev
# Acessa http://localhost:5173
```

### Teste 2: Build de Produção
```bash
npm run build
npm run preview
# Acessa http://localhost:4173/bibliocodes
```

Certifique-se que:
- ✅ Links funcionam com `/bibliocodes/` no início
- ✅ Dados JSON carregam corretamente
- ✅ Tabelas são pesquisáveis
- ✅ Gerador funciona em tempo real

---

## 🎨 Customização

### Alterar o nome do repositório
Se seu repositório não é chamado `bibliocodes`, atualize `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === "production"
  ? "/seu-repo-name/"
  : "/"
```

### Adicionar novas rotas
Crie arquivos em `src/routes/`:

```typescript
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => <div>Sobre</div>,
});
```

### Estilizar componentes
Use as classes Tailwind CSS e os componentes Radix UI em `src/components/ui/`.

---

## 🐛 Troubleshooting

### Build falha com erro de tipo TypeScript
```bash
npm run build -- --force
```

### Tabelas não carregam
- Verifique se `public/data/cutter.json` e `public/data/pha.json` existem
- Verifique o path em `lib/config.server.ts`

### 404 em desenvolvimento
```bash
# Errado: http://localhost:5173/bibliocodes/
# Correto: http://localhost:5173/
```

---

## 📚 Referências

- **Cutter-Sanborn Three-Figure Table** — Sistema padrão internacional de notação de autor
- **PHA** — Adaptação brasileira para catalogação em português

---

## 📄 Licença

MIT License — Veja [LICENSE](LICENSE) para detalhes.

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

Encontrou um problema? Abra uma [issue](https://github.com/seu-usuario/bibliocodes/issues) no GitHub.

---

**Feito com ❤️ para bibliotecários e catalogadores.**
