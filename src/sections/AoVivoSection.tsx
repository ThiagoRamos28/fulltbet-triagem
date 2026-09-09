import { useState } from 'react'
import { AoVivoCard } from '../components/AoVivoCard'
import { Placar } from '../components/Placar'
import { SectionHelp } from '../components/SectionHelp'
import { SectionIcon, type SecaoIcone } from '../components/SectionIcon'
import { StarFilter } from '../components/StarFilter'
import { useSecaoData } from '../hooks/useSecaoData'
import { estrelasPara, valorDaRegua } from '../lib/format'
import type { ReferenciaRow, ReguaRow, Secao, TriagemRow } from '../types'

interface AoVivoSectionProps {
  id: string
  icone: SecaoIcone
  titulo: string
  ajuda: string
  flag: 'flag_q' | 'flag_s' | 'flag_t'
  vazioMsg: string
  secaoRegua?: 'bussola'
  eventoFn: (j: TriagemRow) => boolean
  placarFn: (j: TriagemRow) => string | null
  dataRef: string
  regua: Record<Secao, ReguaRow[]> | null
  referencia: Record<string, ReferenciaRow> | null
}

/** Farol, Sonar e Bússola são a mesma seção com flag/evento/régua diferentes — uma query por
 *  flag, para o card só existir dentro da seção do alerta que de fato disparou. */
export function AoVivoSection({ id, icone, titulo, ajuda, flag, vazioMsg, secaoRegua, eventoFn, placarFn, dataRef, regua, referencia }: AoVivoSectionProps) {
  const { linhas: brutas, carregando, erro } = useSecaoData<TriagemRow>('triagem', dataRef, { [flag]: true })
  const [min, setMin] = useState(0)

  const linhas = brutas.map((j) => (j.has_result ? { ...j, bateu: eventoFn(j) } : j))

  const visiveis = secaoRegua
    ? linhas.filter((j) => {
        const fx = estrelasPara(regua, secaoRegua, valorDaRegua(secaoRegua, j))
        return (fx?.n ?? 0) >= min
      })
    : linhas
  const n = !linhas.length ? '' : visiveis.length < linhas.length ? `${visiveis.length} de ${linhas.length}` : String(linhas.length)
  // Genuinamente sem jogo (dia carregou e não deu erro, mas zero linhas) é diferente de "ainda
  // carregando" — o placar pisca 00/00/00 em vez de sumir, dispositivo do relógio nunca ajustado.
  const semJogoGenuino = !carregando && !erro && !linhas.length

  return (
    <section id={id}>
      <div className="sec-head">
        <div className="sec-head-titulo">
          <SectionIcon tipo={icone} />
          <h2>
            {titulo} <span className="n">{n}</span>
          </h2>
        </div>
        <SectionHelp>{ajuda}</SectionHelp>
      </div>
      <Placar linhas={linhas} semJogo={semJogoGenuino} />
      {secaoRegua ? <StarFilter secao={secaoRegua} linhas={linhas} regua={regua} min={min} onChange={setMin} /> : null}
      <div className="lista" aria-busy={carregando}>
        {erro ? (
          <p className="erro">{erro}</p>
        ) : carregando ? (
          <p className="carregando">Carregando…</p>
        ) : !linhas.length ? (
          <p className="vazio">{vazioMsg}</p>
        ) : (
          <>
            {linhas.map((j, i) => {
              const hidden = secaoRegua ? (estrelasPara(regua, secaoRegua, valorDaRegua(secaoRegua, j))?.n ?? 0) < min : false
              return <AoVivoCard key={i} j={j} regua={regua} referencia={referencia} secaoRegua={secaoRegua} placar={placarFn(j)} hidden={hidden} />
            })}
            {secaoRegua && !visiveis.length ? <p className="vazio vazio-filtro">Nenhum jogo desta seção com {min} estrelas ou mais hoje.</p> : null}
          </>
        )}
      </div>
    </section>
  )
}
