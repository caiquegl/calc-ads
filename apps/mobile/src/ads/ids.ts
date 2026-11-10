import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

/**
 * Em desenvolvimento SEMPRE usa IDs de teste (clicar em anúncio real próprio = banimento).
 * Em produção, lê os IDs reais das variáveis EXPO_PUBLIC_ADMOB_*.
 */
function id(teste: string, android?: string, ios?: string): string {
  if (__DEV__) return teste;
  const real = Platform.OS === "android" ? android : ios;
  return real || teste;
}

export const AD_UNITS = {
  banner: id(TestIds.ADAPTIVE_BANNER, process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID, process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS),
  intersticial: id(TestIds.INTERSTITIAL, process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID, process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS),
  recompensado: id(TestIds.REWARDED, process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID, process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS),
};
