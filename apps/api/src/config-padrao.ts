/** Config remota padrão. O app usa estes valores se a API estiver fora. */
export const CONFIG_PADRAO = {
  anuncios: {
    habilitado: true,
    banner: true,
    /** Intersticial no máximo a cada N cálculos concluídos. */
    intersticialACadaCalculos: 3,
    /** Intervalo mínimo entre intersticiais, em segundos. */
    intersticialIntervaloMinSeg: 120,
    appOpen: false,
  },
  versaoMinima: "0.1.0",
  aviso: null as null | { titulo: string; mensagem: string },
};

export type AppConfig = typeof CONFIG_PADRAO;
