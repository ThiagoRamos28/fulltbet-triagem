/** Confiança 1-5 em estrelas SVG (não Unicode ★/☆ — a fonte varia peso/tamanho por plataforma,
 *  desalinhando a fileira). Revertido pro vocabulário original depois do mundo "O Placar": o
 *  bargraph de células (tentativa da 1ª leva desta rodada) foi rejeitado pelo usuário na revisão
 *  ao vivo ("a barra de confiança não ficou legal, as estrelas eram melhores") — feedback direto
 *  de quem usa a página todo dia, prevalece sobre a tentativa de tradução pro novo vocabulário.
 *  Âmbar aqui não viola a Amber-Is-Status Rule do DESIGN.md: a silhueta de estrela nunca se
 *  confunde com o LED de status (formas diferentes), diferente do bargraph retangular que lia
 *  como "mais um status". Duas formas da mesma informação: fileira cheia (desktop) e forma
 *  compacta com número (abaixo de 560px), via .conf-full/.conf-mini no CSS. */
export function ConfidenceStars({ n, titulo }: { n: number; titulo: string }) {
  const estrelas = []
  for (let i = 1; i <= 5; i++) {
    estrelas.push(
      <svg key={i} className={i <= n ? 'on' : 'off'} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>,
    )
  }
  return (
    <span className="conf" role="img" aria-label={titulo} title={titulo}>
      <span className="conf-full">{estrelas}</span>
      <span className="conf-mini">
        <svg className={n > 0 ? 'on' : 'off'} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
        <span className="conf-num">{n}</span>
      </span>
    </span>
  )
}
