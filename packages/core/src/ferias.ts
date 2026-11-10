import { calcularInss } from "./inss.js";
import { calcularIrrf } from "./irrf.js";
import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface EntradaFerias {
  /** Remuneração mensal (salário + médias de variáveis). */
  salario: number;
  /** Dias de gozo (padrão 30). */
  diasGozo?: number;
  /** Dias vendidos como abono pecuniário (máx. 10, CLT art. 143). */
  diasAbono?: number;
  dependentes?: number;
}

export interface ResultadoFerias {
  ferias: number;
  tercoFerias: number;
  abono: number;
  tercoAbono: number;
  bruto: number;
  inss: number;
  irrf: number;
  liquido: number;
}

/** Férias gozadas. Abono pecuniário e seu 1/3 são isentos de INSS e IRRF. */
export function calcularFerias(entrada: EntradaFerias, tabela: TabelaAnual = TABELA_PADRAO): ResultadoFerias {
  const diasAbono = Math.min(Math.max(entrada.diasAbono ?? 0, 0), 10);
  const diasGozo = entrada.diasGozo ?? 30 - diasAbono;
  const valorDia = entrada.salario / 30;

  const ferias = valorDia * diasGozo;
  const tercoFerias = ferias / 3;
  const abono = valorDia * diasAbono;
  const tercoAbono = abono / 3;

  const tributavel = ferias + tercoFerias;
  const inss = calcularInss(tributavel, tabela).valor;
  const irrf = calcularIrrf(
    { rendimentosTributaveis: tributavel, inss, dependentes: entrada.dependentes ?? 0 },
    tabela,
  ).valor;

  const bruto = ferias + tercoFerias + abono + tercoAbono;
  return {
    ferias: round2(ferias),
    tercoFerias: round2(tercoFerias),
    abono: round2(abono),
    tercoAbono: round2(tercoAbono),
    bruto: round2(bruto),
    inss,
    irrf,
    liquido: round2(bruto - inss - irrf),
  };
}
