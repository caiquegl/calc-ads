import { TABELA_PADRAO } from "@acerto/core";
import Link from "next/link";
import { CALCULADORAS } from "@/lib/calculadoras";

export default function Inicio() {
  return (
    <div className="inicio">
      <div className="inicio-cabecalho">
        <span className="rotulo">Acerto · tabelas {TABELA_PADRAO.ano}</span>
        <h1>Suas contas trabalhistas, sem susto.</h1>
        <p className="subtitulo">Simule rescisão, salário líquido, férias, 13º, hora extra e FGTS. Grátis e sem cadastro.</p>
      </div>
      <ul className="grade">
        {CALCULADORAS.map((c) => (
          <li key={c.rota}>
            <Link href={c.rota} className="calc">
              <span className="calc-simbolo" aria-hidden="true">{c.simbolo}</span>
              <strong>{c.titulo}</strong>
              <span>{c.descricao}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
