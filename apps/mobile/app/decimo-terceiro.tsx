import { calcularDecimoTerceiro, type ResultadoDecimoTerceiro } from "@acerto/core";
import { useState } from "react";
import { useIntersticial } from "@/ads/useIntersticial";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Linha, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { parseValor } from "@/lib/format";

export default function DecimoTerceiro() {
  const { tabela } = useApp();
  const { aposCalculo } = useIntersticial();
  const [salario, setSalario] = useState("");
  const [meses, setMeses] = useState("12");
  const [dependentes, setDependentes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoDecimoTerceiro | null>(null);

  function calcular() {
    const s = parseValor(salario);
    const m = Number(meses || 0);
    if (s <= 0) return setErro("Informe o salário.");
    if (m < 1 || m > 12) return setErro("Meses trabalhados: de 1 a 12.");
    setErro(null);
    setR(calcularDecimoTerceiro({ salario: s, meses: m, dependentes: Number(dependentes || 0) }, tabela));
    aposCalculo();
  }

  return (
    <Tela titulo="13º salário" subtitulo="Primeira e segunda parcela">
      <Cartao>
        <CampoDinheiro rotulo="Salário bruto" valor={salario} onChange={setSalario} />
        <CampoNumero rotulo="Meses trabalhados no ano" valor={meses} onChange={setMeses} ajuda="Conta o mês em que trabalhou 15 dias ou mais." />
        <CampoNumero rotulo="Dependentes" valor={dependentes} onChange={setDependentes} />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" onPress={calcular} />
      </Cartao>
      {r && (
        <Cartao>
          <Destaque rotulo="Total líquido" valor={r.liquidoTotal} />
          <Linha rotulo="13º bruto" valor={r.valorBruto} tipo="provento" />
          <Linha rotulo="1ª parcela (até 30/11)" valor={r.primeiraParcela} />
          <Linha rotulo="INSS" valor={r.inss} tipo="desconto" />
          <Linha rotulo="Imposto de Renda" valor={r.irrf} tipo="desconto" />
          <Linha rotulo="2ª parcela (até 20/12)" valor={r.segundaParcela} />
        </Cartao>
      )}
      <Aviso>Os descontos de INSS e IR são feitos inteiramente na 2ª parcela.</Aviso>
    </Tela>
  );
}
