import { SalarioLiquido } from "@/calculadoras/SalarioLiquido";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/salario-liquido");

export default function Pagina() {
  return <SalarioLiquido />;
}
