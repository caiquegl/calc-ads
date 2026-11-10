import { calcularInss } from "./inss.js";
import { calcularIrrf } from "./irrf.js";
import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface EntradaSalarioLiquido {
  salarioBruto: number;
  dependentes?: number;
  pensaoAlimenticia?: number;
  /** Outros descontos que não afetam a base (VT, plano de saúde, etc.). */
  outrosDescontos?: number;
}

export interface ResultadoSalarioLiquido {
  bruto: number;
  inss: number;
  irrf: number;
  outrosDescontos: number;
  liquido: number;
  fgtsMensal: number;
  detalhes: { inss: ReturnType<typeof calcularInss>; irrf: ReturnType<typeof calcularIrrf> };
}

export function calcularSalarioLiquido(
  entrada: EntradaSalarioLiquido,
  tabela: TabelaAnual = TABELA_PADRAO,
): ResultadoSalarioLiquido {
  const { salarioBruto, dependentes = 0, pensaoAlimenticia = 0, outrosDescontos = 0 } = entrada;
  const inss = calcularInss(salarioBruto, tabela);
  const irrf = calcularIrrf(
    { rendimentosTributaveis: salarioBruto, inss: inss.valor, dependentes, pensaoAlimenticia },
    tabela,
  );
  const liquido = round2(salarioBruto - inss.valor - irrf.valor - pensaoAlimenticia - outrosDescontos);
  return {
    bruto: round2(salarioBruto),
    inss: inss.valor,
    irrf: irrf.valor,
    outrosDescontos: round2(outrosDescontos + pensaoAlimenticia),
    liquido,
    fgtsMensal: round2(salarioBruto * tabela.fgts.aliquota),
    detalhes: { inss, irrf },
  };
}
