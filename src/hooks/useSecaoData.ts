import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface SecaoDataState<T> {
  linhas: T[]
  carregando: boolean
  erro: string | null
}

/** Busca as linhas de uma tabela/view do dia de referência, com filtros extras opcionais
 *  (ex.: `{ flag_q: true }` para o Farol). Uma query por seção, igual ao legado. */
export function useSecaoData<T>(tabela: string, dataRef: string, extraEq?: Record<string, boolean>): SecaoDataState<T> {
  const [state, setState] = useState<SecaoDataState<T>>({ linhas: [], carregando: true, erro: null })

  useEffect(() => {
    let cancelado = false
    setState((s) => ({ ...s, carregando: true }))
    let query = supabase.from(tabela).select('*').eq('data', dataRef).order('horario_brasilia', { ascending: true })
    if (extraEq) {
      for (const [k, v] of Object.entries(extraEq)) query = query.eq(k, v)
    }
    query.then(({ data, error }) => {
      if (cancelado) return
      if (error) {
        setState({ linhas: [], carregando: false, erro: `Erro ao carregar: ${error.message}` })
        return
      }
      setState({ linhas: (data ?? []) as T[], carregando: false, erro: null })
    })
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela, dataRef, JSON.stringify(extraEq ?? {})])

  return state
}
