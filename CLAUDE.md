# Acerto — Calculadora Trabalhista CLT

App Android/iOS gratuito, monetizado com AdMob, que simula rescisão, salário líquido, férias, 13º, hora extra e FGTS pelas regras brasileiras vigentes. Empresa: Web Prumo.

## Estrutura

```
packages/core   Motor de cálculo CLT. TypeScript puro, sem dependências. Fonte da verdade.
apps/mobile     Expo (expo-router) + react-native-google-mobile-ads. Calcula offline usando o core.
apps/web        Next.js 16 + Google AdSense. Mesmas calculadoras do mobile, no navegador, usando o core.
apps/api        Hono + Drizzle + Neon Postgres (deploy no Render). Serve tabelas fiscais versionadas e config remota.
.claude/        Skills e agentes deste projeto.
```

## Comandos

- `pnpm install` — instala tudo (node-linker hoisted, ver .npmrc)
- `pnpm check` — typecheck + testes de todos os pacotes. **Rode antes de dizer que terminou.**
- `pnpm --filter @acerto/core test` — testes do motor de cálculo (node:test via tsx)
- `pnpm dev:api` — API em http://localhost:8787 (funciona sem banco)
- `pnpm dev:mobile` — Metro para o dev client (AdMob não roda no Expo Go)
- `pnpm dev:web` / `pnpm build:web` — site Next.js em http://localhost:3000 (anúncio só de teste em dev)
- Neon: `neon env pull` grava `DATABASE_URL` (pooled, app) e `DATABASE_URL_UNPOOLED` (migrations) no `.env.local` da raiz, que a API lê
- `pnpm arte` — regenera ícone, splash e imagens da loja

## Regras do projeto

1. **Todo cálculo trabalhista mora em `packages/core`.** O app e a API só chamam funções do core. Nunca duplicar fórmula em tela.
2. **Mudou regra ou tabela → teste junto.** Cada valor de tabela precisa de fonte em `fontes` e de caso de teste. Use a skill `clt-calculos` e peça revisão ao agente `revisor-clt`.
3. **O app nunca depende da API para calcular.** API fora do ar = usa cache ou tabela embarcada.
4. **Anúncios seguem a skill `admob-anuncios`.** IDs de teste em dev, intersticial só depois do resultado e com limite de frequência, nada de anúncio colado em botão.
5. **Arte é própria.** Nada de imagens, ícones ou fontes de terceiros sem licença livre. Ver skill `arte-marca`.
6. **Texto em português do Brasil**, tom direto e simples. Valores sempre com `brl()`; datas DD/MM/AAAA na UI e YYYY-MM-DD no core.
7. **Sempre mostrar o aviso** de que é simulação informativa.

## Git

- Commits em português, no imperativo, curtos (`adiciona cálculo de aviso proporcional`).
- **Commits e merge requests não podem ter assinatura do Claude**: nada de `Co-Authored-By: Claude`, `Generated with Claude Code` ou similares.

## Skills disponíveis (.claude/skills)

| Skill | Quando usar |
|---|---|
| `clt-calculos` | Criar/alterar qualquer regra de cálculo trabalhista |
| `tabelas-anuais` | Virada de ano: novo salário mínimo, INSS, IRRF |
| `nova-calculadora` | Adicionar uma calculadora nova de ponta a ponta |
| `expo-mobile` | Telas, navegação, build, EAS |
| `admob-anuncios` | Qualquer coisa ligada a anúncios e consentimento (app: AdMob; site: AdSense) |
| `api-neon` | Endpoints, schema, migrations, Neon |
| `arte-marca` | Ícone, splash, cores, imagens da loja |
| `aso-play-store` | Ficha da Play Store, palavras-chave, screenshots |

Agentes: `revisor-clt` (confere cálculos contra a lei) e `revisor-anuncios` (confere conformidade AdMob/Play).
