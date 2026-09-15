import type { FaixaEstrela, JogoBase, ReferenciaRow, ReguaRow, Secao, StatusInfo } from '../types'

export function hojeBrasilia(): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return fmt.format(new Date())
}

/** "timestamp without time zone" do Postgres, já em hora local de Brasília — nunca passar por
 *  `new Date()` aqui, o navegador reinterpretaria como UTC ou hora local dele. */
export function horaDeNaive(s: string | null | undefined): string {
  if (!s) return '--:--'
  const m = s.match(/T(\d{2}):(\d{2})/)
  return m ? `${m[1]}:${m[2]}` : '--:--'
}

export function horaDeTimestamptz(s: string | null | undefined): string {
  if (!s) return '--:--'
  const d = new Date(s)
  return d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
}

/** Odd justa a cada minuto, supondo 0x0 e taxa constante. Só válido até 15' — depois disso o
 *  decaimento uniforme fica pessimista demais (curva real medida em
 *  docs/2026-07-30-curva-de-odd-ao-vivo-st-gallen-zurich.md). */
export function decay(over: number, under: number): string[] {
  const p = 1 / over / (1 / over + 1 / under)
  const lam = -Math.log(1 - p)
  return [5, 10, 15].map((t) => (1 / (1 - Math.exp((-lam * (45 - t)) / 45))).toFixed(2))
}

export function oddJusta(j: { odd_ht_over?: number | null; margem_ht?: number | null }): string[] | null {
  if (!j.odd_ht_over || !j.margem_ht) return null
  const under = 1 / (j.margem_ht - 1 / j.odd_ht_over)
  if (!isFinite(under) || under <= 0) return null
  return decay(j.odd_ht_over, under)
}

export function statusDe(j: JogoBase): StatusInfo {
  if (!j.has_result) return { cls: 'pend', texto: 'Aguardando' }
  return j.bateu ? { cls: 'ok', texto: 'Bateu' } : { cls: 'miss', texto: 'Não bateu' }
}

export function placarTexto(j: JogoBase): string | null {
  if (j.gols_casa_ft == null || j.gols_visitante_ft == null) return null
  return `${j.gols_casa_ft}×${j.gols_visitante_ft}`
}

export function placarHtTexto(j: { gols_casa_ht?: number | null; gols_visitante_ht?: number | null }): string | null {
  if (j.gols_casa_ht == null || j.gols_visitante_ht == null) return null
  return `${j.gols_casa_ht}×${j.gols_visitante_ht}`
}

/** Evento de cada alerta, calculado em cima do placar bruto. Farol prevê over 0.5 HT;
 *  Bússola prevê over 1.5 FT. */
export function overHt(j: { gols_casa_ht?: number | null; gols_visitante_ht?: number | null }): boolean {
  return Number(j.gols_casa_ht || 0) + Number(j.gols_visitante_ht || 0) >= 1
}
export function overFt(j: { gols_casa_ft: number | null; gols_visitante_ft: number | null }): boolean {
  return Number(j.gols_casa_ft || 0) + Number(j.gols_visitante_ft || 0) >= 2
}

export function num(v: number | null | undefined, casas = 2): string {
  if (v == null) return '–'
  return Number(v).toFixed(casas).replace('.', ',')
}

/** `valor` já vem no campo que aquela régua usa (LG somado na Bússola, odd da casa no Lay). */
export function estrelasPara(regua: Record<Secao, ReguaRow[]> | null, secao: Secao, valor: number | null): FaixaEstrela | null {
  if (valor == null || !regua || !regua[secao]) return null
  const faixa = regua[secao].find((r) => Number(valor) >= Number(r.piso) && (r.teto == null || Number(valor) < Number(r.teto)))
  if (!faixa) return null
  return { n: faixa.estrelas, taxa: Math.round(faixa.taxa * 100), amostra: faixa.n, evento: faixa.evento }
}

/** Cada seção sabe de onde tirar o número que a régua dela gradua. */
export function valorDaRegua(secao: Secao, j: { lg_casa?: number | null; lg_fora?: number | null; odds_home?: number | null }): number | null {
  if (secao === 'bussola') {
    return j.lg_casa != null && j.lg_fora != null ? Number(j.lg_casa) + Number(j.lg_fora) : null
  }
  if (secao === 'layvis') return j.odds_home != null ? Number(j.odds_home) : null
  return null
}

/** Devolve 'q-alto' / 'q-baixo' / '' comparando com os quartis do próprio lado. */
export function faixaDe(ref: Record<string, ReferenciaRow> | null, metrica: string, side: 'casa' | 'fora', valor: number | null | undefined): 'q-alto' | 'q-baixo' | '' {
  if (valor == null || !ref) return ''
  const r = ref[`${metrica}|${side}`]
  if (!r || r.p25 == null || r.p75 == null) return ''
  if (Number(valor) >= Number(r.p75)) return 'q-alto'
  if (Number(valor) <= Number(r.p25)) return 'q-baixo'
  return ''
}

export interface Esperados {
  casa: number
  fora: number
  total: number
}

/** Gols esperados por cruzamento: ataque de cada time somado à defesa do adversário, ÷2. */
export function esperados(j: PerfilLike): Esperados | null {
  const ac = j.gols_pro_media_ft_casa
  const dc = j.gols_contra_media_ft_casa
  const af = j.gols_pro_media_ft_fora
  const df = j.gols_contra_media_ft_fora
  if (ac == null || dc == null || af == null || df == null) return null
  const casa = (Number(ac) + Number(df)) / 2
  const fora = (Number(af) + Number(dc)) / 2
  return { casa, fora, total: casa + fora }
}

interface PerfilLike {
  gols_pro_media_ft_casa?: number | null
  gols_contra_media_ft_casa?: number | null
  gols_pro_media_ft_fora?: number | null
  gols_contra_media_ft_fora?: number | null
}

export function deslocarDia(dataStr: string, n: number): string {
  const partes = dataStr.split('-').map(Number)
  const d = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]))
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
