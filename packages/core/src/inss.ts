import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface ResultadoInss {
  valor: number;
  aliquotaEfetiva: number;
  /** Contribuição por faixa, para exibir o passo a passo no app. */
  faixas: { de: number; ate: number; aliquota: number; base: number; valor: number }[];
}

/** INSS progressivo do empregado (CLT, doméstico, avulso). */
export function calcularInss(salarioContribuicao: number, tabela: TabelaAnual = TABELA_PADRAO): ResultadoInss {
  const base = Math.min(Math.max(salarioContribuicao, 0), tabela.inss.teto);
  let anterior = 0;
  let total = 0;
  const faixas: ResultadoInss["faixas"] = [];

  for (const faixa of tabela.inss.faixas) {
    if (base <= anterior) break;
    const parcela = Math.min(base, faixa.ate) - anterior;
    const valor = parcela * faixa.aliquota;
    total += valor;
    faixas.push({ de: anterior, ate: faixa.ate, aliquota: faixa.aliquota, base: round2(parcela), valor: round2(valor) });
    anterior = faixa.ate;
  }

  const valor = round2(total);
  return {
    valor,
    aliquotaEfetiva: salarioContribuicao > 0 ? valor / salarioContribuicao : 0,
    faixas,
  };
}
