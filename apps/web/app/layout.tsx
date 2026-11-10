import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdBanner, ScriptAdSense } from "@/ads/Anuncios";
import { ADSENSE_CLIENT } from "@/ads/config";
import { AppProvider } from "@/lib/contexto";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Acerto: Calculadora CLT", template: "%s | Acerto" },
  description: "Calcule rescisão, salário líquido, férias, 13º, hora extra e FGTS pelas regras da CLT. Grátis e sem cadastro.",
  applicationName: "Acerto",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Acerto: Calculadora CLT" },
  // Verificação do site no AdSense (meta tag), só quando o publisher ID estiver definido.
  ...(ADSENSE_CLIENT ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = { themeColor: "#1F6F5C" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          <ScriptAdSense />
          <header className="topo">
            <div className="topo-conteudo">
              <Link href="/" className="marca">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.svg" alt="" width={32} height={32} />
                Acerto
              </Link>
              <nav>
                <Link href="/sobre">Sobre e privacidade</Link>
              </nav>
            </div>
          </header>
          <main className="principal">{children}</main>
          <footer className="rodape">
            <div className="rodape-conteudo">
              <AdBanner />
              <p>
                Simulação informativa. Não substitui o cálculo do empregador, do sindicato nem orientação de um advogado. Os
                cálculos são feitos no seu navegador; não guardamos o que você digita.
              </p>
              <p>© {new Date().getFullYear()} Web Prumo</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
