import { formatBRL } from "@acerto/core";

/** Valores sempre com brl() (regra do projeto). */
export const brl = formatBRL;

/** "1.234,56" ou "1234,56" → 1234.56 */
export function parseValor(texto: string): number {
  const limpo = texto.replace(/[^\d,]/g, "").replace(",", ".");
  const n = Number(limpo);
  return Number.isFinite(n) ? n : 0;
}

/** Máscara de dinheiro a partir de dígitos digitados: "123456" → "1.234,56" */
export function mascaraDinheiro(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 11);
  if (!digitos) return "";
  const valor = Number(digitos) / 100;
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Máscara DD/MM/AAAA */
export function mascaraData(texto: string): string {
  const d = texto.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** DD/MM/AAAA → YYYY-MM-DD (ou null se inválida) */
export function dataParaIso(texto: string): string | null {
  const m = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, aaaa] = m;
  const iso = `${aaaa}-${mm}-${dd}`;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso ? null : iso;
}
