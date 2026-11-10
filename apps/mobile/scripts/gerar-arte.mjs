// Gera toda a arte do app a partir de SVG (marca própria "Acerto").
// Uso: pnpm --filter @acerto/mobile arte
// Edite as cores/formas aqui; nunca use imagens de terceiros. Ver .claude/skills/arte-marca.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(raiz, "assets");
const loja = join(raiz, "store");

const C = { verde: "#1F6F5C", verdeEscuro: "#14493D", moeda: "#F2B33D", moedaEscura: "#C98C1C", creme: "#FAF6EE", tinta: "#1B2420", branco: "#FFFFFF" };

/** Símbolo: recibo com linhas + moeda com "=" (o acerto de contas). Desenhado em caixa 1024. */
function simbolo({ escala = 1, dx = 0, dy = 0 } = {}) {
  return `
  <g transform="translate(${dx} ${dy}) scale(${escala})">
    <g transform="rotate(-8 430 470)">
      <path d="M250 200 h360 a30 30 0 0 1 30 30 v470 l-45 -30 -45 30 -45 -30 -45 30 -45 -30 -45 30 -45 -30 -45 30 v-470 a30 30 0 0 1 30 -30z" fill="${C.branco}"/>
      <rect x="300" y="290" width="200" height="34" rx="17" fill="${C.verde}" opacity="0.9"/>
      <rect x="300" y="370" width="260" height="26" rx="13" fill="${C.tinta}" opacity="0.18"/>
      <rect x="300" y="430" width="220" height="26" rx="13" fill="${C.tinta}" opacity="0.18"/>
      <rect x="300" y="490" width="160" height="26" rx="13" fill="${C.tinta}" opacity="0.18"/>
    </g>
    <circle cx="640" cy="650" r="200" fill="${C.moedaEscura}"/>
    <circle cx="640" cy="635" r="200" fill="${C.moeda}"/>
    <circle cx="640" cy="635" r="160" fill="none" stroke="${C.moedaEscura}" stroke-width="10" opacity="0.5"/>
    <rect x="560" y="575" width="160" height="38" rx="19" fill="${C.tinta}"/>
    <rect x="560" y="655" width="160" height="38" rx="19" fill="${C.tinta}"/>
  </g>`;
}

const svg = (w, h, corpo) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`);

const icone = svg(1024, 1024, `
  <rect width="1024" height="1024" fill="${C.verde}"/>
  <circle cx="880" cy="140" r="260" fill="${C.verdeEscuro}" opacity="0.35"/>
  ${simbolo({ escala: 0.92, dx: -20, dy: 10 })}`);

// Android adaptativo: conteúdo dentro da zona segura (~66% central), fundo transparente.
const adaptativo = svg(1024, 1024, simbolo({ escala: 0.62, dx: 175, dy: 170 }));

const splash = svg(1024, 1024, simbolo({ escala: 0.8, dx: 90, dy: 80 }));

const favicon = icone;

const destaqueLoja = svg(1024, 500, `
  <rect width="1024" height="500" fill="${C.verde}"/>
  <circle cx="900" cy="60" r="220" fill="${C.verdeEscuro}" opacity="0.4"/>
  ${simbolo({ escala: 0.5, dx: 540, dy: 30 })}
  <text x="70" y="215" font-family="Georgia, 'DejaVu Serif', serif" font-size="88" font-weight="700" fill="${C.creme}">Acerto</text>
  <text x="72" y="285" font-family="'DejaVu Sans', Arial, sans-serif" font-size="34" fill="${C.creme}" opacity="0.9">Calculadora trabalhista CLT</text>
  <text x="72" y="340" font-family="'DejaVu Sans', Arial, sans-serif" font-size="26" fill="${C.moeda}">Rescisão · Férias · 13º · Salário líquido</text>`);

async function salvar(buffer, destino, w, h) {
  await mkdir(dirname(destino), { recursive: true });
  await sharp(buffer).resize(w, h).png().toFile(destino);
  console.log("✓", destino.replace(raiz + "/", ""));
}

await salvar(icone, join(assets, "icon.png"), 1024, 1024);
await salvar(adaptativo, join(assets, "adaptive-icon.png"), 1024, 1024);
await salvar(splash, join(assets, "splash-icon.png"), 1024, 1024);
await salvar(favicon, join(assets, "favicon.png"), 48, 48);
await salvar(icone, join(loja, "icone-512.png"), 512, 512);
await salvar(destaqueLoja, join(loja, "destaque-1024x500.png"), 1024, 500);
await writeFile(join(assets, "icon.svg"), icone);
