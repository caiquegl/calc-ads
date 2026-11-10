import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// `neon deploy` / `neon env pull` gravam DATABASE_URL e DATABASE_URL_UNPOOLED no .env.local da raiz.
for (const arquivo of ["../../.env.local", ".env"]) {
  if (existsSync(arquivo)) process.loadEnvFile(arquivo);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migration usa conexão direta (sem -pooler); o pooler não segura sessão.
  dbCredentials: { url: (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL)! },
});
