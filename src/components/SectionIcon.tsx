export type SecaoIcone = 'lay0x1' | 'bussola' | 'layvis' | 'farol' | 'sonar'

/** Ícone de instrumento ao lado do título de cada seção — a direção "Carta de Navegação" (canvas
 *  de 09/09) usa os próprios nomes das seções como pretexto: Bússola vira bússola de verdade,
 *  Farol vira farol, Sonar vira sonar. Lay 0×1 e Lay Visitante não têm instrumento homônimo,
 *  ganharam um ícone genérico de rumo/proteção coerente com o resto do traço (stroke, não fill). */
export function SectionIcon({ tipo }: { tipo: SecaoIcone }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true as const,
  }
  let svg: React.ReactNode
  switch (tipo) {
    case 'bussola':
      svg = (
        <svg {...common} viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="11" strokeWidth="1.6" />
          <path d="M13 4 L15.4 11.6 L13 13 L10.6 11.6 Z" fill="currentColor" stroke="none" />
          <path d="M13 22 L10.6 14.4 L13 13 L15.4 14.4 Z" fill="currentColor" stroke="none" opacity="0.45" />
        </svg>
      )
      break
    case 'farol':
      svg = (
        <svg {...common}>
          <path d="M9 21h6M10 21V9h4v12M8 9l1.2-5h5.6L16 9M12 2v2" />
          <path d="M16.5 8 L22 5.5 M16.5 8 L22 8 M16.5 8 L22 10.5" opacity="0.55" />
        </svg>
      )
      break
    case 'sonar':
      svg = (
        <svg {...common}>
          <path d="M12 3v6M12 21v-3M12 12l6-3.5" />
          <circle cx="12" cy="12" r="9" opacity="0.5" />
          <circle cx="12" cy="12" r="5" opacity="0.75" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )
      break
    case 'layvis':
      svg = (
        <svg {...common}>
          <path d="M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11Z" />
          <circle cx="12" cy="10" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      )
      break
    default:
      svg = (
        <svg {...common}>
          <path d="M4 12 L20 12 M4 12 L9 6 M4 12 L9 18" />
          <circle cx="20" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      )
  }
  return (
    <span className="sec-icon" aria-hidden="true">
      {svg}
    </span>
  )
}
