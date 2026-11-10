# apps/web

- Next.js 16 (App Router), mesmas calculadoras do mobile. Rotas em `app/`, código de apoio em `src/` (alias `@/`).
- `dev` e `build` usam `--webpack`: o core importa `./x.js` apontando para `x.ts` e o Turbopack não resolve isso em pacote do workspace (`extensionAlias` no `next.config.ts`).
- Cada rota: `app/<rota>/page.tsx` (server, exporta `metadata` via `metadataCalculadora`) → componente client em `src/calculadoras/`.
- Tela de calculadora: estado dos campos → valida → função do `@acerto/core` com `tabela` do contexto → `<Resultado de={r}>` com `Destaque` + `Linha`s → `<AdResultado />` por último, dentro do resultado.
- Lista de calculadoras (home, sitemap, SEO) em `src/lib/calculadoras.ts`. Cores só via variáveis CSS em `app/globals.css` (espelham `apps/mobile/src/theme.ts`).
- Tabela/config: `NEXT_PUBLIC_API_URL` (API no Render) → cache em `localStorage` → tabela embarcada. Sem a variável, o build de produção não chama API nenhuma.
- Anúncios = Google AdSense (`src/ads/`). Antes de mexer, leia a seção "Web" de `.claude/skills/admob-anuncios/SKILL.md`.
- Variáveis em `.env.example`. `NEXT_PUBLIC_*` entram no build: mudou, rebuild.
