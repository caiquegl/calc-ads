import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useApp } from "@/lib/contexto";
import { cores } from "@/theme";
import { AD_UNITS } from "./ids";

/** Banner fixo no rodapé. Nunca colocar colado em botões (cliques acidentais violam a política). */
export function AdBanner() {
  const { config } = useApp();
  if (!config.anuncios.habilitado || !config.anuncios.banner) return null;
  return (
    <View style={{ alignItems: "center", backgroundColor: cores.creme, paddingTop: 8, borderTopWidth: 1, borderTopColor: cores.borda }}>
      <BannerAd unitId={AD_UNITS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
