"use client";

import { calcularRescisao, type ResultadoRescisao, type TipoAviso, type TipoRescisao } from "@acerto/core";
import { useState } from "react";
import { AdResultado } from "@/ads/Anuncios";
import { Aviso, Botao, CampoData, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Formulario, Linha, Opcoes, Resultado, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { dataParaIso, parseValor } from "@/lib/format";

const TIPOS: { valor: TipoRescisao; rotulo: string }[] = [
  { valor: "sem_justa_causa", rotulo: "Demitido sem justa causa" },
  { valor: "pedido_demissao", rotulo: "Pedi demissão" },
  { valor: "acordo", rotulo: "Acordo" },
  { valor: "justa_causa", rotulo: "Justa causa" },
];

const AVISOS: Record<TipoRescisao, { valor: TipoAviso; rotulo: string }[]> = {
  sem_justa_causa: [{ valor: "indenizado", rotulo: "Indenizado" }, { valor: "trabalhado", rotulo: "Trabalhado" }],
  acordo: [{ valor: "indenizado", rotulo: "Indenizado" }, { valor: "trabalhado", rotulo: "Trabalhado" }],
  pedido_demissao: [{ valor: "trabalhado", rotulo: "Cumpri" }, { valor: "nao_cumprido", rotulo: "Não cumpri" }, { valor: "dispensado", rotulo: "Empresa dispensou" }],
  justa_causa: [{ valor: "dispensado", rotulo: "Sem aviso" }],
};

export function Rescisao() {
  const { tabela } = useApp();
  const [salario, setSalario] = useState("");
  const [admissao, setAdmissao] = useState("");
  const [saida, setSaida] = useState("");
  const [tipo, setTipo] = useState<TipoRescisao>("sem_justa_causa");
  const [aviso, setAviso] = useState<TipoAviso>("indenizado");
  const [vencidas, setVencidas] = useState("");
  const [fgts, setFgts] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoRescisao | null>(null);

  function trocarTipo(t: TipoRescisao) {
    setTipo(t);
    setAviso(AVISOS[t][0]!.valor);
  }

  function calcular() {
    const s = parseValor(salario);
    const adm = dataParaIso(admissao);
    const des = dataParaIso(saida);
    if (s <= 0) return setErro("Informe o salário.");
    if (!adm || !des) return setErro("Confira as datas (DD/MM/AAAA).");
    try {
      setR(calcularRescisao({ salario: s, admissao: adm, desligamento: des, tipo, aviso, periodosFeriasVencidas: Number(vencidas || 0), saldoFgts: fgts ? parseValor(fgts) : undefined }, tabela));
      setErro(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível calcular.");
    }
  }

  return (
    <Tela titulo="Rescisão" subtitulo="Simule o que você recebe ao sair">
      <Formulario onCalcular={calcular}>
        <Opcoes rotulo="Como foi a saída" opcoes={TIPOS} valor={tipo} onChange={trocarTipo} />
        <Opcoes rotulo="Aviso prévio" opcoes={AVISOS[tipo]} valor={aviso} onChange={setAviso} />
        <CampoDinheiro rotulo="Último salário bruto" valor={salario} onChange={setSalario} />
        <CampoData rotulo="Data de admissão" valor={admissao} onChange={setAdmissao} />
        <CampoData rotulo="Último dia trabalhado" valor={saida} onChange={setSaida} />
        <CampoNumero rotulo="Férias vencidas (períodos)" valor={vencidas} onChange={setVencidas} ajuda="Anos completos em que você não tirou férias." />
        <CampoDinheiro rotulo="Saldo do FGTS (opcional)" valor={fgts} onChange={setFgts} ajuda="Veja no app FGTS. Se deixar vazio, estimamos." />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular rescisão" />
      </Formulario>
      {r && (
        <Resultado de={r}>
          <Cartao>
            <Destaque rotulo="Total a receber" valor={r.liquido} />
            {r.itens.map((i) => <Linha key={i.codigo} rotulo={i.descricao} valor={i.valor} tipo={i.tipo} />)}
          </Cartao>
          <Cartao>
            <Linha rotulo={`Saldo FGTS${r.fgts.estimado ? " (estimado)" : ""}`} valor={r.fgts.saldoBase} />
            <Linha rotulo="Depósito na rescisão" valor={r.fgts.depositoRescisorio} />
            {r.fgts.multa > 0 && <Linha rotulo="Multa do FGTS" valor={r.fgts.multa} tipo="provento" />}
            <Destaque rotulo="FGTS disponível para saque" valor={r.fgts.saqueDisponivel} />
            {r.seguroDesemprego && <Aviso>Você pode ter direito ao seguro-desemprego.</Aviso>}
          </Cartao>
          {r.premissas.map((p) => <Aviso key={p}>• {p}</Aviso>)}
          <AdResultado />
        </Resultado>
      )}
      <Aviso>Simulação informativa, não substitui o cálculo oficial do TRCT nem orientação jurídica.</Aviso>
    </Tela>
  );
}
