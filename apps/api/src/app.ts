import { TABELAS, type TabelaAnual } from "@acerto/core";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { CONFIG_PADRAO } from "./config-padrao.js";
import type { Db } from "./db/client.js";
import { appConfig, tabelasFiscais } from "./db/schema.js";

export function criarApp(db: Db | null, adminToken = process.env.ADMIN_TOKEN) {
  const app = new Hono();
  app.use("*", logger());
  app.use("*", cors());

  app.get("/health", (c) => c.json({ ok: true, banco: Boolean(db) }));

  /** Tabela do ano. Banco (versão ativa mais recente) → fallback embarcado. */
  app.get("/v1/tabelas/:ano", async (c) => {
    const ano = Number(c.req.param("ano"));
    if (!Number.isInteger(ano)) return c.json({ erro: "ano inválido" }, 400);

    if (db) {
      const [linha] = await db
        .select()
        .from(tabelasFiscais)
        .where(and(eq(tabelasFiscais.ano, ano), eq(tabelasFiscais.ativa, true)))
        .orderBy(desc(tabelasFiscais.versao))
        .limit(1);
      if (linha) return c.json({ origem: "banco", versao: linha.versao, tabela: serializar(linha.payload) });
    }
    const local = TABELAS[ano];
    if (!local) return c.json({ erro: "tabela não encontrada" }, 404);
    c.header("Cache-Control", "public, max-age=3600");
    return c.json({ origem: "embarcada", versao: 0, tabela: serializar(local) });
  });

  app.get("/v1/config", async (c) => {
    if (!db) return c.json(CONFIG_PADRAO);
    const linhas = await db.select().from(appConfig);
    const remoto = Object.fromEntries(linhas.map((l) => [l.chave, l.valor]));
    return c.json({ ...CONFIG_PADRAO, ...remoto });
  });

  /** Publica nova versão de tabela (uso administrativo). */
  app.post("/admin/tabelas", async (c) => {
    if (!db) return c.json({ erro: "banco não configurado" }, 503);
    if (!adminToken || c.req.header("authorization") !== `Bearer ${adminToken}`) return c.json({ erro: "não autorizado" }, 401);
    const tabela = (await c.req.json()) as TabelaAnual;
    const [ultima] = await db
      .select({ versao: tabelasFiscais.versao })
      .from(tabelasFiscais)
      .where(eq(tabelasFiscais.ano, tabela.ano))
      .orderBy(desc(tabelasFiscais.versao))
      .limit(1);
    const versao = (ultima?.versao ?? 0) + 1;
    await db.insert(tabelasFiscais).values({ ano: tabela.ano, versao, payload: tabela });
    return c.json({ ok: true, ano: tabela.ano, versao }, 201);
  });

  return app;
}

/** JSON não representa Infinity: a última faixa do IRRF vira null. */
function serializar(tabela: TabelaAnual) {
  return {
    ...tabela,
    irrf: { ...tabela.irrf, faixas: tabela.irrf.faixas.map((f) => ({ ...f, ate: Number.isFinite(f.ate) ? f.ate : null })) },
  };
}
