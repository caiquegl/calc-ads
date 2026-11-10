import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { TabelaAnual } from "@acerto/core";

/** Tabelas fiscais versionadas. Permite corrigir/atualizar sem publicar nova versão do app. */
export const tabelasFiscais = pgTable(
  "tabelas_fiscais",
  {
    id: serial("id").primaryKey(),
    ano: integer("ano").notNull(),
    versao: integer("versao").notNull().default(1),
    ativa: boolean("ativa").notNull().default(true),
    payload: jsonb("payload").$type<TabelaAnual>().notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tabelas_fiscais_ano_versao").on(t.ano, t.versao)],
);

/** Configuração remota do app (anúncios, versão mínima, avisos). */
export const appConfig = pgTable("app_config", {
  chave: text("chave").primaryKey(),
  valor: jsonb("valor").notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
});
