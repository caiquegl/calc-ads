export interface FaixaInss {
  /** Limite superior da faixa (inclusive). */
  ate: number;
  aliquota: number;
}

export interface FaixaIrrf {
  /** Limite superior da base de cálculo (inclusive). Use Infinity na última. */
  ate: number;
  aliquota: number;
  deducao: number;
}

export interface RedutorIrrf {
  /** Rendimento tributável até o qual a redução zera o imposto (Lei 15.270/2025). */
  isencaoAte: number;
  /** Redução máxima mensal na faixa de isenção. */
  reducaoMaxima: number;
  /** Rendimento até o qual se aplica a redução decrescente. */
  transicaoAte: number;
  /** Redução = constante − fator × rendimentos tributáveis. */
  constante: number;
  fator: number;
}

export interface TabelaAnual {
  ano: number;
  /** Data (YYYY-MM-DD) a partir da qual a tabela vale. */
  vigenciaInicio: string;
  salarioMinimo: number;
  inss: { faixas: FaixaInss[]; teto: number };
  irrf: {
    faixas: FaixaIrrf[];
    deducaoDependente: number;
    descontoSimplificado: number;
    redutor?: RedutorIrrf;
  };
  fgts: { aliquota: number; multaSemJustaCausa: number; multaAcordo: number };
  /** Fontes legais/consultadas. Obrigatório ao atualizar. */
  fontes: string[];
}
