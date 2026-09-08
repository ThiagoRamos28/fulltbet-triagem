/** Explicação da seção (protocolo, evento) — antes era um parágrafo sempre visível embaixo do
 *  título; virou `<details>` recolhido por padrão, atrás de um ícone "i", depois do usuário achar
 *  que o texto repetido em toda seção poluía a página (a informação é útil na primeira leitura,
 *  não em toda visita). `<details>`/`<summary>` nativo: sem JS de estado, navegável por teclado. */
export function SectionHelp({ children }: { children: React.ReactNode }) {
  return (
    <details className="ajuda">
      <summary aria-label="Sobre esta seção">
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line x1="12" y1="11" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="7.6" r="1.1" fill="currentColor" />
        </svg>
      </summary>
      <p>{children}</p>
    </details>
  )
}
