import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { AppProvider } from "@/lib/contexto";
import { cores } from "@/theme";

export default function RootLayout() {
  useEffect(() => {
    // TODO: exibir formulário de consentimento (UMP) antes de inicializar — ver skill admob-anuncios.
    mobileAds().initialize();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.creme },
          headerShadowVisible: false,
          headerTintColor: cores.verdeEscuro,
          headerTitle: "",
          contentStyle: { backgroundColor: cores.creme },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}
