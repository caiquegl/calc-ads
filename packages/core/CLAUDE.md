# packages/core

- Funções puras, sem I/O, sem dependências de runtime. Recebem `tabela` opcional (padrão = ano vigente).
- Dinheiro em `number`, arredondado só na saída com `round2`. Não arredondar etapas intermediárias, exceto onde a lei manda (INSS total).
- Datas como string `YYYY-MM-DD`, tratadas em UTC (`datas.ts`).
- Todo resultado expõe detalhes suficientes para a UI mostrar o passo a passo.
- Testes em `src/*.test.ts` com `node:test`. Rode `pnpm --filter @acerto/core test`.
- Antes de mexer em regra, leia `.claude/skills/clt-calculos/SKILL.md`.
