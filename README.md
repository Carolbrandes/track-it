<div align="center">

# 🐷 Track It

**Your intelligent personal finance tracker powered by AI**

[English](#-english) · [Português](#-português)

---

<img src="./public/piggy-bank.png" alt="Track It Logo" width="80" />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47a248?logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4?logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)

</div>

---

## 🇺🇸 English

### Overview

**Track It** is a full-stack personal finance application built with Next.js 16 and powered by Google Gemini AI. It helps users track income and expenses, scan receipts with AI, detect ghost expenses (forgotten subscriptions), and forecast cash flow — all in a beautiful, responsive interface with dark/light themes and multi-language support.

### Features

| Feature | Description |
|---|---|
| **Transaction Management** | Create, edit, delete, and filter transactions with advanced search, sorting, and pagination |
| **AI Financial Insights** | Automated analysis of spending patterns, anomaly detection, and personalized tips powered by Gemini |
| **Ghost Expense Detection** | AI identifies forgotten subscriptions and recurring charges you might not be using anymore |
| **Cash Flow Forecasting** | Projected balance for end of month and next 90 days, with installment capacity analysis |
| **Receipt Scanner** | Take a photo of a receipt and let AI extract items, amounts, categories, and currency automatically |
| **Financial Charts** | Interactive pie charts (by category) and bar charts for expense ranking |
| **Category Management** | Create, edit, and organize spending categories with inline autocomplete |
| **Multi-Currency** | Support for BRL, USD, EUR, and more — with locale-aware formatting |
| **Multi-Language** | Full i18n support for English, Portuguese, and Spanish |
| **Dark / Light Theme** | Modern, clean UI with theme persistence |
| **Responsive Design** | Mobile-first design with adaptive navigation bar |
| **Fixed Transactions** | Track recurring/fixed expenses and income separately |

### Architecture

```
track-it/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions (AI insights, receipt parsing)
│   │   ├── api/              # REST API routes (Next.js Route Handlers)
│   │   │   ├── auth/         # Authentication (send-code, verify-code, me)
│   │   │   ├── transactions/ # CRUD + filtering + pagination
│   │   │   ├── categories/   # CRUD for categories
│   │   │   ├── currencies/   # Currency listing + seed
│   │   │   └── user/         # User profile + preferences
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Sidebar/      # Top navigation bar + settings
│   │   │   ├── Filter/       # Advanced transaction filters
│   │   │   ├── TransactionList/   # Sortable transaction table
│   │   │   ├── ReceiptScannerModal/  # AI receipt scanner
│   │   │   ├── AddTransactionModal/  # Transaction creation modal
│   │   │   └── ...
│   │   ├── financial-analytics/  # Charts + AI insights page
│   │   ├── hooks/            # Custom React hooks (React Query)
│   │   ├── i18n/             # Internationalization (en, pt, es)
│   │   ├── lib/              # Database connection, utils, validations
│   │   ├── styles/           # Theme, global styles, shared components
│   │   └── utils/            # Currency formatting, date helpers
│   └── models/               # Mongoose schemas (User, Transaction, Category, Currency)
├── public/                   # Static assets (piggy-bank icon)
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # Full stack (App + MongoDB + Nginx + Certbot)
└── nginx/                    # Reverse proxy configuration
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Styled Components 6 |
| **State Management** | TanStack React Query 5 |
| **Database** | MongoDB 8 + Mongoose 8 |
| **Authentication** | Passwordless (email verification code) via JWT (jose) |
| **AI** | Google Gemini 2.5 Flash (insights + vision/OCR) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Email** | Resend API |
| **Validation** | Zod 4 |
| **Testing** | Vitest + React Testing Library |
| **Deployment** | Docker (multi-stage) + Nginx + Let's Encrypt |

### Security

- **Passwordless Authentication** — No passwords stored; users authenticate via email verification codes
- **JWT with HTTP-Only Cookies** — Tokens are signed with `jose` and stored in secure, HTTP-only cookies (7-day expiry)
- **Server-Side Validation** — All API inputs validated with Zod schemas
- **Non-Root Docker User** — Production container runs as unprivileged `nextjs` user
- **HTTPS / SSL** — Nginx reverse proxy with Let's Encrypt (Certbot) for TLS termination
- **Environment Isolation** — Secrets managed via `.env` files, never committed to source
- **AI Guardrails** — Strict prompting to prevent hallucination; AI responses based exclusively on user data

### Getting Started

#### Prerequisites

- Node.js 22+
- MongoDB 8+ (or Docker)
- Google Gemini API Key ([get one here](https://ai.google.dev/))
- Resend API Key ([get one here](https://resend.com/))

#### Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/trackit
RESEND_API_KEY=re_your_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Local Development

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Docker Deployment

```bash
# Build and start all services
docker compose up -d --build

