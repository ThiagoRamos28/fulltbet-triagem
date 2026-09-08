import type { CSSProperties } from 'react'

/** Qual dos sete segmentos (a topo, b superior-direito, c inferior-direito, d base, e
 *  inferior-esquerdo, f superior-esquerdo, g meio) fica aceso pra cada dígito 0-9 — o mapa
 *  clássico de placar/relógio de LED. */
const SEGMENTOS_POR_DIGITO: Record<string, string[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
}

const TODOS_OS_SEGMENTOS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

/** Um único caractere — dígito vira máscara de sete segmentos (desenhada em CSS `clip-path`,
 *  nenhuma fonte especial), qualquer outro caractere (separador, hífen) passa como texto de apoio
 *  na mesma cor. O segmento apagado nunca some: é a mesma forma do aceso, só em opacidade baixa
 *  (`.seg7-* i` sem `.on`) — ver THESIS em .impeccable/surfaces/src-app-tsx.md. */
export function SevenSegmentDigit({ char, color = 'currentColor', size = 20 }: { char: string; color?: string; size?: number }) {
  const acesos = SEGMENTOS_POR_DIGITO[char]
  if (!acesos) {
    return (
      <span className="seg7-glifo" style={{ fontSize: size * 0.6, color }}>
        {char}
      </span>
    )
  }
  const style = { '--seg-size': `${size}px`, color } as CSSProperties
  return (
    <span className="seg7-digito" style={style}>
      {TODOS_OS_SEGMENTOS.map((s) => (
        <i key={s} className={`seg7-${s}${acesos.includes(s) ? ' on' : ''}`} />
      ))}
    </span>
  )
}

/** Uma sequência de caracteres como leitor de segmento — contador do placar, data do cabeçalho,
 *  placar final. Os segmentos ficam `aria-hidden` (são desenho, não texto); `label` carrega o
 *  valor pro leitor de tela numa única leitura. */
export function SevenSegmentDigits({
  value,
  color,
  size = 20,
  label,
}: {
  value: string
  color?: string
  size?: number
  label?: string
}) {
  return (
    <span className="seg7-grupo" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {value.split('').map((ch, i) => (
        <SevenSegmentDigit key={i} char={ch} color={color} size={size} />
      ))}
    </span>
  )
}
