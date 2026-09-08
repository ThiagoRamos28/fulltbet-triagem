import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ReferenciaRow } from '../types'

/** `referencia_perfil` guarda os quartis POR LADO (casa/fora não compartilham escala). Tabela
 *  pequena, atualizada 1×/dia — buscada uma vez só, em paralelo com a régua. */
export function useReferencia(): Record<string, ReferenciaRow> | null {
  const [ref, setRef] = useState<Record<string, ReferenciaRow> | null>(null)

  useEffect(() => {
    let cancelado = false
    supabase
      .from('referencia_perfil')
      .select('metrica,side,p25,mediana,p75,n')
      .then(({ data, error }) => {
        if (cancelado) return
        const linhas = error ? [] : ((data ?? []) as ReferenciaRow[])
        const mapa: Record<string, ReferenciaRow> = {}
        linhas.forEach((r) => {
          mapa[`${r.metrica}|${r.side}`] = r
        })
        setRef(mapa)
      })
    return () => {
      cancelado = true
    }
  }, [])

  return ref
}
