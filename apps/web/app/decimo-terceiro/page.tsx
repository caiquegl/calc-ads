import { DecimoTerceiro } from "@/calculadoras/DecimoTerceiro";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/decimo-terceiro");

export default function Pagina() {
  return <DecimoTerceiro />;
}
