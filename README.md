# Acerto — Calculadora Trabalhista CLT

Monorepo do app **Acerto** (Web Prumo): calculadoras de rescisão, salário líquido, férias, 13º, hora extra e FGTS, com tabelas de 2026 e monetização via AdMob.

```
apps/mobile     Expo + expo-router + AdMob
apps/api        Hono + Drizzle + Neon (opcional)
packages/core   Motor de cálculo CLT (TypeScript puro, testado)
.claude/        Harness do Claude Code: skills e agentes do projeto
```

## Começando (WSL / Linux)

```bash
corepack enable            # habilita o pnpm
pnpm install
pnpm --filter @acerto/core test      # 21 testes do motor de cálculo
pnpm dev:api                          # http://localhost:8787/health

cd apps/mobile
npx expo install --fix     # alinha versões ao SDK do Expo
npx expo run:android       # dev build (AdMob não roda no Expo Go)
```

Banco Neon é opcional: veja `.claude/skills/api-neon/SKILL.md`.

## Antes de publicar

- [ ] IDs reais do AdMob como EAS secrets e `app-ads.txt` no site
- [ ] Fluxo de consentimento (UMP) no `app/_layout.tsx`
- [ ] Política de privacidade publicada
- [ ] Revisões: agentes `revisor-clt` e `revisor-anuncios`
- [ ] Pendências de cálculo listadas em `.claude/skills/clt-calculos/SKILL.md`

> Simulação informativa. Não substitui o cálculo oficial do empregador nem orientação jurídica.
