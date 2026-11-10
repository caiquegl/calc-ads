---
name: tabelas-anuais
description: Procedimento de virada de ano das tabelas fiscais (salário mínimo, INSS, IRRF, dependente, seguro-desemprego). Use quando sair novo salário mínimo, nova portaria do INSS ou mudança na tabela do IR.
---

# Atualização anual de tabelas

Calendário típico: salário mínimo e portaria do INSS saem entre o fim de dezembro e a primeira quinzena de janeiro. Tabela do IR muda só por lei/MP.

## Passos

1. **Pesquise** os valores novos em fontes oficiais (Portaria Interministerial MPS/MF, Decreto do salário mínimo, Receita Federal). Guarde os links.
2. **Crie** `packages/core/src/tabelas/<ANO>.ts` copiando o ano anterior. Atualize valores, `vigenciaInicio` e `fontes`.
3. **Registre** em `packages/core/src/tabelas/index.ts` (objeto `TABELAS`) e mude `TABELA_PADRAO` quando entrar em vigor.
4. **Testes**: adicione casos com o novo mínimo, o novo teto (desconto máximo) e uma faixa intermediária. Confira o desconto máximo do INSS contra o divulgado oficialmente.
5. `pnpm check`.
6. **Publique sem atualizar o app**: com a API no ar, rode
   ```bash
   curl -X POST "$API/admin/tabelas" -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "Content-Type: application/json" --data @tabela.json
   ```
   (gere o JSON a partir do arquivo .ts; a última faixa do IRRF com `"ate": null`).
7. Na próxima versão do app, a tabela nova já vai embarcada.

## Checklist de conferência

- [ ] Primeira faixa do INSS = salário mínimo
- [ ] Soma das contribuições até o teto = desconto máximo oficial
- [ ] Faixas do IRRF e parcela a deduzir batem com a Receita
- [ ] Desconto simplificado = 25% do limite da faixa isenta (confirmar a cada mudança)
- [ ] Redutor (se ainda existir) com constantes atualizadas
- [ ] `fontes` preenchido
