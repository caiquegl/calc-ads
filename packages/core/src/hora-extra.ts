import { round2 } from "./money.js";

export interface EntradaHoraExtra {
  salario: number;
  /** Jornada mensal (padrão 220h = 44h semanais). */
  jornadaMensal?: number;
  horas50?: number;
  horas100?: number;
  /** Adicional customizado (ex.: convenção coletiva 70%). */
  horasCustom?: { horas: number; percentual: number }[];
  /** Para reflexo no DSR. Se omitido, DSR não é calculado. */
  diasUteis?: number;
  domingosEFeriados?: number;
}

export interface ResultadoHoraExtra {
  valorHora: number;
  valor50: number;
  valor100: number;
  valorCustom: number;
  totalHorasExtras: number;
  dsr: number;
  total: number;
}

export function calcularHoraExtra(entrada: EntradaHoraExtra): ResultadoHoraExtra {
  const jornada = entrada.jornadaMensal ?? 220;
  const valorHora = entrada.salario / jornada;
  const valor50 = valorHora * 1.5 * (entrada.horas50 ?? 0);
  const valor100 = valorHora * 2 * (entrada.horas100 ?? 0);
  const valorCustom = (entrada.horasCustom ?? []).reduce(
    (acc, h) => acc + valorHora * (1 + h.percentual / 100) * h.horas,
    0,
  );
  const totalHorasExtras = valor50 + valor100 + valorCustom;
  const dsr =
    entrada.diasUteis && entrada.domingosEFeriados
      ? (totalHorasExtras / entrada.diasUteis) * entrada.domingosEFeriados
      : 0;

  return {
    valorHora: round2(valorHora),
    valor50: round2(valor50),
    valor100: round2(valor100),
    valorCustom: round2(valorCustom),
    totalHorasExtras: round2(totalHorasExtras),
    dsr: round2(dsr),
    total: round2(totalHorasExtras + dsr),
  };
}
