import { esperados, faixaDe, num } from '../lib/format'
import type { PerfilFields, ReferenciaRow } from '../types'

interface LinhaPerfil {
  rot: string
  eco: string
  m: string
  cc: keyof PerfilFields
  cf: keyof PerfilFields
  vc: keyof PerfilFields
  vf: keyof PerfilFields
  casas: number
}

// O custo do gol 2.0 saiu da lista (redundante com gols marcados, r=0,99). Primeiro tempo entrou
// no lugar — é o recorte do evento que Farol e Sonar preveem (over 0.5 HT).
const LINHAS_PERFIL: LinhaPerfil[] = [
  { rot: 'Gols marcados', eco: '(faz)', m: 'gols_pro', cc: 'gols_pro_media_ft_casa', cf: 'gols_pro_media_ft_fora', vc: 'cv_gols_pro_ft_casa', vf: 'cv_gols_pro_ft_fora', casas: 2 },
  { rot: 'Gols sofridos', eco: '(leva)', m: 'gols_contra', cc: 'gols_contra_media_ft_casa', cf: 'gols_contra_media_ft_fora', vc: 'cv_gols_contra_ft_casa', vf: 'cv_gols_contra_ft_fora', casas: 2 },
  { rot: 'Gols no 1º tempo', eco: '', m: 'gols_pro_ht', cc: 'gols_media_ht_casa', cf: 'gols_media_ht_fora', vc: 'cv_gols_pro_ht_casa', vf: 'cv_gols_pro_ht_fora', casas: 2 },
  { rot: 'Custo do gol 1.0', eco: '', m: 'custo_gol_10', cc: 'custo_gol_10_ft_casa', cf: 'custo_gol_10_ft_fora', vc: 'cv_custo_gol_10_ft_casa', vf: 'cv_custo_gol_10_ft_fora', casas: 2 },
]

function Cel({ valor, cv, side, metrica, referencia }: { valor: number | null | undefined; cv: number | null | undefined; side: 'casa' | 'fora'; metrica: string; referencia: Record<string, ReferenciaRow> | null }) {
  const q = faixaDe(referencia, metrica, side, valor)
  const titulo = q === 'q-alto' ? 'No quarto mais alto entre os times do mesmo lado' : q === 'q-baixo' ? 'No quarto mais baixo entre os times do mesmo lado' : undefined
  return (
    <td>
      <span className={q} title={titulo}>
        {num(valor, 2)}
        {q ? <span className="marca" aria-hidden="true" /> : null}
      </span>
      {cv != null ? (
        <>
          <br />
          <span className="cv">cv {num(cv, 2)}</span>
        </>
      ) : null}
    </td>
  )
}

/** Perfil ofensivo/defensivo dos últimos 10 jogos: o cruzamento (gols esperados) primeiro — é a
 *  leitura que separa os grupos —, a tabela crua depois, como memória de cálculo. */
export function Perfil({ j, referencia, mandante, visitante }: { j: PerfilFields; referencia: Record<string, ReferenciaRow> | null; mandante: string; visitante: string }) {
  if (j.custo_gol_10_ft_casa == null && j.gols_pro_media_ft_casa == null) return null
  const temRef = referencia && Object.keys(referencia).length > 0
  const e = esperados(j)
  const qTotal = e ? faixaDe(referencia, 'esperado_total', 'casa', e.total) : ''

  return (
    <div className="perfil">
      <div className="perfil-tit">Perfil dos últimos 10 jogos</div>
      {e ? (
        <div className="cruz">
          <div className="cruz-lado">
            <div className="cruz-topo">
              <span className="cruz-time">{mandante}</span>
              <span className="cruz-num">{num(e.casa, 2)}</span>
            </div>
            <div className="cruz-conta">
              <b>{num(j.gols_pro_media_ft_casa, 2)}</b> que ele faz + <b>{num(j.gols_contra_media_ft_fora, 2)}</b> que o {visitante} leva, dividido por 2
            </div>
          </div>
          <div className="cruz-lado">
            <div className="cruz-topo">
              <span className="cruz-time">{visitante}</span>
              <span className="cruz-num">{num(e.fora, 2)}</span>
            </div>
            <div className="cruz-conta">
              <b>{num(j.gols_pro_media_ft_fora, 2)}</b> que ele faz + <b>{num(j.gols_contra_media_ft_casa, 2)}</b> que o {mandante} leva, dividido por 2
            </div>
          </div>
          <div className="cruz-tot">
            <span className="cruz-tot-rot">Gols esperados no jogo</span>
            <span className={`cruz-num ${qTotal}`}>
              {num(e.total, 2)}
              <span className="marca" aria-hidden="true" />
            </span>
            {temRef ? <span className="cruz-ref">mediana do dia {num(referencia!['esperado_total|casa']?.mediana, 2)}</span> : null}
          </div>
        </div>
      ) : null}

      <table>
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">{mandante} (casa)</th>
            <th scope="col">{visitante} (fora)</th>
          </tr>
        </thead>
        <tbody>
          {LINHAS_PERFIL.map((L) => (
            <tr key={L.m}>
              <th scope="row">
                {L.rot} {L.eco ? <span className="rot-eco">{L.eco}</span> : null}
              </th>
              <Cel valor={j[L.cc]} cv={j[L.vc]} side="casa" metrica={L.m} referencia={referencia} />
              <Cel valor={j[L.cf]} cv={j[L.vf]} side="fora" metrica={L.m} referencia={referencia} />
            </tr>
          ))}
        </tbody>
      </table>

      <p className="legenda">
        {temRef ? (
          <>
            <span className="q-alto">
              <span className="marca" />
            </span>{' '}
            quarto mais alto ·{' '}
            <span className="q-baixo">
              <span className="marca" />
            </span>{' '}
            quarto mais baixo, sempre entre times do mesmo lado — mandante e visitante não jogam na mesma escala. Se isso é bom ou ruim depende do que
            você procura: sofrer muito gol ajuda um over e atrapalha um lay.{' '}
          </>
        ) : (
          <span className="sem-ref">Sem referência de escala ainda (a comparação por quartil aparece quando a base acumular). </span>
        )}
        <b>cv</b> mede regularidade: quanto menor, mais o time repete o mesmo jogo.
        <br />
        <b>Custo 1.0</b> é gols × odd: sobe com o preço, não só com o ataque.
      </p>
    </div>
  )
}
