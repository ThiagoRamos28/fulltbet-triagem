import type { ReactNode } from 'react'
import { Flag } from './Flag'

/** Card colapsável de um jogo — `<details>` nativo, animado via grid-template-rows (0fr→1fr) no
 *  CSS, não por JS de medição. `estrelas` vira `data-estrelas` para o StarFilter esconder/mostrar
 *  sem re-render. Horário em texto comum, não em segmento: a correção nº3 do review de acabamento
 *  tinha trocado por `SevenSegmentDigits` a 11px, mas nesse tamanho o "1" quase não tem traço e a
 *  fileira fica ilegível — revertido depois do usuário testar ao vivo ("os números não ficaram
 *  bons"). O vocabulário de segmento funciona nos números GRANDES (contador do placar, data do
 *  cabeçalho); forçado em texto corrido pequeno, ele quebra a própria promessa de legibilidade. */
export function GameCard({
  statusCls,
  estrelas,
  pais,
  hora,
  jogo,
  summaryExtra,
  status,
  children,
  hidden,
}: {
  statusCls: 'pend' | 'ok' | 'miss'
  estrelas?: number
  pais: string | null | undefined
  hora: string
  jogo: ReactNode
  summaryExtra?: ReactNode
  status: ReactNode
  children: ReactNode
  hidden?: boolean
}) {
  return (
    <details className={`card ${statusCls}`} data-estrelas={estrelas != null ? estrelas : undefined} hidden={hidden}>
      <summary>
        <span className="hora">{hora}</span>
        <Flag pais={pais} />
        <span className="jogo">{jogo}</span>
        {summaryExtra}
        {status}
      </summary>
      <div className="detalhe-wrap">
        <div className="detalhe">{children}</div>
      </div>
    </details>
  )
}
