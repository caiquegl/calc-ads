/**
 * Google AdSense (o AdMob não serve web). Regras em .claude/skills/admob-anuncios/SKILL.md, seção "Web".
 *
 * Anúncio real só em build de produção E com o publisher ID definido.
 * Em `next dev` aparece um bloco de teste e o script do AdSense nem é carregado:
 * nunca clique em anúncio real do próprio site.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

export const SLOTS = {
  /** Display responsivo no rodapé, longe de botões. */
  rodape: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RODAPE ?? "",
  /** Display responsivo abaixo do resultado (só aparece depois do cálculo). */
  resultado: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULTADO ?? "",
};

export const ANUNCIOS_REAIS = process.env.NODE_ENV === "production" && /^ca-pub-\d+$/.test(ADSENSE_CLIENT);

/** Homologação: pede anúncios com data-adtest="on" (não gera receita nem conta clique). */
export const ADSENSE_TESTE = process.env.NEXT_PUBLIC_ADSENSE_TESTE === "1";
