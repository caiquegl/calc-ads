---
name: expo-mobile
description: Convenções do app Expo (expo-router, tema, componentes, dev build, EAS, monorepo pnpm). Use ao criar/alterar telas, navegação, dependências nativas ou gerar builds.
---

# App Expo

## Rodar

```bash
pnpm install
cd apps/mobile
npx expo install --fix        # alinha versões com o SDK instalado
npx expo prebuild             # gera android/ (não versionado)
npx expo run:android          # dev build no emulador/celular via USB
pnpm dev                      # Metro (dev client)
```

Na WSL, para usar celular físico: `adb` do Windows ou `adb connect <ip>` com depuração por Wi-Fi. Para a API local, use o IP da máquina em `EXPO_PUBLIC_API_URL` (não `localhost`).

## Convenções

- Rotas em `app/` (kebab-case = URL). Código de apoio em `src/` com alias `@/`.
- Cores/espacos/tipografia só de `src/theme.ts`. Componentes base em `src/components/ui.tsx`; se repetir estilo 2 vezes, vira componente.
- Estado local com `useState`; dados globais (tabela, config) via `useApp()`.
- Instale libs com `npx expo install <lib>` (nunca `pnpm add` direto para libs nativas).
- Acessibilidade: textos ≥ 15px nos valores, alvos de toque ≥ 44px, contraste AA.

## Build e publicação

- `eas build --profile preview --platform android` → APK para testar.
- `eas build --profile production --platform android` → AAB para a Play Store.
- Versão em `app.config.ts` (`version`); `autoIncrement` cuida do versionCode.
- `eas submit` é bloqueado no settings do Claude: publicação é feita pelo dono.
