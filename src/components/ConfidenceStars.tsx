/** Confiança 1-5 em âncoras SVG (não Unicode ⚓ — a fonte varia peso/tamanho por plataforma,
 *  desalinhando a fileira). O glifo trocou de estrela pra âncora na direção "Carta de Navegação"
 *  (canvas de 09/09) — a API do componente e as classes CSS (.conf, .conf-full, .conf-mini)
 *  continuam as mesmas do mundo anterior, só o desenho interno do SVG mudou. Duas formas da mesma
 *  informação: fileira cheia (desktop) e forma compacta com número (abaixo de 560px), via
 *  .conf-full/.conf-mini no CSS. */
const ANCORA_PATH =
  'M6 0 L7.5 3.5 L6 9.5 4.5 3.5 Z M2.5 5 Q1 6.5 2 8.5 Q4 9.3 6 9.5 Q3.5 7.5 2.5 5 Z M9.5 5 Q11 6.5 10 8.5 Q8 9.3 6 9.5 Q8.5 7.5 9.5 5 Z'

export function ConfidenceStars({ n, titulo }: { n: number; titulo: string }) {
  const ancoras = []
  for (let i = 1; i <= 5; i++) {
    ancoras.push(
      <svg key={i} className={i <= n ? 'on' : 'off'} width="10" height="9" viewBox="0 0 12 10" aria-hidden="true">
        <path d={ANCORA_PATH} />
      </svg>,
    )
  }
  return (
    <span className="conf" role="img" aria-label={titulo} title={titulo}>
      <span className="conf-full">{ancoras}</span>
      <span className="conf-mini">
        <svg className={n > 0 ? 'on' : 'off'} width="10" height="9" viewBox="0 0 12 10" aria-hidden="true">
          <path d={ANCORA_PATH} />
        </svg>
        <span className="conf-num">{n}</span>
      </span>
    </span>
  )
}
