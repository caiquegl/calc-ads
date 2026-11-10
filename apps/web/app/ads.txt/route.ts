import { ADSENSE_CLIENT } from "@/ads/config";

/** /ads.txt exigido pelo AdSense: autoriza só a nossa conta a vender os espaços do site. */
export const dynamic = "force-static";

export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  if (!/^pub-\d+$/.test(pub)) return new Response("# AdSense ainda não configurado\n", { status: 404, headers: { "content-type": "text/plain" } });
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain" } });
}
