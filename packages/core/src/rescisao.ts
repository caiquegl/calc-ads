import {
  addDias,
  addMeses,
  anosCompletos,
  avosDecimoTerceiro,
  avosEntre,
  formatData,
  parseData,
} from "./datas.js";
import { calcularInss } from "./inss.js";
import { calcularIrrf } from "./irrf.js";
import { round2, sum } from "./money.js";
import { TABELA_PADRAO, type TabelaAnual } from "./tabelas/index.js";

export type TipoRescisao = "sem_justa_causa" | "pedido_demissao" | "justa_causa" | "acordo";
export type TipoAviso = "trabalhado" | "indenizado" | "nao_cumprido" | "dispensado";

export interface EntradaRescisao {
  salario: number;
  /** YYYY-MM-DD */
  admissao: string;
  /** Último dia trabalhado (YYYY-MM-DD). Com aviso trabalhado, é o fim do aviso. */
  desligamento: string;
  tipo: TipoRescisao;
  aviso: TipoAviso;
  /** Períodos de férias vencidas não gozadas. */
  periodosFeriasVencidas?: number;
  /** Saldo do FGTS informado pelo usuário. Se omitido, é estimado. */
  saldoFgts?: number;
  dependentes?: number;
}

export interface ItemRescisao {
  codigo: string;
  descricao: string;
  valor: number;
  tipo: "provento" | "desconto";
}

export interface ResultadoRescisao {
  itens: ItemRescisao[];
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  diasAviso: number;
  dataProjetada: string;
  fgts: {
    saldoBase: number;
    estimado: boolean;
    depositoRescisorio: number;
    multa: number;
    saqueDisponivel: number;
  };
  seguroDesemprego: boolean;
  premissas: string[];
}

export function diasDeAviso(admissao: Date, desligamento: Date): number {
  // Lei 12.506/2011: 30 dias + 3 por ano completo, máximo 90.
  return Math.min(30 + 3 * anosCompletos(admissao, desligamento), 90);
}

