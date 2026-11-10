import { TABELA_PADRAO, type TabelaAnual } from "@acerto/core";

/** Em dev aponta para `pnpm dev:api`; em produção só chama a API se a URL for definida. */
const API = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:8787" : "");
const CHAVE_TABELA = "acerto:tabela";
const CHAVE_CONFIG = "acerto:config";

export interface ConfigRemota {
  anuncios: {
    habilitado: boolean;
    banner: boolean;
    intersticialACadaCalculos: number;
    intersticialIntervaloMinSeg: number;
    appOpen: boolean;
  };
  versaoMinima: string;
  aviso: null | { titulo: string; mensagem: string };
}

export const CONFIG_LOCAL: ConfigRemota = {
  anuncios: { habilitado: true, banner: true, intersticialACadaCalculos: 3, intersticialIntervaloMinSeg: 120, appOpen: false },
  versaoMinima: "0.1.0",
  aviso: null,
};

async function buscar<T>(caminho: string): Promise<T | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}${caminho}`, { signal: AbortSignal.timeout(4000) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null; // API fora do ar: segue com cache ou tabela embarcada
  }
}

/** localStorage pode não existir ou lançar erro (aba anônima, bloqueio de cookies). */
function lerCache<T>(chave: string): T | null {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : null;
  } catch {
    return null;
  }
}

function gravarCache(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem cache, sem problema */
  }
}

/** JSON não tem Infinity: a API manda a última faixa do IRRF como null. */
function desserializar(t: TabelaAnual): TabelaAnual {
  return { ...t, irrf: { ...t.irrf, faixas: t.irrf.faixas.map((f) => ({ ...f, ate: f.ate ?? Infinity })) } };
}

/** Tabela do ano: API → cache → embarcada. Nunca bloqueia o cálculo. */
export async function carregarTabela(ano = new Date().getFullYear()): Promise<TabelaAnual> {
  const remota = await buscar<{ tabela: TabelaAnual }>(`/v1/tabelas/${ano}`);
  if (remota?.tabela) {
    gravarCache(CHAVE_TABELA, remota.tabela);
    return desserializar(remota.tabela);
  }
  const cache = lerCache<TabelaAnual>(CHAVE_TABELA);
  return cache ? desserializar(cache) : TABELA_PADRAO;
}

export async function carregarConfig(): Promise<ConfigRemota> {
  const remota = await buscar<ConfigRemota>("/v1/config");
  if (remota) {
    gravarCache(CHAVE_CONFIG, remota);
    return remota;
  }
  return lerCache<ConfigRemota>(CHAVE_CONFIG) ?? CONFIG_LOCAL;
}
