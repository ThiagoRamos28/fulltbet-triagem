export function DayNav({
  rotulo,
  tag,
  podeVoltar,
  podeAvancar,
  onPrev,
  onNext,
}: {
  rotulo: string
  tag: string
  podeVoltar: boolean
  podeAvancar: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="dia-nav">
      <button type="button" aria-label="Dia anterior" disabled={!podeVoltar} onClick={onPrev}>
        ‹
      </button>
      <span className="rotulo" aria-live="polite">
        <span className="mono">{rotulo}</span>
        <span className="tag">{tag}</span>
      </span>
      <button type="button" aria-label="Próximo dia" disabled={!podeAvancar} onClick={onNext}>
        ›
      </button>
    </div>
  )
}