# Services:
#   - App:     http://localhost:3000
#   - MongoDB: localhost:27017
#   - Nginx:   http://localhost (ports 80/443)
```

### API Reference

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/send-code` | Send verification code to email |
| `POST` | `/api/auth/verify-code` | Verify code and receive JWT |
| `GET` | `/api/auth/me` | Get authenticated user |
| `POST` | `/api/logout` | Clear auth cookie |
| `GET` | `/api/transactions` | List transactions (with filters & pagination) |
| `POST` | `/api/transactions` | Create transaction |
| `PUT` | `/api/transactions/[id]` | Update transaction |
| `DELETE` | `/api/transactions/[id]` | Delete transaction |
| `GET` | `/api/categories` | List user categories |
| `POST` | `/api/categories` | Create category |
| `PUT` | `/api/categories/[id]` | Update category |
| `DELETE` | `/api/categories/[id]` | Delete category |
| `GET` | `/api/currencies` | List available currencies |
| `POST` | `/api/user/update-currency` | Update user currency preference |

---

## 🇧🇷 Português

### Visão Geral

**Track It** é uma aplicação completa de finanças pessoais construída com Next.js 16 e integrada com Google Gemini AI. Ela ajuda os usuários a acompanhar receitas e despesas, escanear comprovantes com IA, detectar gastos fantasmas (assinaturas esquecidas) e prever fluxo de caixa — tudo em uma interface bonita, responsiva, com temas claro/escuro e suporte multi-idioma.

### Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Gestão de Transações** | Criar, editar, excluir e filtrar transações com busca avançada, ordenação e paginação |
| **Insights Financeiros com IA** | Análise automática de padrões de gastos, detecção de anomalias e dicas personalizadas via Gemini |
| **Detecção de Gastos Fantasmas** | A IA identifica assinaturas esquecidas e cobranças recorrentes que você pode não estar mais usando |
| **Previsão de Saldo** | Saldo projetado para fim do mês e próximos 90 dias, com análise de capacidade de parcelamento |
| **Scanner de Comprovantes** | Tire uma foto do comprovante e deixe a IA extrair itens, valores, categorias e moeda automaticamente |
| **Gráficos Financeiros** | Gráficos de pizza interativos (por categoria) e gráficos de barras para ranking de despesas |
| **Gestão de Categorias** | Criar, editar e organizar categorias com autocomplete inline |
| **Multi-Moeda** | Suporte para BRL, USD, EUR e mais — com formatação de acordo com o locale |
| **Multi-Idioma** | Suporte completo para Português, Inglês e Espanhol |
| **Tema Escuro / Claro** | UI moderna e limpa com persistência de tema |
| **Design Responsivo** | Design mobile-first com barra de navegação adaptativa |
| **Transações Fixas** | Acompanhe despesas e receitas recorrentes/fixas separadamente |

### Arquitetura

```
track-it/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions (insights IA, parsing de comprovantes)
│   │   ├── api/              # Rotas REST (Next.js Route Handlers)
│   │   │   ├── auth/         # Autenticação (envio de código, verificação, me)
│   │   │   ├── transactions/ # CRUD + filtros + paginação
│   │   │   ├── categories/   # CRUD de categorias
│   │   │   ├── currencies/   # Listagem + seed de moedas
│   │   │   └── user/         # Perfil + preferências
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── Sidebar/      # Barra de navegação superior + configurações
│   │   │   ├── Filter/       # Filtros avançados de transações
│   │   │   ├── TransactionList/   # Tabela de transações com ordenação
│   │   │   ├── ReceiptScannerModal/  # Scanner de comprovantes com IA
│   │   │   ├── AddTransactionModal/  # Modal de criação de transação
│   │   │   └── ...
│   │   ├── financial-analytics/  # Gráficos + insights IA
│   │   ├── hooks/            # Hooks customizados (React Query)
│   │   ├── i18n/             # Internacionalização (en, pt, es)
│   │   ├── lib/              # Conexão DB, utilitários, validações
│   │   ├── styles/           # Tema, estilos globais, componentes compartilhados
│   │   └── utils/            # Formatação de moeda, helpers de data
│   └── models/               # Schemas Mongoose (User, Transaction, Category, Currency)
├── public/                   # Assets estáticos (ícone do porquinho)
├── Dockerfile                # Build multi-stage para produção
├── docker-compose.yml        # Stack completa (App + MongoDB + Nginx + Certbot)
└── nginx/                    # Configuração do proxy reverso
```

### Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Linguagem** | TypeScript 5 |
| **UI** | React 19, Styled Components 6 |
| **Gerenciamento de Estado** | TanStack React Query 5 |
| **Banco de Dados** | MongoDB 8 + Mongoose 8 |
| **Autenticação** | Passwordless (código por email) via JWT (jose) |
| **IA** | Google Gemini 2.5 Flash (insights + visão/OCR) |
| **Gráficos** | Chart.js + react-chartjs-2 |
| **Email** | Resend API |
| **Validação** | Zod 4 |
| **Testes** | Vitest + React Testing Library |
| **Deploy** | Docker (multi-stage) + Nginx + Let's Encrypt |

### Segurança

- **Autenticação sem Senha** — Nenhuma senha armazenada; autenticação via código de verificação por email
- **JWT com Cookies HTTP-Only** — Tokens assinados com `jose` e armazenados em cookies seguros e HTTP-only (expiração de 7 dias)
- **Validação Server-Side** — Todos os inputs da API são validados com schemas Zod
- **Usuário Não-Root no Docker** — Container de produção roda como usuário `nextjs` sem privilégios
- **HTTPS / SSL** — Proxy reverso Nginx com Let's Encrypt (Certbot) para terminação TLS
- **Isolamento de Ambiente** — Secrets gerenciados via arquivos `.env`, nunca commitados no repositório
- **Guardrails de IA** — Prompts rigorosos para prevenir alucinação; respostas baseadas exclusivamente nos dados do usuário

### Como Executar

#### Pré-requisitos

- Node.js 22+
- MongoDB 8+ (ou Docker)
- Chave API do Google Gemini ([obtenha aqui](https://ai.google.dev/))
- Chave API do Resend ([obtenha aqui](https://resend.com/))

#### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
JWT_SECRET=seu_jwt_secret_aqui
MONGODB_URI=mongodb://localhost:27017/trackit
RESEND_API_KEY=re_sua_chave_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
```

#### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (com Turbopack)
npm run dev

# Rodar testes
npm test

# Lint
npm run lint
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

#### Deploy com Docker

```bash
# Construir e iniciar todos os serviços
docker compose up -d --build

# Serviços:
#   - App:     http://localhost:3000
#   - MongoDB: localhost:27017
#   - Nginx:   http://localhost (portas 80/443)
```

### Referência da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/send-code` | Enviar código de verificação por email |
| `POST` | `/api/auth/verify-code` | Verificar código e receber JWT |
| `GET` | `/api/auth/me` | Obter usuário autenticado |
| `POST` | `/api/logout` | Limpar cookie de autenticação |
| `GET` | `/api/transactions` | Listar transações (com filtros e paginação) |
| `POST` | `/api/transactions` | Criar transação |
| `PUT` | `/api/transactions/[id]` | Atualizar transação |
| `DELETE` | `/api/transactions/[id]` | Excluir transação |
| `GET` | `/api/categories` | Listar categorias do usuário |
| `POST` | `/api/categories` | Criar categoria |
| `PUT` | `/api/categories/[id]` | Atualizar categoria |
| `DELETE` | `/api/categories/[id]` | Excluir categoria |
| `GET` | `/api/currencies` | Listar moedas disponíveis |
| `POST` | `/api/user/update-currency` | Atualizar preferência de moeda |

---

<div align="center">

**Made with <span style="color: #ef4444;">&hearts;</span> and a lot of ☕**

[Back to top](#-track-it)

</div>
