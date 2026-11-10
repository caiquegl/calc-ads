---
name: arte-marca
description: Identidade visual própria do app Acerto (cores, símbolo, tipografia) e como gerar ícone, ícone adaptativo, splash e imagens da Play Store a partir de SVG. Use ao criar ou alterar qualquer arte, ícone ou imagem do app.
---

# Arte e marca

Toda a arte é **desenhada em SVG no código** (`apps/mobile/scripts/gerar-arte.mjs`) e convertida para PNG com `sharp`. Nada de imagem baixada da internet, banco de imagem sem licença ou ícone de outra marca.

## Identidade

- **Símbolo**: recibo branco inclinado + moeda dourada com sinal de "=" (o "acerto de contas").
- **Cores** (espelhadas em `src/theme.ts`):
  - Verde `#1F6F5C` (primária), Verde escuro `#14493D`, Verde claro `#DCEDE7`
  - Moeda `#F2B33D` / `#C98C1C`
  - Creme `#FAF6EE` (fundo), Tinta `#1B2420` (texto), Cinza `#6B7570`
- **Tipografia**: sistema no app. Na arte da loja: título serifado (Georgia/DejaVu Serif), apoio sem serifa.
- **Tom**: confiável, simples, brasileiro. Sem cara de banco nem de governo (não usar brasão, bandeira, verde-amarelo oficial, logo do gov.br ou da CLT digital).

## Gerar

```bash
pnpm arte
```

Saídas:
- `apps/mobile/assets/icon.png` (1024), `adaptive-icon.png` (símbolo na zona segura de 66%), `splash-icon.png`, `favicon.png`, `icon.svg`
- `apps/mobile/store/icone-512.png` e `destaque-1024x500.png` (Play Store)

## Ao criar arte nova

1. Edite/adicione uma função no `gerar-arte.mjs` usando as cores `C`.
2. Rode `pnpm arte` e **abra o PNG para conferir** (corte, zona segura, legibilidade em 48px).
3. Para screenshots da loja: capturar o app no emulador (1080×1920) e compor moldura + frase curta no mesmo script.
