import { SevenSegmentDigits } from './SevenSegment'
import { statusDe } from '../lib/format'
import type { JogoBase } from '../types'

/** `semJogo` distingue "seção genuinamente sem jogo hoje" de "ainda carregando" — os dois tinham
 *  o mesmo resultado visual (placar simplesmente sumia). Quando genuinamente vazio, o placar
 *  continua desenhado em 00/00/00 mas pisca devagar: o mesmo dispositivo do relógio despertador
 *  nunca ajustado, não a ausência do componente (ver .placar-zerado em index.css, correção nº7
 *  do review de acabamento). Durante o carregamento (`semJogo` false) o placar some como antes —
 *  esse estado já tem sua própria affordance (o texto "Carregando…" na lista). */
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
        <SevenSegmentDigits value={String(pend).padStart(2, '0')} color="var(--pend)" size={26} label={`${pend} aguardando`} />
        <span className="lbl">Aguardando</span>
      </div>
      <div className="cel ok">
        <SevenSegmentDigits value={String(ok).padStart(2, '0')} color="var(--ok)" size={26} label={`${ok} bateu`} />
        <span className="lbl">
          Bateu {pct != null ? <span className="pct">{pct}%</span> : null}
        </span>
      </div>
      <div className="cel miss">
        <SevenSegmentDigits value={String(miss).padStart(2, '0')} color="var(--miss)" size={26} label={`${miss} não bateu`} />
        <span className="lbl">Não bateu</span>
      </div>
    </div>
  )
}
