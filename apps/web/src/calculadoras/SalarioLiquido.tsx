"use client";

import { calcularSalarioLiquido, type ResultadoSalarioLiquido } from "@acerto/core";
import { useState } from "react";
import { AdResultado } from "@/ads/Anuncios";
import { Aviso, Botao, CampoDinheiro, CampoNumero, Cartao, Destaque, Erro, Formulario, Linha, Resultado, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { parseValor } from "@/lib/format";

export function SalarioLiquido() {
  const { tabela } = useApp();
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
  }

  return (
    <Tela titulo="Salário líquido" subtitulo={`INSS e IRRF pelas tabelas de ${tabela.ano}`}>
      <Formulario onCalcular={calcular}>
        <CampoDinheiro rotulo="Salário bruto" valor={bruto} onChange={setBruto} />
        <CampoNumero rotulo="Dependentes" valor={dependentes} onChange={setDependentes} />
        <CampoDinheiro rotulo="Outros descontos" valor={outros} onChange={setOutros} ajuda="Vale-transporte, plano de saúde etc." />
        <Erro mensagem={erro} />
        <Botao titulo="Calcular" />
      </Formulario>
      {r && (
        <Resultado de={r}>
          <Cartao>
            <Destaque rotulo="Você recebe" valor={r.liquido} />
            <Linha rotulo="Salário bruto" valor={r.bruto} tipo="provento" />
            <Linha rotulo={`INSS (${(r.detalhes.inss.aliquotaEfetiva * 100).toFixed(2).replace(".", ",")}% efetivo)`} valor={r.inss} tipo="desconto" />
            <Linha rotulo="Imposto de Renda" valor={r.irrf} tipo="desconto" />
            {r.outrosDescontos > 0 && <Linha rotulo="Outros descontos" valor={r.outrosDescontos} tipo="desconto" />}
            <Linha rotulo="FGTS depositado pela empresa" valor={r.fgtsMensal} />
            {r.detalhes.irrf.redutor > 0 && <Aviso>Inclui a redução do IR de 2026 (Lei 15.270/2025): {r.detalhes.irrf.redutor.toFixed(2).replace(".", ",")}.</Aviso>}
          </Cartao>
          <AdResultado />
        </Resultado>
      )}
      <Aviso>Simulação informativa. Valores podem variar conforme convenção coletiva e verbas variáveis.</Aviso>
    </Tela>
  );
}
