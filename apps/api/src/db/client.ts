import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

export function criarDb(url = process.env.DATABASE_URL) {
  if (!url) return null; // API funciona sem banco, usando as tabelas embarcadas do core
  return drizzle(neon(url), { schema });
}

export type Db = NonNullable<ReturnType<typeof criarDb>>;
