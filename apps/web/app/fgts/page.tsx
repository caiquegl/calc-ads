import { Fgts } from "@/calculadoras/Fgts";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/fgts");

export default function Pagina() {
  return <Fgts />;
}
