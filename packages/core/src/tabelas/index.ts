import { TABELA_2026 } from "./2026.js";
import type { TabelaAnual } from "./types.js";

export * from "./types.js";
export { TABELA_2026 };

/** Tabelas embarcadas no app (funcionam offline). A API pode enviar versões mais novas. */
export const TABELAS: Record<number, TabelaAnual> = {
  2026: TABELA_2026,
};

export const TABELA_PADRAO = TABELA_2026;

export function tabelaDoAno(ano: number, extras: TabelaAnual[] = []): TabelaAnual {
  const remota = extras.find((t) => t.ano === ano);
  if (remota) return remota;
  const local = TABELAS[ano];
  if (local) return local;
  // Ano sem tabela: usa a mais recente disponível.
  const anos = Object.keys(TABELAS).map(Number).sort((a, b) => b - a);
  return TABELAS[anos[0]!]!;
}
