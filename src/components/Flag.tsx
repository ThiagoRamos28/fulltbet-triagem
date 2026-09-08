import { BANDEIRA_WEBP, PAIS_ISO } from '../lib/flags'

/** Bandeira (WebP embutida) ou, para país fora do mapa, a sigla em texto — nunca sumir. */
export function Flag({ pais }: { pais: string | null | undefined }) {
  const nome = pais || ''
  const iso = PAIS_ISO[nome]
  const img = iso && BANDEIRA_WEBP[iso]
  if (!img) {
    return (
      <span className="bandeira-txt" title={nome}>
        {(nome.slice(0, 3).toUpperCase() || '??')}
      </span>
    )
  }
  return (
    <img
      className="bandeira"
      width={24}
      height={16}
      decoding="async"
      alt={nome}
      title={nome}
      src={`data:image/webp;base64,${img}`}
    />
  )
}
