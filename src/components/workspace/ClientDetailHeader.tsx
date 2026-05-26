import { clientStatusLabel } from '../../domain/labels'
import type { ClientDetailHeaderModel } from '../../types'

type ClientDetailHeaderProps = {
  client: ClientDetailHeaderModel
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  return (
    <section className="client-header">
      <div>
        <p className="eyebrow">선택 고객사</p>
        <h2>{client.name}</h2>
        <p className="client-memo">{client.memo}</p>
      </div>
      <div className="header-meta">
        <span className={`status-badge ${client.status}`}>{clientStatusLabel[client.status]}</span>
        <span>담당자 {client.owner}</span>
        <span>최근 업데이트 {client.updatedAt}</span>
        <a className="action-link" href={client.driveRootUrl} target="_blank" rel="noreferrer">
          원본 폴더 열기
        </a>
      </div>
    </section>
  )
}
