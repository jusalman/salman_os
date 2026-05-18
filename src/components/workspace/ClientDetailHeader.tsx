import { clientStatusLabel } from '../../domain/labels'
import type { ClientDetailHeaderModel } from '../../types'

type ClientDetailHeaderProps = {
  client: ClientDetailHeaderModel
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  return (
    <section className="client-header">
      <div>
        <p className="eyebrow">선택한 고객사</p>
        <h2>{client.name}</h2>
        <p className="client-memo">{client.memo}</p>
      </div>
      <div className="header-meta">
        <span className={`pill ${client.status}`}>{clientStatusLabel[client.status]}</span>
        <span>담당자: {client.owner}</span>
        <span>업데이트: {client.updatedAt}</span>
        <a href={client.driveRootUrl} target="_blank" rel="noreferrer">
          Drive 원본 열기
        </a>
      </div>
    </section>
  )
}
