import { useEffect, useRef } from 'react'
import { DayNav } from './components/DayNav'
import { ThemeToggle } from './components/ThemeToggle'
import { AoVivoSection } from './sections/AoVivoSection'
import { Lay0x1Section } from './sections/Lay0x1Section'
import { LayVisSection } from './sections/LayVisSection'
import { useDia } from './hooks/useDia'
import { useRegua } from './hooks/useRegua'
import { useReferencia } from './hooks/useReferencia'
import { overFt, overHt, placarHtTexto, placarTexto } from './lib/format'

function App() {
  const dia = useDia()
  const regua = useRegua()
  const referencia = useReferencia()
  const headerRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const irParaHashFeito = useRef(false)

  // Altura real do header grudado — o scroll-margin-top das seções depende dela; um valor
  // chumbado deixa o título da seção escondido atrás do header em qualquer tela diferente.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const medir = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    medir()
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(medir)
      ro.observe(el)
      return () => ro.disconnect()
    }
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  useEffect(() => {
    document.title = `Painel ${dia.rotulo} — fulltbet`
  }, [dia.rotulo])

  // O scroll do #hash só faz sentido depois que as listas encheram — antes disso a página
  // inteira mede cinco linhas de "Carregando…" e a posição calculada não vale nada.
  useEffect(() => {
    if (irParaHashFeito.current) return
    if (regua == null || referencia == null) return
    irParaHashFeito.current = true
    if (!location.hash) return
    const alvo = document.querySelector(location.hash)
    alvo?.scrollIntoView()
  }, [regua, referencia])

  return (
    <>
      <header ref={headerRef}>
        <div className="header-inner">
          <div className="blip" aria-hidden="true" />
          <h1>Painel</h1>
          <ThemeToggle />
        </div>
        <DayNav rotulo={dia.rotulo} tag={dia.tag} podeVoltar={dia.podeVoltar} podeAvancar={dia.podeAvancar} onPrev={dia.prev} onNext={dia.next} />
        {/* Movido de dentro do <main> pra dentro do <header> — pedido do usuário testando ao
            vivo ("tem como ficar fixo, sempre visível?"). O header inteiro já é sticky
            (position: sticky, top: 0), então o menu só precisava entrar na área que já gruda no
            topo ao rolar, não ganhar CSS de sticky própria. `--header-h` (medido via
            ResizeObserver em App.tsx) inclui o menu automaticamente agora, então o
            scroll-margin-top das seções (que usa essa variável) continua correto sem mudança. */}
        <nav className="jump" aria-label="Ir para a seção">
          <a href="#lay0x1">Lay 0×1</a>
          <a href="#bussola">Bússola</a>
          <a href="#layvis">Lay Visitante</a>
          <a href="#farol">Farol</a>
          <a href="#sonar">Sonar</a>
        </nav>
      </header>
      <main ref={mainRef}>
        <p className="ressalva">
          fulltbet · lista de triagem, não recomendação — <b>a entrada é sua, ao vivo ou no pré-jogo</b>
        </p>

        {/* Duas colunas no desktop foram construídas (correção nº8 do review de acabamento) e
            REVERTIDAS depois — o usuário testou ao vivo e preferiu tudo empilhado numa coluna só
            em qualquer largura de tela (ver histórico em index.css, `.secoes`). Os wrappers
            `.secoes`/`.secoes-col` continuam no JSX (display: contents sempre, não fazem nada
            visualmente) só pra não reescrever a árvore de componentes por uma mudança que pode
            ir e voltar de novo. A ORDEM aqui é a ordem visual real, e bate com o nav.jump (Lay
            0x1, Bússola, Lay Visitante, Farol, Sonar) — não é mais a ordem original do produto
            (Lay0x1, LayVisitante, Farol, Sonar, Bússola), ficou assim do experimento de colunas
            e não houve motivo pra desfazer ao reverter só o CSS. */}
        <div className="secoes">
          <div className="secoes-col">
            <Lay0x1Section dataRef={dia.dataRef} />

            <AoVivoSection
              id="bussola"
              titulo="Bússola"
              ajuda="Pré-jogo, 10min antes do apito, mas a entrada é ao vivo — abre a tela quando começar. Evento: over 1.5 FT. Estrelas: histórico por faixa de LG total."
              flag="flag_t"
              vazioMsg="Nenhum jogo na Bússola nesse dia."
              secaoRegua="bussola"
              eventoFn={overFt}
              placarFn={placarTexto}
              dataRef={dia.dataRef}
              regua={regua}
              referencia={referencia}
            />
          </div>
          <div className="secoes-col">
            <LayVisSection dataRef={dia.dataRef} regua={regua} referencia={referencia} />

            <AoVivoSection
              id="farol"
              titulo="Farol"
              ajuda="Decisão ao vivo, com o jogo na tela — isto é registro do dia, não confirma nem manda entrar. Evento: over 0.5 HT."
              flag="flag_q"
              vazioMsg="Nenhum jogo no Farol nesse dia."
              eventoFn={overHt}
              placarFn={placarHtTexto}
              dataRef={dia.dataRef}
              regua={regua}
              referencia={referencia}
            />

            <AoVivoSection
              id="sonar"
              titulo="Sonar"
              ajuda="Decisão ao vivo, com o jogo na tela — isto é registro do dia, não confirma nem manda entrar. Evento: over 0.5 HT."
              flag="flag_s"
              vazioMsg="Nenhum jogo no Sonar nesse dia."
              eventoFn={overHt}
              placarFn={placarHtTexto}
              dataRef={dia.dataRef}
              regua={regua}
              referencia={referencia}
            />
          </div>
        </div>
      </main>
      <footer>fulltbet · atualiza ao abrir a página · dado bruto no Supabase, últimos 3 dias</footer>
    </>
  )
}

export default App
