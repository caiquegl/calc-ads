import { calcularFgts, type ResultadoFgts } from "@acerto/core";
import { useState } from "react";
import { useIntersticial } from "@/ads/useIntersticial";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Linha, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { parseValor } from "@/lib/format";

export default function Fgts() {
  const { tabela } = useApp();
  const { aposCalculo } = useIntersticial();
  const [salario, setSalario] = useState("");
  const [meses, setMeses] = useState("");
  const [saldo, setSaldo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoFgts | null>(null);

  function calcular() {
    const s = parseValor(salario);
    if (s <= 0) return setErro("Informe o salário.");
    setErro(null);
    setR(calcularFgts({ salario: s, meses: Number(meses || 0), saldoAtual: parseValor(saldo), incluirDecimoTerceiro: true }, tabela));
    aposCalculo();
  }

  return (
    <Tela titulo="FGTS" subtitulo="Depósitos, saldo estimado e multa">
      <Cartao>
        <CampoDinheiro rotulo="Salário bruto" valor={salario} onChange={setSalario} />
        <CampoNumero rotulo="Meses a projetar" valor={meses} onChange={setMeses} />
        <CampoDinheiro rotulo="Saldo atual (opcional)" valor={saldo} onChange={setSaldo} />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" onPress={calcular} />
      </Cartao>
      {r && (
        <Cartao>
          <Destaque rotulo="Saldo estimado" valor={r.saldoEstimado} />
          <Linha rotulo="Depósito mensal (8%)" valor={r.depositoMensal} />
          <Linha rotulo="Total depositado no período" valor={r.totalDepositado} />
          <Linha rotulo="Multa de 40% (sem justa causa)" valor={r.multa40} tipo="provento" />
          <Linha rotulo="Multa de 20% (acordo)" valor={r.multa20} tipo="provento" />
        </Cartao>
      )}
      <Aviso>Estimativa sem a correção anual (TR + 3%) e sem distribuição de lucros do FGTS.</Aviso>
    </Tela>
  );
}
