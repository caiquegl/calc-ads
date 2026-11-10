import { calcularInss } from "./inss.js";
import { calcularIrrf } from "./irrf.js";
import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface EntradaDecimoTerceiro {
  salario: number;
  /** Meses trabalhados no ano (avos, 1 a 12). */
  meses: number;
  dependentes?: number;
  /**
   * Aplica o redutor da Lei 15.270/2025 ao 13º (tributação exclusiva).
   * ATENÇÃO: confirmar entendimento da Receita antes de publicar — ver skill clt-calculos.
   */
  aplicarRedutor?: boolean;
}

export interface ResultadoDecimoTerceiro {
  valorBruto: number;
  primeiraParcela: number;
  inss: number;
  irrf: number;
  segundaParcela: number;
  liquidoTotal: number;
}

export function calcularDecimoTerceiro(
  entrada: EntradaDecimoTerceiro,
  tabela: TabelaAnual = TABELA_PADRAO,
): ResultadoDecimoTerceiro {
  const meses = Math.min(Math.max(Math.floor(entrada.meses), 0), 12);
  const valorBruto = (entrada.salario * meses) / 12;
  const primeiraParcela = valorBruto / 2; // sem descontos (até 30/11)

  const inss = calcularInss(valorBruto, tabela).valor;
  const irrf = calcularIrrf(
    {
      rendimentosTributaveis: valorBruto,
      inss,
      dependentes: entrada.dependentes ?? 0,
      aplicarRedutor: entrada.aplicarRedutor ?? true,
    },
    tabela,
  ).valor;

  const segundaParcela = valorBruto - primeiraParcela - inss - irrf;
  return {
    valorBruto: round2(valorBruto),
    primeiraParcela: round2(primeiraParcela),
    inss,
    irrf,
    segundaParcela: round2(segundaParcela),
    liquidoTotal: round2(valorBruto - inss - irrf),
  };
}
