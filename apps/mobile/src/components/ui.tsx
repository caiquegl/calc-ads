import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdBanner } from "@/ads/AdBanner";
import { brl, mascaraData, mascaraDinheiro } from "@/lib/format";
import { cores, espaco, raio, texto } from "@/theme";

export function Tela({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cores.creme }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: espaco.md, paddingBottom: espaco.xl, gap: espaco.md }} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 4 }}>
          <Text style={texto.titulo}>{titulo}</Text>
          {subtitulo ? <Text style={texto.subtitulo}>{subtitulo}</Text> : null}
        </View>
        {children}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}

export function Cartao({ children }: { children: ReactNode }) {
  return (
    <View style={{ backgroundColor: cores.branco, borderRadius: raio.md, padding: espaco.md, gap: espaco.md, borderWidth: 1, borderColor: cores.borda }}>
      {children}
    </View>
  );
}

function Campo({ rotulo, ajuda, ...props }: TextInputProps & { rotulo: string; ajuda?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={texto.rotulo}>{rotulo}</Text>
      <TextInput
        placeholderTextColor={cores.cinza}
        style={{ borderWidth: 1, borderColor: cores.borda, borderRadius: raio.sm, paddingHorizontal: 14, paddingVertical: 12, fontSize: 18, color: cores.tinta, backgroundColor: cores.creme }}
        {...props}
      />
      {ajuda ? <Text style={{ fontSize: 12, color: cores.cinza }}>{ajuda}</Text> : null}
    </View>
  );
}

export function CampoDinheiro({ rotulo, valor, onChange, ajuda }: { rotulo: string; valor: string; onChange: (v: string) => void; ajuda?: string }) {
  return <Campo rotulo={rotulo} ajuda={ajuda} value={valor ? `R$ ${valor}` : ""} placeholder="R$ 0,00" keyboardType="number-pad" onChangeText={(t) => onChange(mascaraDinheiro(t))} />;
}

export function CampoNumero({ rotulo, valor, onChange, ajuda }: { rotulo: string; valor: string; onChange: (v: string) => void; ajuda?: string }) {
  return <Campo rotulo={rotulo} ajuda={ajuda} value={valor} placeholder="0" keyboardType="number-pad" onChangeText={(t) => onChange(t.replace(/\D/g, ""))} />;
}

export function CampoData({ rotulo, valor, onChange }: { rotulo: string; valor: string; onChange: (v: string) => void }) {
  return <Campo rotulo={rotulo} value={valor} placeholder="DD/MM/AAAA" keyboardType="number-pad" onChangeText={(t) => onChange(mascaraData(t))} />;
}

export function Opcoes<T extends string>({ rotulo, opcoes, valor, onChange }: { rotulo: string; opcoes: { valor: T; rotulo: string }[]; valor: T; onChange: (v: T) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={texto.rotulo}>{rotulo}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {opcoes.map((o) => {
          const ativo = o.valor === valor;
          return (
            <Pressable key={o.valor} onPress={() => onChange(o.valor)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: ativo ? cores.verde : cores.borda, backgroundColor: ativo ? cores.verdeClaro : cores.branco }}>
              <Text style={{ color: ativo ? cores.verdeEscuro : cores.tinta, fontWeight: ativo ? "700" : "500" }}>{o.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Botao({ titulo, onPress, desabilitado }: { titulo: string; onPress: () => void; desabilitado?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={desabilitado} style={({ pressed }) => ({ backgroundColor: desabilitado ? cores.borda : pressed ? cores.verdeEscuro : cores.verde, borderRadius: raio.md, paddingVertical: 16, alignItems: "center" })}>
      <Text style={{ color: cores.branco, fontSize: 17, fontWeight: "700" }}>{titulo}</Text>
    </Pressable>
  );
}

export function Destaque({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <View style={{ backgroundColor: cores.verdeClaro, borderRadius: raio.md, padding: espaco.md, gap: 4 }}>
      <Text style={[texto.rotulo, { color: cores.verdeEscuro }]}>{rotulo}</Text>
      <Text style={texto.valorGrande}>{brl(valor)}</Text>
    </View>
  );
}

export function Linha({ rotulo, valor, tipo }: { rotulo: string; valor: number; tipo?: "provento" | "desconto" }) {
  const cor = tipo === "desconto" ? cores.desconto : tipo === "provento" ? cores.provento : cores.tinta;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: cores.borda }}>
      <Text style={{ flex: 1, color: cores.tinta, fontSize: 15 }}>{rotulo}</Text>
      <Text style={{ color: cor, fontSize: 15, fontWeight: "700" }}>{tipo === "desconto" ? "− " : ""}{brl(valor)}</Text>
    </View>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: 12, color: cores.cinza, lineHeight: 18 }}>{children}</Text>;
}

export function Erro({ mensagem }: { mensagem: string | null }) {
  return mensagem ? <Text style={{ color: cores.erro, fontWeight: "600" }}>{mensagem}</Text> : null;
}
