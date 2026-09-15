// Tipos das linhas que vêm das tabelas/views do Supabase consultadas pela página.
// Inferidos dos SELECTs do index.html legado — todos os campos numéricos podem vir `null`
// quando a base ainda não tem dado suficiente para aquele jogo/métrica.

/** Campos comuns às cinco tabelas (resultado bruto do placar + resolução). */
export interface JogoBase {
  pais: string | null
  mandante: string
  visitante: string
  competicao?: string | null
  has_result: boolean
  gols_casa_ft: number | null
  gols_visitante_ft: number | null
  gols_casa_ht?: number | null
  gols_visitante_ht?: number | null
  /** calculado no cliente a partir do placar bruto (overHt/overFt), não vem do banco */
  bateu?: boolean
}

/** Campos de perfil ofensivo/defensivo dos últimos 10 jogos — presentes em `triagem` e em
 *  `lay_visitante_diario`. */
export interface PerfilFields {
  gols_pro_media_ft_casa?: number | null
  gols_contra_media_ft_casa?: number | null
  gols_pro_media_ft_fora?: number | null
  gols_contra_media_ft_fora?: number | null
  cv_gols_pro_ft_casa?: number | null
  cv_gols_pro_ft_fora?: number | null
  cv_gols_contra_ft_casa?: number | null
  cv_gols_contra_ft_fora?: number | null
  gols_media_ht_casa?: number | null
  gols_media_ht_fora?: number | null
  cv_gols_pro_ht_casa?: number | null
  cv_gols_pro_ht_fora?: number | null
  custo_gol_10_ft_casa?: number | null
  custo_gol_10_ft_fora?: number | null
  cv_custo_gol_10_ft_casa?: number | null
  cv_custo_gol_10_ft_fora?: number | null
}

/** `triagem` — Farol e Bússola têm seção própria na página (flag_q/flag_t). `flag_s` (Sonar)
 *  continua na tabela, ainda usado pelo Radar/Sextante no alerta ao vivo, mas Sonar em si foi
 *  descontinuado por dado em 2026-09-15 (ver docs/hipoteses-congeladas) e saiu da página. */
export interface TriagemRow extends JogoBase, PerfilFields {
  horario_brasilia: string // timestamptz
  odd_ht_over?: number | null
  margem_ht?: number | null
  lg_casa?: number | null
  lg_fora?: number | null
  h_score?: number | null
}

/** `lay0x1_diario` — protocolo v1/I. */
export interface Lay0x1Row extends JogoBase {
  horario_brasilia: string // timestamp without time zone (naive, já em hora de Brasília)
  passa_v1?: boolean | null
  passa_i?: boolean | null
  odd_casa_ft?: number | null
  odd_vis_ft?: number | null
  odd_over25?: number | null
  h_score?: number | null
}

/** `lay_visitante_diario` — lay no visitante quando a casa é favorita. */
export interface LayVisRow extends JogoBase, PerfilFields {
  horario_brasilia: string // timestamptz
  lg_casa?: number | null
  lg_fora?: number | null
  h_score?: number | null
  odds_home?: number | null
}

/** `regua_confianca` — uma régua (piso/teto → estrelas) por seção que tem estrela própria. */
export interface ReguaRow {
  secao: string
  campo: string
  ordem: number
  evento: string
  estrelas: number
  piso: number
  teto: number | null
  n: number
  taxa: number // fração 0-1
}

/** `referencia_perfil` — quartis por métrica e lado (casa/fora), usados para colorir o perfil. */
export interface ReferenciaRow {
  metrica: string
  side: 'casa' | 'fora'
  p25: number | null
  mediana: number | null
  p75: number | null
  n: number
}

export type Secao = 'bussola' | 'layvis'

export interface FaixaEstrela {
  n: number
  taxa: number // percentual arredondado (0-100)
  amostra: number
  evento: string
}

export interface StatusInfo {
  cls: 'pend' | 'ok' | 'miss'
  texto: 'Aguardando' | 'Bateu' | 'Não bateu'
}
