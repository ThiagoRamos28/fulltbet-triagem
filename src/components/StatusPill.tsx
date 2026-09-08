import type { StatusInfo } from '../types'

/** As três cores de status (âmbar/verde/vermelho) continuam a única linguagem de aguardando/
 *  bateu/não bateu — mas agora como um trio de LEDs aceso/apagado, não mais como pílula colorida
 *  (decisão do usuário, ver .impeccable/surfaces/src-app-tsx.md). Os três LEDs sempre desenham,
 *  só o do estado atual acende — o rótulo de texto fica neutro (`--fg-dim`) porque a cor agora
 *  mora só no LED, nunca duas vezes na mesma informação. O placar final volta a ser texto comum:
 *  a versão em segmento (leitura própria de quem construiu, nunca pedida) ficava ilegível nesse
 *  tamanho — "1" quase sem traço, "×" virando uma bolinha — achado testando ao vivo com o usuário. */
const LEDS: Array<{ cls: 'pend' | 'ok' | 'miss'; cor: string }> = [
  { cls: 'pend', cor: 'var(--pend)' },
  { cls: 'ok', cor: 'var(--ok)' },
  { cls: 'miss', cor: 'var(--miss)' },
]

export function StatusPill({ status, placar }: { status: StatusInfo; placar?: string | null }) {
  return (
    <span className="status">
      <span className="status-leds" aria-hidden="true">
        {LEDS.map((led) => (
          <i key={led.cls} className={`led${led.cls === status.cls ? ' on' : ''}`} style={{ ['--led-cor' as string]: led.cor }} />
        ))}
      </span>
      <span className="status-txt">{status.texto}</span>
      {placar ? <span className="status-score">{placar}</span> : null}
    </span>
  )
}
