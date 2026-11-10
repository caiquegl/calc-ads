import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "@/ads/AdBanner";
import { useApp } from "@/lib/contexto";
import { cores, espaco, raio, texto } from "@/theme";

const CALCULADORAS: { href: Href; titulo: string; descricao: string; simbolo: string }[] = [
  { href: "/rescisao", titulo: "Rescisão", descricao: "Quanto recebo ao sair da empresa", simbolo: "⇥" },
  { href: "/salario-liquido", titulo: "Salário líquido", descricao: "INSS e IR descontados no holerite", simbolo: "=" },
  { href: "/ferias", titulo: "Férias", descricao: "Com 1/3 e venda de 10 dias", simbolo: "☼" },
  { href: "/decimo-terceiro", titulo: "13º salário", descricao: "1ª e 2ª parcela", simbolo: "13" },
  { href: "/hora-extra", titulo: "Hora extra", descricao: "50%, 100% e reflexo no DSR", simbolo: "+h" },
  { href: "/fgts", titulo: "FGTS", descricao: "Saldo estimado e multa de 40%", simbolo: "%" },
];

export default function Inicio() {
  const { tabela } = useApp();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.creme }}>
      <ScrollView contentContainerStyle={{ padding: espaco.md, gap: espaco.md }}>
        <View style={{ gap: 6, paddingVertical: espaco.md }}>
          <Text style={[texto.rotulo, { color: cores.verde }]}>Acerto · tabelas {tabela.ano}</Text>
          <Text style={[texto.titulo, { fontSize: 32 }]}>Suas contas trabalhistas, sem susto.</Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {CALCULADORAS.map((c) => (
            <Link key={String(c.href)} href={c.href} asChild>
              <Pressable style={({ pressed }) => ({ width: "47.5%", backgroundColor: pressed ? cores.verdeClaro : cores.branco, borderRadius: raio.lg, padding: espaco.md, gap: 10, borderWidth: 1, borderColor: cores.borda, minHeight: 150 })}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: cores.moeda, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: cores.tinta }}>{c.simbolo}</Text>
                </View>
                <Text style={{ fontSize: 17, fontWeight: "800", color: cores.tinta }}>{c.titulo}</Text>
                <Text style={{ fontSize: 13, color: cores.cinza }}>{c.descricao}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
        <Link href="/sobre" style={{ textAlign: "center", color: cores.cinza, paddingVertical: espaco.md }}>
          Sobre os cálculos e privacidade
        </Link>
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
