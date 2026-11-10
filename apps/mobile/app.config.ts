import type { ExpoConfig } from "expo/config";

// IDs de TESTE do Google. Troque pelos reais via variáveis de ambiente (EAS secrets) antes de publicar.
const ADMOB_ANDROID_APP_ID = process.env.ADMOB_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544~3347511713";
const ADMOB_IOS_APP_ID = process.env.ADMOB_IOS_APP_ID ?? "ca-app-pub-3940256099942544~1458002511";

const config: ExpoConfig = {
  name: "Acerto: Calculadora CLT",
  slug: "acerto-calculadora-clt",
  scheme: "acerto",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FAF6EE",
  },
  android: {
    package: "br.com.webprumo.acerto",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1F6F5C",
    },
  },
  ios: {
    bundleIdentifier: "br.com.webprumo.acerto",
    supportsTablet: false,
  },
  web: { favicon: "./assets/favicon.png" },
  plugins: [
    "expo-router",
    [
      "react-native-google-mobile-ads",
      { androidAppId: ADMOB_ANDROID_APP_ID, iosAppId: ADMOB_IOS_APP_ID },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8787",
  },
};

export default config;
