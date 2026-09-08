/** Rodapé do detalhe: país por extenso + campeonato quando a tabela tem (só `triagem` tem
 *  `competicao`; as duas de Lay não têm a coluna). */
export function Meta({ pais, competicao }: { pais?: string | null; competicao?: string | null }) {
  const partes = [pais, competicao].filter(Boolean)
  if (!partes.length) return null
  return <div className="linha meta">{partes.join(' · ')}</div>
}
