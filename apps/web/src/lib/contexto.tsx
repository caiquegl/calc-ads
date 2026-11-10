"use client";

import { TABELA_PADRAO, type TabelaAnual } from "@acerto/core";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { carregarConfig, carregarTabela, CONFIG_LOCAL, type ConfigRemota } from "./remoto";

interface Contexto {
  tabela: TabelaAnual;
  config: ConfigRemota;
}

const Ctx = createContext<Contexto>({ tabela: TABELA_PADRAO, config: CONFIG_LOCAL });

/** Começa com a tabela embarcada (calcula na hora) e troca pela da API quando chegar. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Contexto>({ tabela: TABELA_PADRAO, config: CONFIG_LOCAL });

  useEffect(() => {
    Promise.all([carregarTabela(), carregarConfig()]).then(([tabela, config]) => setEstado({ tabela, config }));
  }, []);

  return <Ctx.Provider value={estado}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
