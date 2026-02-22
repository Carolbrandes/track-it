# Estabilização do Backend (Next.js) e Conectividade Mobile

## 1. Limpeza profunda e rebuild

Se o servidor entrar em **Turbopack Panic** ou falhar ao acessar `/login`, faça uma limpeza de cache e reinstale dependências.

### No projeto **web** (backend):

```bash
cd web

# Remove cache de compilação
rm -rf .next

# Opcional: limpar node_modules e reinstalar (use se houver conflito de versões)
rm -rf node_modules
rm -f package-lock.json
npm install

# Subir sem Turbopack (padrão estável)
npm run dev
```

**Importante:** Não use `next dev --turbo` se estiver ocorrendo panic. O `next.config.ts` já está ajustado para não depender de flags experimentais instáveis.

### Se o panic persistir (Next.js 16 + React 19)

Next.js 16 ainda pode ter incompatibilidades em alguns ambientes. Para maior estabilidade, você pode fixar Next 15:

```bash
cd web
npm install next@15 --save
rm -rf .next && npm run dev
```

## 2. Configuração do App (mobile)

### BASE_URL da API

No **app** (React Native), a URL do backend é definida por:

- **Variável de ambiente:** `EXPO_PUBLIC_API_URL`
- Exemplo no `.env` do app: `EXPO_PUBLIC_API_URL=http://192.168.100.17:3000`

Confirme que:

1. O arquivo `app/.env` contém `EXPO_PUBLIC_API_URL=http://192.168.100.17:3000` (ou o IP da sua máquina).
2. O backend está rodando nesse IP e porta (ex.: `npm run dev` no `web`).
3. O celular e o computador estão na mesma rede Wi‑Fi.

### Logs de erro no App

Em desenvolvimento, o app já loga no console:

- `[API]` + método, URL, `status`, **code** (ex.: `ECONNREFUSED`), **errno**, `message` e `data`.

Use esses campos para diagnosticar falhas de conexão (ex.: `ECONNREFUSED` = backend inacessível).

## 3. APIs de IA (Scan e Insights)

- **Scan (`/api/receipt/parse`):**
  - Aceita **JSON** (base64 + mimeType) ou **FormData** (campo `image` com arquivo).
  - Limite de corpo: 10MB (multipart); JSON sujeito ao limite padrão do Node.
  - Timeout: 90s; em timeout ou falha a API responde com JSON de erro (ex.: 504, 429, 500).

- **Insights (`/api/insights`):**
  - GET com Bearer ou cookie; timeout 90s; erros retornados em JSON (ex.: 504, 500).

Ambas as rotas usam `try/catch` e retornam sempre JSON amigável, sem derrubar o processo.

## 4. Checklist rápido

- [ ] Backend: `cd web && rm -rf .next && npm run dev` (sem `--turbo`).
- [ ] App: `.env` com `EXPO_PUBLIC_API_URL=http://192.168.100.17:3000`.
- [ ] Mesma rede para celular e máquina que roda o backend.
- [ ] Em caso de panic contínuo: testar `next@15` no `web`.
