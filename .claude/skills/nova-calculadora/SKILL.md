---
name: nova-calculadora
description: Passo a passo para adicionar uma calculadora nova ao app Acerto, do core até a tela e a ficha da loja. Use quando o pedido for "criar calculadora de X" (ex.: adicional noturno, insalubridade, seguro-desemprego, PLR).
---

# Nova calculadora de ponta a ponta

1. **Core** (`packages/core/src/<nome>.ts`)
   - Siga a skill `clt-calculos`: base legal → teste → função pura `calcular<Nome>(entrada, tabela?)`.
   - Exporte em `src/index.ts`.
2. **Tela** (`apps/mobile/app/<nome>.tsx`)
   - Copie a estrutura de `salario-liquido.tsx`: `Tela` → `Cartao` com campos → `Erro` → `Botao` → resultado com `Destaque` + `Linha`s → `Aviso`.
   - Use `useApp().tabela` e chame `aposCalculo()` do `useIntersticial` só depois de `setR(...)`.
   - Campos: `CampoDinheiro`, `CampoNumero`, `CampoData`, `Opcoes`. Valide e mostre erro em português simples.
3. **Home**: adicione o card em `CALCULADORAS` (`app/index.tsx`) com título curto, descrição de até 40 caracteres e símbolo.
4. **Loja**: acrescente a palavra-chave da calculadora na descrição (skill `aso-play-store`).
5. **Verificação**: `pnpm check`. Se possível, rode no dev build e confira com um caso real.

Ideias de próximas calculadoras (alta busca): seguro-desemprego, adicional noturno, insalubridade/periculosidade, PLR com tabela própria de IR, horas trabalhadas/banco de horas, custo do funcionário para empresa.
