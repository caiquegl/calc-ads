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

## Web (apps/web, Google AdSense)

O AdMob não serve web; no site usamos **AdSense** (`apps/web/src/ads/`). As mesmas regras valem, adaptadas:

1. **Sem ID real em dev.** `ANUNCIOS_REAIS` só é verdadeiro em build de produção com `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…`. Fora disso aparece um bloco "Anúncio de teste" e o script do Google nem carrega. Para homologar com anúncio de verdade sem gerar clique válido: `NEXT_PUBLIC_ADSENSE_TESTE=1` (`data-adtest="on"`).
2. **Blocos**: `rodape` (banner no rodapé do layout, fora do conteúdo) e `resultado` (`<AdResultado />`, só dentro de `<Resultado>` e depois do cartão do resultado). Nunca dentro do `<Formulario>` nem colado no botão Calcular.
3. **Todo bloco tem o rótulo "Publicidade"** (componente `AdSlot`). Não mude para algo que pareça conteúdo ou navegação.
4. **Intersticial na web** = "vinheta" do Auto ads, ligada no painel (AdSense > Anúncios > Por site). Não há API para disparar pelo código; a frequência quem controla é o Google. Não ligue anúncio âncora/sobreposto que cubra os botões em celular.
5. **Consentimento**: ative a mensagem GDPR/LGPD em AdSense > Privacidade e mensagens (CMP certificada do Google, servida pelo mesmo script). A página `/sobre` explica cookies de anúncio, exigência da política do AdSense.
6. **ads.txt**: a rota `/ads.txt` é gerada a partir de `NEXT_PUBLIC_ADSENSE_CLIENT` (404 enquanto não houver ID). Confira em produção depois do deploy.
7. Ligando: aprove o site no AdSense, crie dois blocos de display responsivos e defina `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_RODAPE` e `NEXT_PUBLIC_ADSENSE_SLOT_RESULTADO` no host **antes do build** (`NEXT_PUBLIC_*` é embutido no build).

## Revisão

Antes de publicar versão que mexe em anúncio, peça ao agente `revisor-anuncios`.
