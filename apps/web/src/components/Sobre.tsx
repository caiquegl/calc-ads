"use client";

import { brl } from "@/lib/format";
import { useApp } from "@/lib/contexto";
import { Cartao, Tela } from "./ui";

export function Sobre() {
  const { tabela } = useApp();
  return (
    <Tela titulo="Sobre" subtitulo="Como calculamos e privacidade">
      <Cartao>
        <div className="texto-corrido" style={{ display: "grid", gap: 12 }}>
          <h2>Como calculamos</h2>
          <p>
            Os cálculos são feitos no seu navegador, sem enviar o que você digita. Usamos as tabelas oficiais de {tabela.ano}:
            salário mínimo de {brl(tabela.salarioMinimo)}, INSS progressivo e Imposto de Renda com a redução da Lei 15.270/2025.
          </p>
          <ul>
            {tabela.fontes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="aviso">
            Os resultados são simulações informativas e não substituem o cálculo do empregador, do sindicato ou orientação de um
            advogado.
          </p>
        </div>
      </Cartao>
      <Cartao>
        <div className="texto-corrido" style={{ display: "grid", gap: 12 }}>
          <h2>Anúncios e cookies</h2>
          <p>
            O Acerto é gratuito e se mantém com anúncios do Google AdSense. O Google e seus parceiros usam cookies para exibir
            anúncios com base nas suas visitas a este e a outros sites. Você pode desativar a publicidade personalizada nas{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">configurações de anúncios do Google</a>.
            Saiba mais em{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              como o Google usa dados de sites parceiros
            </a>
            .
          </p>
          <p>
            Não pedimos cadastro e não guardamos dados pessoais. O site salva no seu navegador apenas a tabela fiscal e a
            configuração mais recentes, para funcionar mesmo sem internet.
          </p>
        </div>
      </Cartao>
    </Tela>
  );
}
