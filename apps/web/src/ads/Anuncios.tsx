"use client";

import Script from "next/script";
import { useApp } from "@/lib/contexto";
import { AdSlot } from "./AdSlot";
import { ADSENSE_CLIENT, ANUNCIOS_REAIS, SLOTS } from "./config";

/**
 * Script do AdSense, carregado uma vez no layout e só com anúncios reais.
 * Consentimento (GDPR/LGPD): ative a mensagem do Google em AdSense > Privacidade e mensagens;
 * ela é servida por este mesmo script antes de qualquer anúncio personalizado.
 */
export function ScriptAdSense() {
  const { config } = useApp();
  if (!ANUNCIOS_REAIS || !config.anuncios.habilitado) return null;
  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

/** Banner do rodapé: fora do conteúdo, nunca encostado em botão. */
export function AdBanner() {
  const { config } = useApp();
  if (!config.anuncios.habilitado || !config.anuncios.banner) return null;
  return <AdSlot slot={SLOTS.rodape} nome="rodapé" />;
}

/**
 * Bloco exibido abaixo do resultado — o equivalente web do intersticial "depois do resultado".
 * Renderize só dentro de `{resultado && ...}`, depois do cartão do resultado (nunca colado no botão Calcular).
 */
export function AdResultado() {
  const { config } = useApp();
  if (!config.anuncios.habilitado) return null;
  return <AdSlot slot={SLOTS.resultado} nome="resultado" />;
}
