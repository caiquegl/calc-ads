import type { Metadata } from "next";
import { Sobre } from "@/components/Sobre";

export const metadata: Metadata = {
  title: "Sobre os cálculos e privacidade",
  description: "Fontes das tabelas de INSS, IRRF e salário mínimo usadas pelo Acerto, e como tratamos anúncios e cookies.",
  alternates: { canonical: "/sobre" },
};

export default function Pagina() {
  return <Sobre />;
}
