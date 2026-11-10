import type { TabelaAnual } from "./types.js";

/**
 * Tabelas vigentes em 2026.
 * Ao atualizar, siga a skill `tabelas-anuais` e revise com o agente `revisor-clt`.
 */
export const TABELA_2026: TabelaAnual = {
  ano: 2026,
  vigenciaInicio: "2026-01-01",
  salarioMinimo: 1621.0,
  inss: {
    // Portaria Interministerial MPS/MF (jan/2026). Desconto máx. R$ 988,09.
    faixas: [
      { ate: 1621.0, aliquota: 0.075 },
      { ate: 2902.84, aliquota: 0.09 },
      { ate: 4354.27, aliquota: 0.12 },
      { ate: 8475.55, aliquota: 0.14 },
    ],
    teto: 8475.55,
  },
  irrf: {
    // Tabela progressiva mensal vigente desde mai/2025 (Lei 15.191/2025), mantida em 2026.
    faixas: [
      { ate: 2428.8, aliquota: 0, deducao: 0 },
      { ate: 2826.65, aliquota: 0.075, deducao: 182.16 },
      { ate: 3751.05, aliquota: 0.15, deducao: 394.16 },
      { ate: 4664.68, aliquota: 0.225, deducao: 675.49 },
      { ate: Infinity, aliquota: 0.275, deducao: 908.73 },
    ],
    deducaoDependente: 189.59,
    descontoSimplificado: 607.2,
    // Lei 15.270/2025: redução mensal a partir de jan/2026.
    redutor: {
      isencaoAte: 5000.0,
      reducaoMaxima: 312.89,
      transicaoAte: 7350.0,
      constante: 978.62,
      fator: 0.133145,
    },
  },
  fgts: { aliquota: 0.08, multaSemJustaCausa: 0.4, multaAcordo: 0.2 },
  fontes: [
    "Portaria Interministerial MPS/MF nº 13/2026 (INSS, salário mínimo, teto)",
    "Lei 15.191/2025 (tabela progressiva IRRF)",
    "Lei 15.270/2025 (redução mensal do IRRF)",
    "Lei 8.036/1990 (FGTS) e CLT art. 484-A (acordo)",
  ],
};
