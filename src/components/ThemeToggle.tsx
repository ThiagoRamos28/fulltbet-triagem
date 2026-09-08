import { useEffect, useState } from 'react'

type Tema = 'light' | 'dark' | null

function temaSalvo(): Tema {
  try {
    const v = localStorage.getItem('tema')
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function sistemaEscuro(): boolean {
  return typeof window !== 'undefined' ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true) : true
}

function aplicarTema(t: Tema) {
  if (t) document.documentElement.dataset.theme = t
  else delete document.documentElement.dataset.theme
}

/** Botão de tema no cabeçalho — sem biblioteca, um atributo `data-theme` no `<html>` que
 *  sobrescreve `prefers-color-scheme` (ver index.css). Sem escolha do usuário a página segue o
 *  tema do sistema operacional; o clique fixa claro ou escuro e persiste em localStorage entre
 *  visitas (a leitura inicial já roda antes do React, num script inline em index.html, pra não
 *  piscar o tema errado no primeiro paint). */
export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>(() => temaSalvo())

  useEffect(() => {
    aplicarTema(tema)
  }, [tema])

  const escuro = tema ? tema === 'dark' : sistemaEscuro()

  function alternar() {
    const proximo: Tema = escuro ? 'light' : 'dark'
    setTema(proximo)
    try {
      localStorage.setItem('tema', proximo)
    } catch {
      /* localStorage indisponível (ex.: modo privado) — a escolha vale só pra sessão atual */
    }
  }

  return (
    <button
      type="button"
      className="tema-toggle"
      onClick={alternar}
      aria-label={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={escuro ? 'Tema escuro · clique para claro' : 'Tema claro · clique para escuro'}
    >
      {escuro ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.6 9.4A5.7 5.7 0 0 1 6.6 2.4a5.7 5.7 0 1 0 7 7Z" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <circle cx="8" cy="8" r="3.1" />
          <path d="M8 1.4v1.7M8 12.9v1.7M14.6 8h-1.7M3.1 8H1.4M12.5 3.5l-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7 3.5 3.5" />
        </svg>
      )}
    </button>
  )
}
