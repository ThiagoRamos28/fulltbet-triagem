import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ReguaRow, Secao } from '../types'

/** Régua de confiança (soma dos LG-Score → estrelas), uma por seção que tem estrela própria
 *  (bussola, layvis). Tabela pequena, atualizada 1×/dia — buscada uma vez só, não por seção. */
export function useRegua(): Record<Secao, ReguaRow[]> | null {
  const [regua, setRegua] = useState<Record<Secao, ReguaRow[]> | null>(null)

  useEffect(() => {
    let cancelado = false
    supabase
      .from('regua_confianca')
      .select('secao,campo,ordem,evento,estrelas,piso,teto,n,taxa')
      .order('estrelas', { ascending: true })
      .then(({ data, error }) => {
        if (cancelado) return
        const linhas = error ? [] : ((data ?? []) as ReguaRow[])
        const agrupado = {} as Record<Secao, ReguaRow[]>
        linhas.forEach((r) => {
          const secao = r.secao as Secao
          ;(agrupado[secao] = agrupado[secao] || []).push(r)
        })
        setRegua(agrupado)
      })
    return () => {
      cancelado = true
    }
  }, [])

  return regua
}
