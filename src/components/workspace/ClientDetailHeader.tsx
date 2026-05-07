import { clientStatusLabel } from '../../domain/labels'
import type { ClientDetailHeaderModel } from '../../types'

type ClientDetailHeaderProps = {
  client: ClientDetailHeaderModel
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  return (
    <section className="client-header">
      <div>
        <p className="eyebrow">Selected client</p>
        <h2>{client.name}</h2>
        <p className="client-memo">{client.memo}</p>
      </div>
      <div className="header-meta">
        <span className={`pill ${client.status}`}>{clientStatusLabel[client.status]}</span>
        <span>Owner: {client.owner}</span>
        <span>Updated: {client.updatedAt}</span>
        <a href={client.driveRootUrl} target="_blank" rel="noreferrer">
          Open Drive Root
        </a>
      </div>
    </section>
  )
}
