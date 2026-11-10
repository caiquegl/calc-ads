import { Rescisao } from "@/calculadoras/Rescisao";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/rescisao");

export default function Pagina() {
  return <Rescisao />;
}
