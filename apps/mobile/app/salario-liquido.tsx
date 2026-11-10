import { calcularSalarioLiquido, type ResultadoSalarioLiquido } from "@acerto/core";
import { useState } from "react";
import { useIntersticial } from "@/ads/useIntersticial";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Linha, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { brl, parseValor } from "@/lib/format";

export default function SalarioLiquido() {
  const { tabela } = useApp();
  const { aposCalculo } = useIntersticial();
  const [bruto, setBruto] = useState("");
  const [dependentes, setDependentes] = useState("");
  const [outros, setOutros] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [r, setR] = useState<ResultadoSalarioLiquido | null>(null);

  function calcular() {
    const salarioBruto = parseValor(bruto);
    if (salarioBruto <= 0) return setErro("Informe o salário bruto.");
    setErro(null);
    setR(calcularSalarioLiquido({ salarioBruto, dependentes: Number(dependentes || 0), outrosDescontos: parseValor(outros) }, tabela));
    aposCalculo();
  }

  return (
    <Tela titulo="Salário líquido" subtitulo={`INSS e IRRF pelas tabelas de ${tabela.ano}`}>
      <Cartao>
        <CampoDinheiro rotulo="Salário bruto" valor={bruto} onChange={setBruto} />
        <CampoNumero rotulo="Dependentes" valor={dependentes} onChange={setDependentes} />
        <CampoDinheiro rotulo="Outros descontos" valor={outros} onChange={setOutros} ajuda="Vale-transporte, plano de saúde etc." />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" onPress={calcular} />
      </Cartao>
      {r && (
        <Cartao>
          <Destaque rotulo="Você recebe" valor={r.liquido} />
          <Linha rotulo="Salário bruto" valor={r.bruto} tipo="provento" />
          <Linha rotulo={`INSS (${(r.detalhes.inss.aliquotaEfetiva * 100).toFixed(2)}% efetivo)`} valor={r.inss} tipo="desconto" />
          <Linha rotulo="Imposto de Renda" valor={r.irrf} tipo="desconto" />
          {r.outrosDescontos > 0 && <Linha rotulo="Outros descontos" valor={r.outrosDescontos} tipo="desconto" />}
          <Linha rotulo="FGTS depositado pela empresa" valor={r.fgtsMensal} />
          {r.detalhes.irrf.redutor > 0 && <Aviso>Inclui a redução do IR de 2026 (Lei 15.270/2025): {brl(r.detalhes.irrf.redutor)}.</Aviso>}
        </Cartao>
      )}
      <Aviso>Simulação informativa. Valores podem variar conforme convenção coletiva e verbas variáveis.</Aviso>
    </Tela>
  );
}
