import { esperados, faixaDe, num } from '../lib/format'
import type { PerfilFields, ReferenciaRow } from '../types'

/** Dois números crus (gols esperados de cada lado por cruzamento), não uma razão — o separador
 *  "×" existe só para marcar que são dois valores, nunca uma multiplicação. */
export function Confronto({ j, referencia }: { j: PerfilFields; referencia: Record<string, ReferenciaRow> | null }) {
  const e = esperados(j)
  if (!e) return null
  const cls = (m: string, side: 'casa' | 'fora', v: number) => (faixaDe(referencia, m, side, v) === 'q-alto' ? 'alto' : 'baixo')
  return (
    <span className="confronto" title="Gols esperados: ataque de cada time somado à defesa do adversário, dividido por 2 (janela 10)">
      <span className={cls('esperado_casa', 'casa', e.casa)}>{num(e.casa, 1)}</span>
      <span className="sep">×</span>
      <span className={cls('esperado_fora', 'fora', e.fora)}>{num(e.fora, 1)}</span>
    </span>
  )
}