export function calcularRescisao(entrada: EntradaRescisao, tabela: TabelaAnual = TABELA_PADRAO): ResultadoRescisao {
  const { salario, tipo, aviso, dependentes = 0 } = entrada;
  const admissao = parseData(entrada.admissao);
  const desligamento = parseData(entrada.desligamento);
  if (desligamento < admissao) throw new Error("Data de desligamento anterior à admissão.");

  const premissas: string[] = [];
  const itens: ItemRescisao[] = [];
  const valorDia = salario / 30;
  const justaCausa = tipo === "justa_causa";

  // Aviso prévio
  const diasAviso = diasDeAviso(admissao, desligamento);
  let diasIndenizados = 0;
  if (aviso === "indenizado" && tipo === "sem_justa_causa") diasIndenizados = diasAviso;
  if (aviso === "indenizado" && tipo === "acordo") {
    diasIndenizados = Math.floor(diasAviso / 2);
    premissas.push("Acordo (art. 484-A): aviso indenizado pela metade; projeção pelos dias indenizados.");
  }
  const dataProjetada = addDias(desligamento, diasIndenizados);

  // Saldo de salário
  const diasNoMes = Math.min(desligamento.getUTCDate(), 30);
  const saldoSalario = valorDia * diasNoMes;
  itens.push({ codigo: "saldo_salario", descricao: `Saldo de salário (${diasNoMes} dias)`, valor: round2(saldoSalario), tipo: "provento" });

  const avisoIndenizado = valorDia * diasIndenizados;
  if (avisoIndenizado > 0) {
    itens.push({ codigo: "aviso_indenizado", descricao: `Aviso prévio indenizado (${diasIndenizados} dias)`, valor: round2(avisoIndenizado), tipo: "provento" });
  }

  // 13º proporcional (considera projeção do aviso, inclusive virando o ano)
  let decimo = 0;
  if (!justaCausa) {
    const anoDeslig = desligamento.getUTCFullYear();
    const fimAno = parseData(`${anoDeslig}-12-31`);
    const fimPrimeiroAno = dataProjetada < fimAno ? dataProjetada : fimAno;
    let avos = avosDecimoTerceiro(admissao, fimPrimeiroAno, anoDeslig);
    const anoProj = dataProjetada.getUTCFullYear();
    if (anoProj > anoDeslig) avos += avosDecimoTerceiro(admissao, dataProjetada, anoProj);
    decimo = (salario * avos) / 12;
    if (decimo > 0) itens.push({ codigo: "decimo_terceiro", descricao: `13º proporcional (${avos}/12)`, valor: round2(decimo), tipo: "provento" });
  }

  // Férias vencidas + 1/3
  const periodos = Math.max(0, Math.floor(entrada.periodosFeriasVencidas ?? 0));
  if (periodos > 0) {
    const vencidas = salario * periodos;
    itens.push({ codigo: "ferias_vencidas", descricao: `Férias vencidas (${periodos} período${periodos > 1 ? "s" : ""})`, valor: round2(vencidas), tipo: "provento" });
    itens.push({ codigo: "terco_ferias_vencidas", descricao: "1/3 sobre férias vencidas", valor: round2(vencidas / 3), tipo: "provento" });
    premissas.push("Férias vencidas sem dobra (art. 137). Se passou o período concessivo, o valor pode dobrar.");
  }

  // Férias proporcionais + 1/3 (não há em justa causa)
  if (!justaCausa) {
    const inicioPeriodo = addMeses(admissao, 12 * anosCompletos(admissao, dataProjetada));
    const avosFerias = avosEntre(inicioPeriodo, dataProjetada);
    const proporcionais = (salario * avosFerias) / 12;
    if (proporcionais > 0) {
      itens.push({ codigo: "ferias_proporcionais", descricao: `Férias proporcionais (${avosFerias}/12)`, valor: round2(proporcionais), tipo: "provento" });
      itens.push({ codigo: "terco_ferias_proporcionais", descricao: "1/3 sobre férias proporcionais", valor: round2(proporcionais / 3), tipo: "provento" });
    }
  }

  // Descontos: INSS e IRRF separados para salário e 13º.
  // Aviso indenizado e férias indenizadas não sofrem INSS/IRRF (Tema 478 STJ; Súmula 386 STJ).
  const inssSalario = calcularInss(saldoSalario, tabela).valor;
  const irrfSalario = calcularIrrf({ rendimentosTributaveis: saldoSalario, inss: inssSalario, dependentes }, tabela).valor;
  const inss13 = decimo > 0 ? calcularInss(decimo, tabela).valor : 0;
  const irrf13 = decimo > 0 ? calcularIrrf({ rendimentosTributaveis: decimo, inss: inss13, dependentes }, tabela).valor : 0;

  if (inssSalario) itens.push({ codigo: "inss_salario", descricao: "INSS sobre saldo de salário", valor: inssSalario, tipo: "desconto" });
  if (irrfSalario) itens.push({ codigo: "irrf_salario", descricao: "IRRF sobre saldo de salário", valor: irrfSalario, tipo: "desconto" });
  if (inss13) itens.push({ codigo: "inss_13", descricao: "INSS sobre 13º", valor: inss13, tipo: "desconto" });
  if (irrf13) itens.push({ codigo: "irrf_13", descricao: "IRRF sobre 13º", valor: irrf13, tipo: "desconto" });

  if (tipo === "pedido_demissao" && aviso === "nao_cumprido") {
    itens.push({ codigo: "desconto_aviso", descricao: "Aviso prévio não cumprido (art. 487 §2º)", valor: round2(salario), tipo: "desconto" });
  }

  // FGTS
  const estimado = entrada.saldoFgts === undefined;
  const mesesServico = Math.max(1, Math.round((desligamento.getTime() - admissao.getTime()) / (86_400_000 * 30.4375)));
  const saldoBase = estimado ? salario * tabela.fgts.aliquota * mesesServico : entrada.saldoFgts!;
  if (estimado) premissas.push("Saldo do FGTS estimado (8% × salário atual × meses, sem correção). Informe o saldo real para mais precisão.");
  const depositoRescisorio = (saldoSalario + avisoIndenizado + decimo) * tabela.fgts.aliquota;
  const baseMulta = saldoBase + depositoRescisorio;
  const percentualMulta = tipo === "sem_justa_causa" ? tabela.fgts.multaSemJustaCausa : tipo === "acordo" ? tabela.fgts.multaAcordo : 0;
  const multa = baseMulta * percentualMulta;
  const percentualSaque = tipo === "sem_justa_causa" ? 1 : tipo === "acordo" ? 0.8 : 0;
  const saqueDisponivel = baseMulta * percentualSaque + multa;

  const totalProventos = sum(itens.filter((i) => i.tipo === "provento").map((i) => i.valor));
  const totalDescontos = sum(itens.filter((i) => i.tipo === "desconto").map((i) => i.valor));

  return {
    itens,
    totalProventos,
    totalDescontos,
    liquido: round2(totalProventos - totalDescontos),
    diasAviso,
    dataProjetada: formatData(dataProjetada),
    fgts: {
      saldoBase: round2(saldoBase),
      estimado,
      depositoRescisorio: round2(depositoRescisorio),
      multa: round2(multa),
      saqueDisponivel: round2(saqueDisponivel),
    },
    seguroDesemprego: tipo === "sem_justa_causa",
    premissas,
  };
}
