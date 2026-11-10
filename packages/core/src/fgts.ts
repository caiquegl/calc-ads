import { round2 } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export interface EntradaFgts {
  salario: number;
  meses: number;
  /** Saldo já existente na conta. */
  saldoAtual?: number;
  /** Inclui depósito sobre o 13º a cada 12 meses. */
  incluirDecimoTerceiro?: boolean;
}

export interface ResultadoFgts {
  depositoMensal: number;
  totalDepositado: number;
  saldoEstimado: number;
  multa40: number;
  multa20: number;
}

/** Estimativa simples (sem correção TR+3% e sem distribuição de lucros). */
export function calcularFgts(entrada: EntradaFgts, tabela: TabelaAnual = TABELA_PADRAO): ResultadoFgts {
  const deposito = entrada.salario * tabela.fgts.aliquota;
  const meses = Math.max(0, Math.floor(entrada.meses));
  const depositos13 = entrada.incluirDecimoTerceiro ? Math.floor(meses / 12) * deposito : 0;
  const totalDepositado = deposito * meses + depositos13;
  const saldo = (entrada.saldoAtual ?? 0) + totalDepositado;
  return {
    depositoMensal: round2(deposito),
    totalDepositado: round2(totalDepositado),
    saldoEstimado: round2(saldo),
    multa40: round2(saldo * tabela.fgts.multaSemJustaCausa),
    multa20: round2(saldo * tabela.fgts.multaAcordo),
  };
}
