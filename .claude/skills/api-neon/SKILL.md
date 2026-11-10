---
name: api-neon
description: Como trabalhar na API (Hono + Drizzle) e no banco Neon Postgres: endpoints, schema, migrations, seed, branches e deploy. Use ao criar rotas, tabelas ou mexer em dados remotos.
---

# API + Neon

## Para que serve

O app calcula offline. A API existe para:
1. Publicar tabelas fiscais corrigidas/novas **sem lançar versão na loja** (`/v1/tabelas/:ano`).
2. Config remota: frequência de anúncios, aviso na home, versão mínima (`/v1/config`).

Não guarde dados pessoais dos usuários. Se um dia houver conta/login, revisar LGPD antes.

## Banco (só se precisar)

1. Crie o projeto no Neon (região São Paulo `sa-east-1`), banco `acerto`.
2. Copie a connection string **pooled** para `apps/api/.env` (`DATABASE_URL`).
3. `pnpm --filter @acerto/api db:generate` → cria migration a partir de `src/db/schema.ts`.
4. `pnpm --filter @acerto/api db:migrate` → aplica.
5. `pnpm --filter @acerto/api db:seed` → insere tabela 2026 e config padrão.

Use **branches do Neon** para testar migration (`dev` a partir de `main`), nunca altere schema direto no console.

## Convenções

- Rotas versionadas em `/v1`. Respostas JSON em português (`erro`, `ok`).
- `criarApp(db)` recebe o banco por injeção → testes com `app.request()` e `db = null`.
- Validação de entrada com `zod` + `@hono/zod-validator` em rotas novas.
- Rotas admin protegidas por `ADMIN_TOKEN`.

## Deploy (sugestões)

Hono roda em Node, Cloudflare Workers, Vercel ou Fly.io sem mudar `app.ts`; só troca `server.ts`. Para tráfego baixo, Cloudflare Workers + Neon HTTP é o mais barato.
