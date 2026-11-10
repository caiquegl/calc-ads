import { HoraExtra } from "@/calculadoras/HoraExtra";
import { metadataCalculadora } from "@/lib/metadata";

export const metadata = metadataCalculadora("/hora-extra");

export default function Pagina() {
  return <HoraExtra />;
}
