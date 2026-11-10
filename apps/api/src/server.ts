import { serve } from "@hono/node-server";
import { criarApp } from "./app.js";
import { criarDb } from "./db/client.js";

const db = criarDb();
const app = criarApp(db);
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API Acerto em http://localhost:${port} (banco: ${db ? "Neon" : "desligado, usando tabelas embarcadas"})`);
});
