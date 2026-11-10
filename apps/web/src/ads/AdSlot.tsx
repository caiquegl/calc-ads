"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_TESTE, ANUNCIOS_REAIS } from "./config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Um bloco de display do AdSense, sempre identificado como "Publicidade".
 * Sem ID real (dev/preview) mostra um retângulo de teste do mesmo tamanho.
 */
export function AdSlot({ slot, nome }: { slot: string; nome: string }) {
  const ref = useRef<HTMLModElement>(null);
  const real = ANUNCIOS_REAIS && slot !== "";

  useEffect(() => {
    if (!real || ref.current?.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      /* bloqueador de anúncio ou bloco já preenchido */
    }
  }, [real]);

  // Produção sem slot (ex.: site em análise no AdSense): não mostra nada, nem o bloco de teste.
  if (!real && process.env.NODE_ENV === "production" && ADSENSE_CLIENT !== "") return null;

  return (
    <aside className="anuncio" aria-label="Publicidade">
      <span className="anuncio-rotulo">Publicidade</span>
      {real ? (
        <ins
          ref={ref}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(ADSENSE_TESTE ? { "data-adtest": "on" } : {})}
        />
      ) : (
        <div className="anuncio-teste" data-anuncio={nome}>
          Anúncio de teste · {nome}
        </div>
      )}
    </aside>
  );
}
