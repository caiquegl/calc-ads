import { Ferias } from "@/calculadoras/Ferias";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/ferias");

export default function Pagina() {
  return <Ferias />;
}
