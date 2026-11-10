import { TABELA_PADRAO } from "@acerto/core";
import type { Metadata } from "next";
import { infoCalculadora, type RotaCalculadora } from "./calculadoras";

/** Título e descrição de SEO de cada calculadora, com o ano das tabelas. */
export function metadataCalculadora(rota: RotaCalculadora): Metadata {
  const c = infoCalculadora(rota);
  const titulo = `${c.seo} ${TABELA_PADRAO.ano}`;
  const descricao = `${c.descricao}. Simulação gratuita pelas regras da CLT e tabelas de ${TABELA_PADRAO.ano}.`;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: rota },
    openGraph: { title: titulo, description: descricao, url: rota },
  };
}
