import { calcularFerias, type ResultadoFerias } from "@acerto/core";
import { useState } from "react";
import { useIntersticial } from "@/ads/useIntersticial";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Linha, Opcoes, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { parseValor } from "@/lib/format";

export default function Ferias() {
  const { tabela } = useApp();
  const { aposCalculo } = useIntersticial();
  const [salario, setSalario] = useState("");
  const [vender, setVender] = useState<"nao" | "sim">("nao");
  const [dependentes, setDependentes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoFerias | null>(null);

  function calcular() {
    const s = parseValor(salario);
    if (s <= 0) return setErro("Informe o salário.");
    setErro(null);
    setR(calcularFerias({ salario: s, diasAbono: vender === "sim" ? 10 : 0, dependentes: Number(dependentes || 0) }, tabela));
    aposCalculo();
  }

  return (
    <Tela titulo="Férias" subtitulo="Valor das férias com 1/3 constitucional">
      <Cartao>
        <CampoDinheiro rotulo="Salário bruto" valor={salario} onChange={setSalario} ajuda="Inclua a média de horas extras e comissões, se houver." />
        <Opcoes rotulo="Vender 10 dias (abono)" opcoes={[{ valor: "nao", rotulo: "Não" }, { valor: "sim", rotulo: "Sim" }]} valor={vender} onChange={setVender} />
        <CampoNumero rotulo="Dependentes" valor={dependentes} onChange={setDependentes} />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" onPress={calcular} />
      </Cartao>
      {r && (
        <Cartao>
          <Destaque rotulo="Você recebe" valor={r.liquido} />
          <Linha rotulo="Férias" valor={r.ferias} tipo="provento" />
          <Linha rotulo="1/3 de férias" valor={r.tercoFerias} tipo="provento" />
          {r.abono > 0 && <Linha rotulo="Abono pecuniário (10 dias)" valor={r.abono} tipo="provento" />}
          {r.tercoAbono > 0 && <Linha rotulo="1/3 do abono" valor={r.tercoAbono} tipo="provento" />}
          <Linha rotulo="INSS" valor={r.inss} tipo="desconto" />
          <Linha rotulo="Imposto de Renda" valor={r.irrf} tipo="desconto" />
        </Cartao>
      )}
      <Aviso>O abono pecuniário e seu 1/3 não têm desconto de INSS nem de IR.</Aviso>
    </Tela>
  );
}
