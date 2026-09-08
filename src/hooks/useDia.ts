import { useMemo, useState } from 'react'
import { deslocarDia, hojeBrasilia } from '../lib/format'

/** Navegação hoje/ontem/anteontem — mesma janela da policy de RLS (3 dias). */
export function useDia() {
  const hoje = useMemo(() => hojeBrasilia(), [])
  const janela = useMemo(() => [deslocarDia(hoje, -2), deslocarDia(hoje, -1), hoje], [hoje])
  const [indice, setIndice] = useState(2) // começa em "hoje"

  const dataRef = janela[indice]
  const rotulo = dataRef.split('-').reverse().join('/')
  const tag = dataRef === hoje ? 'hoje' : dataRef === deslocarDia(hoje, -1) ? 'ontem' : 'anteontem'

  return {
    dataRef,
    rotulo,
    tag,
    podeVoltar: indice > 0,
    podeAvancar: indice < janela.length - 1,
    prev: () => setIndice((i) => Math.max(0, i - 1)),
    next: () => setIndice((i) => Math.min(janela.length - 1, i + 1)),
  }
}
