import { statusDe } from '../lib/format'
import type { JogoBase } from '../types'

/** `semJogo` distingue "seção genuinamente sem jogo hoje" de "ainda carregando" — os dois tinham
 *  o mesmo resultado visual (placar simplesmente sumia). Quando genuinamente vazio, o placar
 *  continua desenhado em 00/00/00 mas pisca devagar (ver .placar-zerado em index.css). Durante o
 *  carregamento (`semJogo` false) o placar some como antes — esse estado já tem sua própria
 *  affordance (o texto "Carregando…" na lista). Números em mono comum, não mais em sete
 *  segmentos: a direção "Carta de Navegação" (canvas de 09/09) é tipográfica, não um placar de
 *  LED — ver a nota no topo de index.css. */
export function Placar({ linhas, semJogo }: { linhas: JogoBase[]; semJogo?: boolean }) {
  if (!linhas.length && !semJogo) return null
  let pend = 0
  let ok = 0
  let miss = 0
  linhas.forEach((j) => {
    const s = statusDe(j)
    if (s.cls === 'pend') pend++
    else if (s.cls === 'ok') ok++
    else miss++
  })
  const resolvidos = ok + miss
  const pct = resolvidos ? Math.round((ok / resolvidos) * 100) : null
  const zerado = Boolean(semJogo) && !linhas.length
  return (
    <div className={`placar${zerado ? ' placar-zerado' : ''}`} aria-label={zerado ? 'Nenhum jogo nesta seção hoje' : undefined}>
      <div className="cel pend">
        <span className="placar-num" style={{ color: 'var(--pend)' }} aria-label={`${pend} aguardando`}>
          {String(pend).padStart(2, '0')}
        </span>
        <span className="lbl">Aguardando</span>
      </div>
      <div className="cel ok">
        <span className="placar-num" style={{ color: 'var(--ok)' }} aria-label={`${ok} bateu`}>
          {String(ok).padStart(2, '0')}
        </span>
        <span className="lbl">
          Bateu {pct != null ? <span className="pct">{pct}%</span> : null}
        </span>
      </div>
      <div className="cel miss">
        <span className="placar-num" style={{ color: 'var(--miss)' }} aria-label={`${miss} não bateu`}>
          {String(miss).padStart(2, '0')}
        </span>
        <span className="lbl">Não bateu</span>
      </div>
    </div>
  )
}
