import { TABELAS } from "@acerto/core";
import { CONFIG_PADRAO } from "../config-padrao.js";
import { criarDb } from "./client.js";
import { appConfig, tabelasFiscais } from "./schema.js";

const db = criarDb();
if (!db) throw new Error("Defina DATABASE_URL no .env");

for (const tabela of Object.values(TABELAS)) {
  await db.insert(tabelasFiscais).values({ ano: tabela.ano, versao: 1, payload: tabela }).onConflictDoNothing();
  console.log(`tabela ${tabela.ano} ok`);
}
for (const [chave, valor] of Object.entries(CONFIG_PADRAO)) {
  // `valor` é NOT NULL; chave nula fica de fora e /v1/config usa o padrão.
  if (valor === null) continue;
  await db.insert(appConfig).values({ chave, valor }).onConflictDoNothing();
}
console.log("seed concluído");
