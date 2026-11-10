import { calcularHoraExtra, type ResultadoHoraExtra } from "@acerto/core";
import { useState } from "react";
import { useIntersticial } from "@/ads/useIntersticial";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Linha, Tela } from "@/components/ui";
import { parseValor } from "@/lib/format";

export default function HoraExtra() {
  const { aposCalculo } = useIntersticial();
  const [salario, setSalario] = useState("");
  const [jornada, setJornada] = useState("220");
  const [h50, setH50] = useState("");
  const [h100, setH100] = useState("");
  const [uteis, setUteis] = useState("");
  const [domingos, setDomingos] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoHoraExtra | null>(null);

  function calcular() {
    const s = parseValor(salario);
    if (s <= 0) return setErro("Informe o salário.");
    setErro(null);
    setR(calcularHoraExtra({ salario: s, jornadaMensal: Number(jornada || 220), horas50: Number(h50 || 0), horas100: Number(h100 || 0), diasUteis: Number(uteis || 0), domingosEFeriados: Number(domingos || 0) }));
    aposCalculo();
  }

  return (
    <Tela titulo="Hora extra" subtitulo="Adicional de 50%, 100% e reflexo no DSR">
      <Cartao>
        <CampoDinheiro rotulo="Salário bruto" valor={salario} onChange={setSalario} />
        <CampoNumero rotulo="Jornada mensal (horas)" valor={jornada} onChange={setJornada} ajuda="220h = 44h semanais; 180h = 36h; 200h = 40h." />
        <CampoNumero rotulo="Horas extras a 50%" valor={h50} onChange={setH50} />
        <CampoNumero rotulo="Horas extras a 100%" valor={h100} onChange={setH100} ajuda="Domingos e feriados." />
        <CampoNumero rotulo="Dias úteis no mês (para DSR)" valor={uteis} onChange={setUteis} />
        <CampoNumero rotulo="Domingos e feriados no mês" valor={domingos} onChange={setDomingos} />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" onPress={calcular} />
      </Cartao>
      {r && (
        <Cartao>
          <Destaque rotulo="Total a receber" valor={r.total} />
          <Linha rotulo="Valor da hora normal" valor={r.valorHora} />
          <Linha rotulo="Horas a 50%" valor={r.valor50} tipo="provento" />
          <Linha rotulo="Horas a 100%" valor={r.valor100} tipo="provento" />
          <Linha rotulo="Reflexo no DSR" valor={r.dsr} tipo="provento" />
        </Cartao>
      )}
      <Aviso>Valores brutos. Convenções coletivas podem prever percentuais maiores.</Aviso>
    </Tela>
  );
}
