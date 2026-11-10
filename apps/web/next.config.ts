import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const raizMonorepo = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const config: NextConfig = {
  // O core é TypeScript puro (sem build): o Next transpila direto do workspace.
  transpilePackages: ["@acerto/core"],
  outputFileTracingRoot: raizMonorepo,
  poweredByHeader: false,
  // O core importa "./money.js" apontando para money.ts (padrão ESM do TS).
  // O Turbopack não resolve isso em pacote do workspace, por isso dev/build usam --webpack.
  webpack(cfg) {
    cfg.resolve ??= {};
    cfg.resolve.extensionAlias = { ".js": [".ts", ".tsx", ".js"] };
    return cfg;
  },
};

export default config;
