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

**Track It** is a full-stack personal finance application built with Next.js 16 and powered by Google Gemini AI. It helps users track income and expenses, scan receipts with AI, and forecast cash flow — all in a beautiful, responsive interface with dark/light themes.

### Features

| Feature                          | Description                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Transaction Management**       | Create, edit, delete, and filter transactions with advanced search and **Quick Date Filters** (Current Month, 3/6 Months, Year)                               |
| **Advanced Analytics (Tabs)**    | New 3-tab dashboard: **Summary** (AI Insights & Budget Progress), **Monthly Analysis** (Categorized charts), and **Comparison** (Month-over-month growth)     |
| **Smart Recurring Transactions** | When marking a transaction as "Fixed", the system automatically generates instances for future months in MongoDB, allowing independent editing for each month |
| **AI Financial Insights**        | Automated analysis of spending patterns, anomaly detection, and personalized tips powered by Gemini                                                           |
| **Receipt Scanner**              | Take a photo of a receipt and let AI extract items, amounts, categories, and currency automatically                                                           |
| **Financial Charts**             | Modernized data viz with horizontal bar charts for better readability and grouped bars for monthly comparison                                                 |
| **Multi-Currency & Language**    | Support for BRL, USD, EUR, PYG and more — with i18n for English, Portuguese, and Spanish                                                                      |
| **Dark / Light Theme**           | Modern, clean UI with theme persistence and mobile-first responsive design                                                                                    |

---

## 🇧🇷 Português

### Visão Geral

**Track It** é uma aplicação completa de finanças pessoais construída com Next.js 16 e integrada com Google Gemini AI. Ela ajuda os usuários a acompanhar receitas e despesas, escanear comprovantes com IA e prever fluxo de caixa — tudo em uma interface moderna, responsiva e com suporte multi-idioma.

### Funcionalidades

| Funcionalidade                    | Descrição                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gestão de Transações**          | Criar, editar, excluir e filtrar transações com busca avançada e **Filtros Rápidos de Data** (Mês Atual, 3/6 Meses, Ano)                                        |
| **Analytics Avançado (Abas)**     | Nova dashboard organizada em 3 abas: **Resumo** (Insights IA e Progresso), **Análise Mensal** (Gráficos por categoria) e **Comparação** (Crescimento mês a mês) |
| **Transações Fixas Inteligentes** | Ao marcar como "Fixa", o sistema gera automaticamente as transações para os meses futuros no MongoDB, permitindo edição independente de valores em cada mês     |
| **Insights Financeiros com IA**   | Análise automática de padrões de gastos, detecção de anomalias e dicas personalizadas via Gemini                                                                |
| **Scanner de Comprovantes**       | Tire uma foto do comprovante e deixe a IA extrair itens, valores e categorias automaticamente                                                                   |
| **Gráficos Financeiros**          | Visualização moderna com gráficos de barras horizontais para melhor leitura e barras agrupadas para comparação mensal                                           |
| **Multi-Moeda e Idioma**          | Suporte para BRL, USD, EUR, PYG e mais — com i18n para Português, Inglês e Espanhol                                                                             |
| **Tema Escuro / Claro**           | Interface limpa com persistência de tema e design focado em dispositivos móveis                                                                                 |

### Arquitetura & Tech Stack

_(Mantendo a estrutura técnica original, mas validando o uso de MongoDB 8 e Next.js 16)_

| Camada             | Tecnologia                         |
| ------------------ | ---------------------------------- |
| **Framework**      | Next.js 16 (App Router, Turbopack) |
| **Banco de Dados** | MongoDB 8 + Mongoose 8             |
| **IA**             | Google Gemini 2.5 Flash            |
| **Gráficos**       | Chart.js + react-chartjs-2         |

---

<div align="center">

**Made with <span style="color: #ef4444;">&hearts;</span> and a lot of ☕**

[Back to top](#-track-it)

</div>
