---
name: admob-anuncios
description: Regras de monetização com AdMob no app Acerto (banner, intersticial, recompensado, consentimento UMP, IDs, mediação) para não ter a conta suspensa. Use em qualquer alteração que envolva anúncios.
---

# Anúncios (AdMob)

Biblioteca: `react-native-google-mobile-ads` (plugin no `app.config.ts`). Não funciona no Expo Go.

## Regras que não se quebram

1. **Em dev, só IDs de teste** (`src/ads/ids.ts` já força via `__DEV__`). Nunca clique em anúncio real do próprio app.
2. **Nunca incentive clique** ("clique no anúncio para…") e nunca pague dinheiro/Pix por ver anúncio.
3. **Recompensado só dá benefício dentro do app** (ex.: exportar PDF, histórico ilimitado) e com opt-in claro ("Assistir anúncio para…").
4. **Intersticial só em transição natural**: depois que o resultado aparece. Nunca ao abrir a tela, durante digitação ou ao apertar "voltar". Frequência controlada pela config remota (`intersticialACadaCalculos`, `intersticialIntervaloMinSeg`).
5. **Banner não pode encostar em botão nem cobrir conteúdo.** Fica no rodapé com margem.
6. **Consentimento**: antes de `mobileAds().initialize()`, rodar o fluxo UMP (`AdsConsent.gatherConsent()`), obrigatório para EEA/UK e recomendado por LGPD. Pendente em `app/_layout.tsx` (TODO).
7. **Público**: declarar no Play Console que o app não é voltado a crianças.

## Ligando os IDs reais

1. Crie o app no AdMob e os blocos: banner adaptativo, intersticial, recompensado.
2. Defina como EAS secrets: `ADMOB_ANDROID_APP_ID`, `EXPO_PUBLIC_ADMOB_BANNER_ANDROID`, `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID`, `EXPO_PUBLIC_ADMOB_REWARDED_ANDROID`.
3. Publique `app-ads.txt` no domínio do desenvolvedor (ex.: webprumo.com.br/app-ads.txt) e informe o site na ficha da Play.

## Mediação (depois de ter tráfego)

Adicionar AppLovin, Unity Ads, Meta via mediação do AdMob aumenta o eCPM. Cada rede exige adapter nativo + config no painel. Fazer só após ~1.000 usuários ativos por dia.

## Revisão

Antes de publicar versão que mexe em anúncio, peça ao agente `revisor-anuncios`.
