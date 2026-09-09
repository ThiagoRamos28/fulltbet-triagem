import type { ReactNode } from 'react'
import { GameCard } from '../components/GameCard'
import { Meta } from '../components/Meta'
import { Placar } from '../components/Placar'
import { SectionHelp } from '../components/SectionHelp'
import { SectionIcon } from '../components/SectionIcon'
import { StatusPill } from '../components/StatusPill'
import { useSecaoData } from '../hooks/useSecaoData'
import { horaDeNaive, placarTexto, statusDe } from '../lib/format'
import type { Lay0x1Row } from '../types'

function CardLay0x1({ j }: { j: Lay0x1Row }) {
  const s = statusDe(j)
  const placar = placarTexto(j)
  let badge: ReactNode = null
  if (j.passa_v1 && j.passa_i) badge = <span className="badge farol">v1+I</span>
  else if (j.passa_v1) badge = <span className="badge farol">v1</span>
  else if (j.passa_i) badge = <span className="badge">I · observar</span>

  return (
    <GameCard
      statusCls={s.cls}
      pais={j.pais}
      hora={horaDeNaive(j.horario_brasilia)}
      jogo={`${j.mandante} × ${j.visitante}`}
      summaryExtra={badge}
      status={<StatusPill status={s} placar={placar} />}
    >
      <div className="linha">
        casa <b>{j.odd_casa_ft ?? '-'}</b> · vis <b>{j.odd_vis_ft ?? '-'}</b> · over2.5 <b>{j.odd_over25 ?? '-'}</b> · H{' '}
        <b>{j.h_score != null ? Math.round(j.h_score) : '-'}</b>
      </div>
      <Meta pais={j.pais} />
    </GameCard>
  )
}

export function Lay0x1Section({ dataRef }: { dataRef: string }) {
  const { linhas, carregando, erro } = useSecaoData<Lay0x1Row>('lay0x1_diario', dataRef)
  const n = linhas.length ? linhas.length : ''
  const semJogoGenuino = !carregando && !erro && !linhas.length

  return (
    <section id="lay0x1">
      <div className="sec-head">
        <div className="sec-head-titulo">
          <SectionIcon tipo="lay0x1" />
          <h2>
            Lay 0×1 <span className="n">{n}</span>
          </h2>
        </div>
        <SectionHelp>
          Protocolo v1: manda de todos as 3 odds do Resultado da Partida + a linha 0×1 (back/lay). Desastre é o jogo terminar
          exatamente 0×1 — qualquer outro placar, bateu.
        </SectionHelp>
      </div>
      <Placar linhas={linhas} semJogo={semJogoGenuino} />
      <div className="lista" aria-busy={carregando}>
        {erro ? (
          <p className="erro">{erro}</p>
        ) : carregando ? (
          <p className="carregando">Carregando…</p>
        ) : !linhas.length ? (
          <p className="vazio">Nenhum jogo passou nos filtros nesse dia (v1 e I).</p>
        ) : (
          linhas.map((j, i) => <CardLay0x1 key={i} j={j} />)
        )}
      </div>
    </section>
  )
}
