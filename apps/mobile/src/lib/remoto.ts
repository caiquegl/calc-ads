import AsyncStorage from "@react-native-async-storage/async-storage";
import { TABELA_PADRAO, type TabelaAnual } from "@acerto/core";
import Constants from "expo-constants";

const API = (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? "";
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
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`${API}${caminho}`, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null; // offline: o app segue com dados locais
  }
}

function desserializar(t: TabelaAnual): TabelaAnual {
  return { ...t, irrf: { ...t.irrf, faixas: t.irrf.faixas.map((f) => ({ ...f, ate: f.ate ?? Infinity })) } };
}

/** Tabela do ano: API → cache → embarcada. Nunca bloqueia o cálculo. */
export async function carregarTabela(ano = new Date().getFullYear()): Promise<TabelaAnual> {
  const remota = await buscar<{ tabela: TabelaAnual }>(`/v1/tabelas/${ano}`);
  if (remota?.tabela) {
    await AsyncStorage.setItem(CHAVE_TABELA, JSON.stringify(remota.tabela));
    return desserializar(remota.tabela);
  }
  const cache = await AsyncStorage.getItem(CHAVE_TABELA);
  return cache ? desserializar(JSON.parse(cache)) : TABELA_PADRAO;
}

export async function carregarConfig(): Promise<ConfigRemota> {
  const remota = await buscar<ConfigRemota>("/v1/config");
  if (remota) {
    await AsyncStorage.setItem(CHAVE_CONFIG, JSON.stringify(remota));
    return remota;
  }
  const cache = await AsyncStorage.getItem(CHAVE_CONFIG);
  return cache ? (JSON.parse(cache) as ConfigRemota) : CONFIG_LOCAL;
}
