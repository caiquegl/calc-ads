import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  avosEntre,
  calcularDecimoTerceiro,
  calcularFerias,
  calcularHoraExtra,
  calcularInss,
  calcularIrrf,
  calcularRedutor,
  calcularRescisao,
  calcularSalarioLiquido,
  diasDeAviso,
  parseData,
  TABELA_2026,
} from "./index.js";

const perto = (atual: number, esperado: number, tol = 0.011) =>
  assert.ok(Math.abs(atual - esperado) <= tol, `esperado ${esperado}, recebido ${atual}`);

describe("INSS 2026", () => {
  it("salário mínimo paga 7,5%", () => perto(calcularInss(1621).valor, 121.58));
  it("teto limita a R$ 988,09", () => {
    perto(calcularInss(8475.55).valor, 988.09);
    perto(calcularInss(20000).valor, 988.09);
  });
  it("é progressivo por faixa (R$ 3.000)", () => {
    // 121,575 + 115,3656 + (97,16 × 12%) = 248,60
    perto(calcularInss(3000).valor, 248.6);
  });
  it("zero para zero", () => assert.equal(calcularInss(0).valor, 0));
});

describe("IRRF 2026 (Lei 15.270/2025)", () => {
  it("isento até R$ 5.000", () => {
    for (const bruto of [2000, 3500, 4999.99, 5000]) {
      const r = calcularSalarioLiquido({ salarioBruto: bruto });
      assert.equal(r.irrf, 0, `bruto ${bruto}`);
    }
  });
  it("redutor decrescente entre 5.000,01 e 7.350", () => {
    perto(calcularRedutor(6000, 10_000, TABELA_2026), 179.75);
    assert.equal(calcularRedutor(7350.01, 10_000, TABELA_2026), 0);
  });
  it("acima de 7.350 usa só a tabela (R$ 10.000)", () => {
    const r = calcularSalarioLiquido({ salarioBruto: 10000 });
    perto(r.inss, 988.09);
    perto(r.irrf, 1569.55);
  });
  it("usa desconto simplificado quando é melhor", () => {
    const r = calcularIrrf({ rendimentosTributaveis: 4000, inss: 300 });
    assert.equal(r.tipoDeducao, "simplificada");
  });
  it("dependentes reduzem a base", () => {
    const sem = calcularSalarioLiquido({ salarioBruto: 9000 }).irrf;
    const com = calcularSalarioLiquido({ salarioBruto: 9000, dependentes: 2 }).irrf;
    perto(sem - com, 2 * 189.59 * 0.275);
  });
});

describe("Férias", () => {
  it("30 dias + 1/3", () => {
    const r = calcularFerias({ salario: 3000 });
    perto(r.ferias, 3000);
    perto(r.tercoFerias, 1000);
    assert.equal(r.abono, 0);
  });
  it("abono pecuniário de 10 dias é isento", () => {
    const r = calcularFerias({ salario: 3000, diasAbono: 10 });
    perto(r.ferias, 2000);
    perto(r.abono, 1000);
    perto(r.tercoAbono, 333.33);
    perto(r.inss, calcularInss(2000 + 666.67).valor);
  });
});

describe("13º", () => {
  it("ano completo, primeira parcela sem descontos", () => {
    const r = calcularDecimoTerceiro({ salario: 3000, meses: 12 });
    perto(r.valorBruto, 3000);
    perto(r.primeiraParcela, 1500);
    perto(r.segundaParcela, 1500 - r.inss - r.irrf);
  });
  it("proporcional", () => perto(calcularDecimoTerceiro({ salario: 2400, meses: 5 }).valorBruto, 1000));
});

describe("Hora extra", () => {
  it("50% e 100% com DSR", () => {
    const r = calcularHoraExtra({ salario: 2200, horas50: 10, horas100: 5, diasUteis: 25, domingosEFeriados: 5 });
    perto(r.valorHora, 10);
    perto(r.valor50, 150);
    perto(r.valor100, 100);
    perto(r.dsr, 50);
    perto(r.total, 300);
  });
});

describe("Datas e avos", () => {
  it("fração de 15 dias conta como mês", () => {
    assert.equal(avosEntre(parseData("2026-01-01"), parseData("2026-03-14")), 2);
    assert.equal(avosEntre(parseData("2026-01-01"), parseData("2026-03-15")), 3);
  });
  it("aviso: 30 + 3/ano, máximo 90", () => {
    assert.equal(diasDeAviso(parseData("2025-01-10"), parseData("2026-01-09")), 30);
    assert.equal(diasDeAviso(parseData("2021-01-10"), parseData("2026-02-01")), 45);
    assert.equal(diasDeAviso(parseData("1990-01-01"), parseData("2026-01-01")), 90);
  });
});

describe("Rescisão", () => {
  const base = { salario: 3000, admissao: "2024-03-01", desligamento: "2026-06-20" } as const;

  it("sem justa causa com aviso indenizado", () => {
    const r = calcularRescisao({ ...base, tipo: "sem_justa_causa", aviso: "indenizado", saldoFgts: 5000 });
    const v = (c: string) => r.itens.find((i) => i.codigo === c)?.valor ?? 0;
    assert.equal(r.diasAviso, 36); // 2 anos completos
    perto(v("saldo_salario"), 2000); // 20 dias
    perto(v("aviso_indenizado"), 3600);
    assert.equal(r.dataProjetada, "2026-07-26");
    perto(v("decimo_terceiro"), 1750); // 7/12 (jul com 26 dias)
    perto(v("ferias_proporcionais"), 1250); // 01/03 a 26/07 = 5/12
    assert.ok(r.fgts.multa > 2000);
    assert.equal(r.seguroDesemprego, true);
    perto(r.liquido, r.totalProventos - r.totalDescontos);
  });

  it("justa causa: só saldo e férias vencidas", () => {
    const r = calcularRescisao({ ...base, tipo: "justa_causa", aviso: "dispensado", periodosFeriasVencidas: 1, saldoFgts: 5000 });
    const codigos = r.itens.filter((i) => i.tipo === "provento").map((i) => i.codigo);
    assert.deepEqual(codigos, ["saldo_salario", "ferias_vencidas", "terco_ferias_vencidas"]);
    assert.equal(r.fgts.multa, 0);
    assert.equal(r.fgts.saqueDisponivel, 0);
  });

  it("pedido de demissão sem cumprir aviso desconta um salário", () => {
    const r = calcularRescisao({ ...base, tipo: "pedido_demissao", aviso: "nao_cumprido" });
    assert.ok(r.itens.some((i) => i.codigo === "desconto_aviso" && i.valor === 3000));
    assert.equal(r.seguroDesemprego, false);
  });

  it("acordo: metade do aviso, multa 20% e saque de 80%", () => {
    const r = calcularRescisao({ ...base, tipo: "acordo", aviso: "indenizado", saldoFgts: 10000 });
    perto(r.itens.find((i) => i.codigo === "aviso_indenizado")!.valor, 1800);
    const baseMulta = 10000 + r.fgts.depositoRescisorio;
    perto(r.fgts.multa, baseMulta * 0.2);
    perto(r.fgts.saqueDisponivel, baseMulta * 0.8 + r.fgts.multa);
  });

  it("rejeita datas invertidas", () => {
    assert.throws(() => calcularRescisao({ ...base, desligamento: "2020-01-01", tipo: "acordo", aviso: "indenizado" }));
  });
});
