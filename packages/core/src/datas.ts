/** Utilitários de data em UTC. Entradas/saídas no formato YYYY-MM-DD. */

export function parseData(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) throw new Error(`Data inválida: ${iso}`);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatData(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDias(date: Date, dias: number): Date {
  const r = new Date(date);
  r.setUTCDate(r.getUTCDate() + dias);
  return r;
}

export function addMeses(date: Date, meses: number): Date {
  const r = new Date(date);
  const dia = r.getUTCDate();
  r.setUTCDate(1);
  r.setUTCMonth(r.getUTCMonth() + meses);
  const ultimo = diasNoMes(r.getUTCFullYear(), r.getUTCMonth());
  r.setUTCDate(Math.min(dia, ultimo));
  return r;
}

export function diasNoMes(ano: number, mes0: number): number {
  return new Date(Date.UTC(ano, mes0 + 1, 0)).getUTCDate();
}

/** Diferença em dias, inclusiva (mesmo dia = 1). */
export function diasEntreInclusivo(inicio: Date, fim: Date): number {
  return Math.floor((fim.getTime() - inicio.getTime()) / 86_400_000) + 1;
}

/** Anos completos entre duas datas. */
export function anosCompletos(inicio: Date, fim: Date): number {
  let anos = fim.getUTCFullYear() - inicio.getUTCFullYear();
  const aniversario = addMeses(inicio, anos * 12);
  if (aniversario > fim) anos -= 1;
  return Math.max(0, anos);
}

/**
 * Avos: meses completos entre `inicio` e `fim` (inclusivo), contando como mês
 * a fração final de 15 dias ou mais (CLT art. 146, parágrafo único; Lei 4.090/62).
 */
export function avosEntre(inicio: Date, fim: Date): number {
  if (fim < inicio) return 0;
  let meses = 0;
  let cursor = inicio;
  for (;;) {
    const proximo = addMeses(inicio, meses + 1);
    if (addDias(proximo, -1) > fim) break;
    meses += 1;
    cursor = proximo;
  }
  const resto = diasEntreInclusivo(cursor, fim);
  if (resto >= 15) meses += 1;
  return Math.min(meses, 12);
}

/** Avos de 13º: meses do ano civil com 15 dias ou mais trabalhados. */
export function avosDecimoTerceiro(admissao: Date, fim: Date, ano: number): number {
  let avos = 0;
  for (let mes = 0; mes < 12; mes++) {
    const iniMes = new Date(Date.UTC(ano, mes, 1));
    const fimMes = new Date(Date.UTC(ano, mes, diasNoMes(ano, mes)));
    const ini = admissao > iniMes ? admissao : iniMes;
    const f = fim < fimMes ? fim : fimMes;
    if (f >= ini && diasEntreInclusivo(ini, f) >= 15) avos += 1;
  }
  return avos;
}
