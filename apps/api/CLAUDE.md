# apps/api

- Hono rodando em Node (`@hono/node-server`). `criarApp(db)` é testável sem banco via `app.request()`.
- Banco opcional: sem `DATABASE_URL`, serve as tabelas embarcadas do core.
- Drizzle + Neon (driver HTTP serverless). Schema em `src/db/schema.ts`; migrations com `pnpm --filter @acerto/api db:generate` e `db:migrate`.
- `Infinity` não existe em JSON: a última faixa do IRRF vai como `null` e o app converte de volta.
- Rotas `/admin/*` exigem `Authorization: Bearer $ADMIN_TOKEN`.
- Detalhes em `.claude/skills/api-neon/SKILL.md`.
