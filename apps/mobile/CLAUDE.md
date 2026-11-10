# apps/mobile

- Expo + expo-router (rotas em `app/`), código de apoio em `src/` (alias `@/`).
- **Precisa de development build** (`expo run:android` ou EAS `development`): o AdMob não funciona no Expo Go.
- Componentes visuais em `src/components/ui.tsx`; cores e tipografia só via `src/theme.ts`.
- Cada tela de calculadora: estado dos campos → valida → chama função do `@acerto/core` com `tabela` do contexto → mostra `Destaque` + `Linha`s → `aposCalculo()` do intersticial.
- Antes de mexer em anúncio, leia `.claude/skills/admob-anuncios/SKILL.md`.
- Para nova tela, siga `.claude/skills/nova-calculadora/SKILL.md`.
