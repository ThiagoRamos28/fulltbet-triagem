import { useState } from 'react'
import { ConfidenceStars } from '../components/ConfidenceStars'
import { Confronto } from '../components/Confronto'
import { GameCard } from '../components/GameCard'
import { Meta } from '../components/Meta'
import { Perfil } from '../components/Perfil'
import { Placar } from '../components/Placar'
import { SectionHelp } from '../components/SectionHelp'
import { StarFilter } from '../components/StarFilter'
import { StatusPill } from '../components/StatusPill'
import { useSecaoData } from '../hooks/useSecaoData'
import { estrelasPara, horaDeTimestamptz, placarTexto, statusDe, valorDaRegua } from '../lib/format'
import type { LayVisRow, ReferenciaRow, ReguaRow, Secao } from '../types'

function CardLayVis({
  j,
  regua,
  referencia,
  hidden,
}: {
  j: LayVisRow
  regua: Record<Secao, ReguaRow[]> | null
  referencia: Record<string, ReferenciaRow> | null
  hidden?: boolean
}) {
  const s = statusDe(j)
  const placar = placarTexto(j)
  const soma = j.lg_casa != null && j.lg_fora != null ? Number(j.lg_casa) + Number(j.lg_fora) : null
  const fx = estrelasPara(regua, 'layvis', valorDaRegua('layvis', j))

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
        odd casa <b>{j.odds_home ?? '-'}</b> · H <b>{j.h_score != null ? Math.round(j.h_score) : '-'}</b> · LG casa{' '}
        <b>{j.lg_casa != null ? Math.round(j.lg_casa) : '-'}</b> · LG fora <b>{j.lg_fora != null ? Math.round(j.lg_fora) : '-'}</b>
        {soma != null ? (
          <>
            {' '}
            · LG total <b>{Math.round(soma)}</b>
          </>
        ) : null}
      </div>
      {/* Estrela própria desde 05/09 (migração 0043), graduada pela ODD DA CASA e medida contra o
          evento DESTA seção — casa não perder —, nunca pela régua do Bússola. */}
      {fx ? (
        <div className="linha">
          <ConfidenceStars n={fx.n} titulo={`${fx.n} de 5 estrelas`} />{' '}
          <span style={{ color: 'var(--fg-dim)' }}>
            histórico {fx.taxa}% de {fx.evento} (n={fx.amostra})
          </span>
        </div>
      ) : null}
      <Meta pais={j.pais} />
      <Perfil j={j} referencia={referencia} mandante={j.mandante} visitante={j.visitante} />
    </GameCard>
  )
}

export function LayVisSection({
  dataRef,
  regua,
  referencia,
}: {
  dataRef: string
  regua: Record<Secao, ReguaRow[]> | null
  referencia: Record<string, ReferenciaRow> | null
}) {
  const { linhas, carregando, erro } = useSecaoData<LayVisRow>('lay_visitante_diario', dataRef)
  const [min, setMin] = useState(0)

  const visiveis = linhas.filter((j) => {
    const fx = estrelasPara(regua, 'layvis', valorDaRegua('layvis', j))
    return (fx?.n ?? 0) >= min
  })
  const n = !linhas.length ? '' : visiveis.length < linhas.length ? `${visiveis.length} de ${linhas.length}` : String(linhas.length)
  const semJogoGenuino = !carregando && !erro && !linhas.length

  return (
    <section id="layvis">
      <div className="sec-head">
        <h2>
          Lay Visitante Favorito <span className="n">{n}</span>
        </h2>
        <SectionHelp>
          Pré-jogo, 15min antes do apito. Casa favorita (odds até 2,00) — lay no visitante, entra na virada do apito e segura
          até o fim. Evento é 1X: bateu quando a casa não perde.
        </SectionHelp>
      </div>
      <Placar linhas={linhas} semJogo={semJogoGenuino} />
      <StarFilter secao="layvis" linhas={linhas} regua={regua} min={min} onChange={setMin} />
      <div className="lista" aria-busy={carregando}>
        {erro ? (
          <p className="erro">{erro}</p>
        ) : carregando ? (
          <p className="carregando">Carregando…</p>
        ) : !linhas.length ? (
          <p className="vazio">Nenhum jogo passou no recorte nesse dia.</p>
        ) : (
          <>
            {linhas.map((j, i) => {
              const fx = estrelasPara(regua, 'layvis', valorDaRegua('layvis', j))
              const hidden = (fx?.n ?? 0) < min
              return <CardLayVis key={i} j={j} regua={regua} referencia={referencia} hidden={hidden} />
            })}
            {!visiveis.length ? <p className="vazio vazio-filtro">Nenhum jogo desta seção com {min} estrelas ou mais hoje.</p> : null}
          </>
        )}
      </div>
    </section>
  )
}
