import { ConfidenceStars } from './ConfidenceStars'
import { estrelasPara, valorDaRegua } from '../lib/format'
import type { ReguaRow, Secao } from '../types'

/** Filtro "pelo menos N estrelas" — a régua é uma escada, então 4★ significa "4 ou 5". Filtra no
 *  cliente (as linhas do dia já estão em memória), nunca dispara nova query. */
export function StarFilter({
  secao,
  linhas,
  regua,
  min,
  onChange,
}: {
  secao: Secao
  linhas: Array<{ lg_casa?: number | null; lg_fora?: number | null; odds_home?: number | null }>
  regua: Record<Secao, ReguaRow[]> | null
  min: number
  onChange: (min: number) => void
}) {
  if (!linhas.length || !regua || !regua[secao] || !regua[secao].length) return null

  const porDegrau = [0, 0, 0, 0, 0, 0]
  linhas.forEach((j) => {
    const f = estrelasPara(regua, secao, valorDaRegua(secao, j))
    if (f) porDegrau[f.n]++
  })
  const acumulado = (n: number) => {
    let t = 0
    for (let i = n; i <= 5; i++) t += porDegrau[i]
    return t
  }

  const degraus = [3, 4, 5]
    .map((n) => ({ n, q: acumulado(n) }))
    .filter(({ q }) => q && q !== linhas.length)

  return (
    <div className="filtro" role="group" aria-label={`Filtrar por estrelas de confiança`}>
      <span className="rot">Confiança</span>
      <button type="button" aria-pressed={min === 0} onClick={() => onChange(0)}>
        Todas <span className="contagem">{linhas.length}</span>
      </button>
      {degraus.map(({ n, q }) => (
        <button key={n} type="button" aria-pressed={min === n} aria-label={`${n} estrelas ou mais`} onClick={() => onChange(n)}>
          <ConfidenceStars n={n} titulo={`${n}★ ou mais`} />
          <span className="contagem">{q}</span>
        </button>
      ))}
    </div>
  )
}
