import { Text } from "react-native";
import { Cartao, Tela } from "@/components/ui";
import { useApp } from "@/lib/contexto";
import { cores } from "@/theme";

export default function Sobre() {
  const { tabela } = useApp();
  return (
    <Tela titulo="Sobre" subtitulo="Como calculamos">
      <Cartao>
        <Text style={{ color: cores.tinta, lineHeight: 22 }}>
          Os cálculos são feitos no seu celular, sem enviar seus dados. Usamos as tabelas oficiais de {tabela.ano}: salário
          mínimo de R$ {tabela.salarioMinimo.toFixed(2).replace(".", ",")}, INSS progressivo e Imposto de Renda com a redução
          da Lei 15.270/2025.
        </Text>
        {tabela.fontes.map((f) => (
          <Text key={f} style={{ color: cores.cinza, fontSize: 13 }}>• {f}</Text>
        ))}
        <Text style={{ color: cores.cinza, fontSize: 13, lineHeight: 20 }}>
          Os resultados são simulações informativas e não substituem o cálculo do empregador, do sindicato ou orientação de um
          advogado. Este app exibe anúncios para se manter gratuito.
        </Text>
      </Cartao>
    </Tela>
  );
}
