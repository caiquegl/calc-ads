/** Lista única das calculadoras: usada na home, no sitemap e nos títulos das páginas. */
export const CALCULADORAS = [
  { rota: "/rescisao", titulo: "Rescisão", descricao: "Quanto recebo ao sair da empresa", simbolo: "⇥", seo: "Calculadora de rescisão CLT" },
  { rota: "/salario-liquido", titulo: "Salário líquido", descricao: "INSS e IR descontados no holerite", simbolo: "=", seo: "Calculadora de salário líquido" },
  { rota: "/ferias", titulo: "Férias", descricao: "Com 1/3 e venda de 10 dias", simbolo: "☼", seo: "Calculadora de férias" },
  { rota: "/decimo-terceiro", titulo: "13º salário", descricao: "1ª e 2ª parcela", simbolo: "13", seo: "Calculadora de 13º salário" },
  { rota: "/hora-extra", titulo: "Hora extra", descricao: "50%, 100% e reflexo no DSR", simbolo: "+h", seo: "Calculadora de hora extra" },
  { rota: "/fgts", titulo: "FGTS", descricao: "Saldo estimado e multa de 40%", simbolo: "%", seo: "Calculadora de FGTS" },
] as const;

export type RotaCalculadora = (typeof CALCULADORAS)[number]["rota"];

export function infoCalculadora(rota: RotaCalculadora) {
  return CALCULADORAS.find((c) => c.rota === rota)!;
}
