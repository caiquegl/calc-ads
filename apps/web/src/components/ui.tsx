"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { brl, mascaraData, mascaraDinheiro } from "@/lib/format";

export function Tela({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: ReactNode }) {
  return (
    <div className="tela">
      <header className="tela-cabecalho">
        <h1>{titulo}</h1>
        {subtitulo ? <p className="subtitulo">{subtitulo}</p> : null}
      </header>
      {children}
    </div>
  );
}

export function Cartao({ children }: { children: ReactNode }) {
  return <section className="cartao">{children}</section>;
}

/** Formulário que calcula no submit (Enter também funciona). */
export function Formulario({ onCalcular, children }: { onCalcular: () => void; children: ReactNode }) {
  return (
    <form
      className="cartao"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onCalcular();
      }}
    >
      {children}
    </form>
  );
}

function Campo({ rotulo, ajuda, valor, placeholder, onChange }: { rotulo: string; ajuda?: string; valor: string; placeholder: string; onChange: (t: string) => void }) {
  const id = useId();
  return (
    <div className="campo">
      <label htmlFor={id} className="rotulo">{rotulo}</label>
      <input
        id={id}
        className="entrada"
        inputMode="numeric"
        autoComplete="off"
        value={valor}
        placeholder={placeholder}
        aria-describedby={ajuda ? `${id}-ajuda` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {ajuda ? <small id={`${id}-ajuda`} className="ajuda">{ajuda}</small> : null}
    </div>
  );
}

export function CampoDinheiro({ rotulo, valor, onChange, ajuda }: { rotulo: string; valor: string; onChange: (v: string) => void; ajuda?: string }) {
  return <Campo rotulo={rotulo} ajuda={ajuda} valor={valor ? `R$ ${valor}` : ""} placeholder="R$ 0,00" onChange={(t) => onChange(mascaraDinheiro(t))} />;
}

export function CampoNumero({ rotulo, valor, onChange, ajuda }: { rotulo: string; valor: string; onChange: (v: string) => void; ajuda?: string }) {
  return <Campo rotulo={rotulo} ajuda={ajuda} valor={valor} placeholder="0" onChange={(t) => onChange(t.replace(/\D/g, ""))} />;
}

export function CampoData({ rotulo, valor, onChange }: { rotulo: string; valor: string; onChange: (v: string) => void }) {
  return <Campo rotulo={rotulo} valor={valor} placeholder="DD/MM/AAAA" onChange={(t) => onChange(mascaraData(t))} />;
}

export function Opcoes<T extends string>({ rotulo, opcoes, valor, onChange }: { rotulo: string; opcoes: { valor: T; rotulo: string }[]; valor: T; onChange: (v: T) => void }) {
  return (
    <fieldset className="campo opcoes">
      <legend className="rotulo">{rotulo}</legend>
      <div className="opcoes-lista">
        {opcoes.map((o) => (
          <button key={o.valor} type="button" className="opcao" aria-pressed={o.valor === valor} onClick={() => onChange(o.valor)}>
            {o.rotulo}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Botao({ titulo }: { titulo: string }) {
  return <button type="submit" className="botao">{titulo}</button>;
}

export function Destaque({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="destaque">
      <span className="rotulo">{rotulo}</span>
      <strong className="valor-grande">{brl(valor)}</strong>
    </div>
  );
}

export function Linha({ rotulo, valor, tipo }: { rotulo: string; valor: number; tipo?: "provento" | "desconto" }) {
  return (
    <div className="linha">
      <span>{rotulo}</span>
      <strong className={tipo ?? ""}>{tipo === "desconto" ? "− " : ""}{brl(valor)}</strong>
    </div>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return <p className="aviso">{children}</p>;
}

export function Erro({ mensagem }: { mensagem: string | null }) {
  return mensagem ? <p className="erro" role="alert">{mensagem}</p> : null;
}

/** Área do resultado: rola até ela depois do cálculo, para o resultado ficar à vista antes de qualquer anúncio. */
export function Resultado({ de, children }: { de: object; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [de]); // `de` = objeto do resultado: rola a cada novo cálculo, não a cada tecla
  return (
    <div className="resultado" aria-live="polite" ref={ref}>
      {children}
    </div>
  );
}
