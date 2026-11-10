/** Tokens da marca Acerto. Fonte única de cores/tipografia — ver skill arte-marca. */
export const cores = {
  verde: "#1F6F5C",
  verdeEscuro: "#14493D",
  verdeClaro: "#DCEDE7",
  moeda: "#F2B33D",
  creme: "#FAF6EE",
  tinta: "#1B2420",
  cinza: "#6B7570",
  borda: "#E4DED2",
  branco: "#FFFFFF",
  erro: "#B3412E",
  desconto: "#B3412E",
  provento: "#1F6F5C",
} as const;

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const raio = { sm: 8, md: 14, lg: 22 } as const;

export const texto = {
  titulo: { fontSize: 26, fontWeight: "800" as const, color: cores.tinta, letterSpacing: -0.5 },
  subtitulo: { fontSize: 15, color: cores.cinza },
  rotulo: { fontSize: 13, fontWeight: "600" as const, color: cores.tinta, textTransform: "uppercase" as const, letterSpacing: 0.6 },
  corpo: { fontSize: 16, color: cores.tinta },
  valorGrande: { fontSize: 34, fontWeight: "800" as const, color: cores.verdeEscuro, letterSpacing: -1 },
};
