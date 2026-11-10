import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface EntradaIrrf {
  /** Rendimentos tributáveis brutos (ex.: salário bruto). */
  rendimentosTributaveis: number;
  /** INSS descontado sobre esses rendimentos. */
  inss: number;
  dependentes?: number;
  /** Pensão alimentícia judicial (dedutível). */
  pensaoAlimenticia?: number;
  /** Aplica a redução da Lei 15.270/2025. Padrão: true. */
  aplicarRedutor?: boolean;
}

export interface ResultadoIrrf {
  valor: number;
  base: number;
  tipoDeducao: "legal" | "simplificada";
  impostoAntesRedutor: number;
  redutor: number;
  aliquotaFaixa: number;
}

export function impostoPelaTabela(base: number, tabela: TabelaAnual): { imposto: number; aliquota: number } {
  const faixa = tabela.irrf.faixas.find((f) => base <= f.ate) ?? tabela.irrf.faixas[tabela.irrf.faixas.length - 1]!;
  return { imposto: Math.max(0, base * faixa.aliquota - faixa.deducao), aliquota: faixa.aliquota };
}

export function calcularRedutor(rendimentos: number, impostoCalculado: number, tabela: TabelaAnual): number {
  const r = tabela.irrf.redutor;
  if (!r) return 0;
  if (rendimentos <= r.isencaoAte) return Math.min(impostoCalculado, r.reducaoMaxima);
  if (rendimentos <= r.transicaoAte) {
    const reducao = r.constante - r.fator * rendimentos;
    return Math.min(impostoCalculado, Math.max(0, reducao));
  }
  return 0;
}

/**
 * IRRF mensal. Escolhe a dedução mais vantajosa entre a legal (INSS + dependentes + pensão)
 * e o desconto simplificado, e aplica o redutor de 2026.
 */
export function calcularIrrf(entrada: EntradaIrrf, tabela: TabelaAnual = TABELA_PADRAO): ResultadoIrrf {
  const { rendimentosTributaveis, inss, dependentes = 0, pensaoAlimenticia = 0, aplicarRedutor = true } = entrada;

  const deducaoLegal = inss + dependentes * tabela.irrf.deducaoDependente + pensaoAlimenticia;
  const deducaoSimplificada = tabela.irrf.descontoSimplificado;
  const usaSimplificada = deducaoSimplificada > deducaoLegal;
  const deducao = usaSimplificada ? deducaoSimplificada : deducaoLegal;

  const base = Math.max(0, rendimentosTributaveis - deducao);
  const { imposto, aliquota } = impostoPelaTabela(base, tabela);
  const redutor = aplicarRedutor ? calcularRedutor(rendimentosTributaveis, imposto, tabela) : 0;

  return {
    valor: round2(Math.max(0, imposto - redutor)),
    base: round2(base),
    tipoDeducao: usaSimplificada ? "simplificada" : "legal",
    impostoAntesRedutor: round2(imposto),
    redutor: round2(redutor),
    aliquotaFaixa: aliquota,
  };
}
