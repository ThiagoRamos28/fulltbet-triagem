import { ConfidenceStars } from './ConfidenceStars'
import { Confronto } from './Confronto'
import { GameCard } from './GameCard'
import { Meta } from './Meta'
import { Perfil } from './Perfil'
import { StatusPill } from './StatusPill'
import { estrelasPara, horaDeTimestamptz, oddJusta, statusDe, valorDaRegua } from '../lib/format'
import type { ReferenciaRow, ReguaRow, Secao, TriagemRow } from '../types'

/** Card compartilhado por Farol, Sonar e Bússola — a única diferença entre as três seções é
 *  `regua` (só a Bússola tem estrela própria) e a função de placar (HT nas duas primeiras, FT na
 *  Bússola). Espelha `cardAoVivo` do index.html legado. */
export function AoVivoCard({
  j,
  regua,
  referencia,
  secaoRegua,
  placar,
  hidden,
}: {
  j: TriagemRow
  regua: Record<Secao, ReguaRow[]> | null
  referencia: Record<string, ReferenciaRow> | null
  secaoRegua?: 'bussola'
  placar: string | null
  hidden?: boolean
}) {
  const s = statusDe(j)
  const soma = j.lg_casa != null && j.lg_fora != null ? Number(j.lg_casa) + Number(j.lg_fora) : null
  const d = oddJusta(j)
  const fx = secaoRegua ? estrelasPara(regua, secaoRegua, valorDaRegua(secaoRegua, j)) : null

  return (
    <GameCard
      statusCls={s.cls}
      estrelas={fx?.n}
      hidden={hidden}
      pais={j.pais}
      hora={horaDeTimestamptz(j.horario_brasilia)}
      jogo={`${j.mandante} × ${j.visitante}`}
      summaryExtra={
        <>
          <Confronto j={j} referencia={referencia} />
          {fx ? <ConfidenceStars n={fx.n} titulo={`${fx.n} de 5 estrelas — histórico ${fx.taxa}% de ${fx.evento}`} /> : null}
        </>
      }
      status={<StatusPill status={s} placar={placar} />}
    >
      <div className="linha">
        over0.5HT <b>{j.odd_ht_over ?? '-'}</b> · LG casa <b>{j.lg_casa != null ? Math.round(j.lg_casa) : '-'}</b> · LG fora{' '}
        <b>{j.lg_fora != null ? Math.round(j.lg_fora) : '-'}</b> · H <b>{j.h_score != null ? Math.round(j.h_score) : '-'}</b>
        {soma != null ? (
          <>
            {' '}
            · LG total <b>{Math.round(soma)}</b>
          </>
        ) : null}
      </div>
      {d ? (
        <div className="linha">
          odd justa 5' <b>{d[0]}</b> · 10' <b>{d[1]}</b> · 15' <b>{d[2]}</b>
        </div>
      ) : null}
      {fx ? (
        <div className="linha">
          <ConfidenceStars n={fx.n} titulo={`${fx.n} de 5 estrelas`} />{' '}
          <span style={{ color: 'var(--fg-dim)' }}>
            histórico {fx.taxa}% de {fx.evento} (n={fx.amostra})
          </span>
        </div>
      ) : null}
      <Meta pais={j.pais} competicao={j.competicao} />
      <Perfil j={j} referencia={referencia} mandante={j.mandante} visitante={j.visitante} />
    </GameCard>
  )
}
