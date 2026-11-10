import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { criarApp } from "./app.js";

describe("API sem banco", () => {
  const app = criarApp(null);

  it("health", async () => {
    const res = await app.request("/health");
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, banco: false });
  });

  it("tabela 2026 embarcada", async () => {
    const res = await app.request("/v1/tabelas/2026");
    const body = (await res.json()) as { origem: string; tabela: { salarioMinimo: number } };
    assert.equal(body.origem, "embarcada");
    assert.equal(body.tabela.salarioMinimo, 1621);
  });

  it("404 para ano sem tabela", async () => {
    assert.equal((await app.request("/v1/tabelas/1990")).status, 404);
  });

  it("config padrão", async () => {
    const body = (await (await app.request("/v1/config")).json()) as { anuncios: { habilitado: boolean } };
    assert.equal(body.anuncios.habilitado, true);
  });
});
