import { useCallback, useEffect, useRef } from "react";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";
import { useApp } from "@/lib/contexto";
import { AD_UNITS } from "./ids";

let calculosDesdeUltimo = 0;
let ultimoExibido = 0;

/**
 * Intersticial com limite de frequência (config remota).
 * Chame `aposCalculo()` DEPOIS de mostrar o resultado — nunca antes, nunca no meio da digitação.
 */
export function useIntersticial() {
  const { config } = useApp();
  const anuncio = useRef<InterstitialAd | null>(null);
  const carregado = useRef(false);

  useEffect(() => {
    if (!config.anuncios.habilitado) return;
    const ad = InterstitialAd.createForAdRequest(AD_UNITS.intersticial);
    anuncio.current = ad;
    const offLoad = ad.addAdEventListener(AdEventType.LOADED, () => (carregado.current = true));
    const offClose = ad.addAdEventListener(AdEventType.CLOSED, () => {
      carregado.current = false;
      ad.load();
    });
    ad.load();
    return () => {
      offLoad();
      offClose();
    };
  }, [config.anuncios.habilitado]);

  const aposCalculo = useCallback(() => {
    const { habilitado, intersticialACadaCalculos, intersticialIntervaloMinSeg } = config.anuncios;
    if (!habilitado) return;
    calculosDesdeUltimo += 1;
    const intervaloOk = Date.now() - ultimoExibido > intersticialIntervaloMinSeg * 1000;
    if (calculosDesdeUltimo >= intersticialACadaCalculos && intervaloOk && carregado.current) {
      calculosDesdeUltimo = 0;
      ultimoExibido = Date.now();
      // pequeno atraso para o usuário ver o resultado antes
      setTimeout(() => anuncio.current?.show(), 600);
    }
  }, [config.anuncios]);

  return { aposCalculo };
}
