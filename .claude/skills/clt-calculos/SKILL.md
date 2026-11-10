---
name: clt-calculos
description: Regras e procedimento para criar ou alterar qualquer cálculo trabalhista (INSS, IRRF, rescisão, férias, 13º, hora extra, FGTS) no packages/core. Use sempre que mexer em fórmula, tabela ou premissa de cálculo.
---

# Cálculos CLT

O `packages/core` é a fonte da verdade. Um erro aqui vira avaliação 1 estrela e risco de reclamação. Trabalhe com rigor.

## Procedimento

1. **Ache a base legal antes de codar.** Pesquise na web (fontes oficiais primeiro: planalto.gov.br, gov.br/receitafederal, gov.br/inss, TST/STJ). Anote lei/artigo/súmula.
2. **Escreva o teste primeiro** em `packages/core/src/*.test.ts`, com valores calculados à mão e o raciocínio em comentário.
3. Implemente como função pura que recebe `tabela?: TabelaAnual`.
4. Exponha detalhes (itens, bases, premissas) para a UI explicar o resultado.
5. Rode `pnpm --filter @acerto/core test` e `pnpm --filter @acerto/core typecheck`.
6. Peça revisão ao agente `revisor-clt` quando mudar regra existente.

## Regras já implementadas (resumo)

| Tema | Regra | Base |
|---|---|---|
| INSS empregado | Progressivo por faixa, arredonda o total; teto 2026 R$ 8.475,55 | EC 103/2019; Portaria MPS/MF |
| IRRF | Base = bruto − maior entre (INSS + dependentes + pensão) e desconto simplificado; tabela progressiva; depois redutor | Lei 15.191/2025 |
| Redutor 2026 | Até R$ 5.000: reduz até R$ 312,89 (zera). R$ 5.000,01–7.350: 978,62 − 0,133145 × rendimentos. Acima: 0. Calculado sobre rendimento **bruto** tributável | Lei 15.270/2025 |
| Férias | Valor-dia = salário/30; 1/3 constitucional; abono de até 10 dias + 1/3 isentos de INSS/IR | CLT art. 143–145 |
| 13º | avos/12; 1ª parcela sem descontos; INSS/IR na 2ª, tributação exclusiva | Lei 4.090/62 |
| Avos | Fração ≥ 15 dias conta como mês | CLT art. 146 par. único |
| Aviso prévio | 30 + 3 dias por ano completo, máx. 90 | Lei 12.506/2011 |
| Acordo | Metade do aviso indenizado, multa FGTS 20%, saque 80%, sem seguro-desemprego | CLT art. 484-A |
| Aviso não cumprido (pedido) | Desconto de um salário | CLT art. 487 §2º |
| Verbas indenizadas | Aviso indenizado e férias indenizadas sem INSS/IRRF; FGTS incide sobre aviso indenizado | STJ Tema 478; Súm. 386 STJ; Súm. 305 TST |
| Justa causa | Só saldo de salário e férias vencidas + 1/3 | CLT art. 482 |

## Pendências conhecidas (não remova sem resolver)

- **Redutor no 13º**: hoje aplicado (`aplicarRedutor` padrão `true`). Confirmar orientação oficial da Receita para tributação exclusiva do 13º em 2026.
- **Projeção do aviso no acordo**: projeta pelos dias indenizados (metade). Há entendimento de projetar o aviso integral; documentado em `premissas`.
- **Férias vencidas em dobro** (art. 137): ainda não calculado; só avisado em `premissas`.
- **Médias de variáveis** (HE, comissões) em férias/13º/rescisão: hoje o usuário soma ao salário manualmente.
- **Contrato de experiência** e **término de contrato determinado** (art. 479/480): não implementados.

## Armadilhas

- Nunca use `Date` local; use os helpers de `datas.ts` (UTC).
- `Infinity` na última faixa do IRRF: serializar como `null` em JSON.
- Ao comparar com calculadoras da internet, diferenças de 1 centavo vêm de arredondamento; diferenças maiores quase sempre são tabela de ano errado.
