import type { MetadataRoute } from "next";
import { CALCULADORAS } from "@/lib/calculadoras";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...CALCULADORAS.map((c) => c.rota), "/sobre"].map((rota) => ({ url: `${SITE}${rota}` }));
}
