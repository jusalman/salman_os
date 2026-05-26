import { clientStatusLabel } from '../../domain/labels'
import type { ClientListView } from '../../types'

type ClientTabsProps = {
  listView: ClientListView
  selectedClientId: string
  onSelect: (clientId: string) => void
}

export function ClientTabs({ listView, selectedClientId, onSelect }: ClientTabsProps) {
  return (
    <section className="client-strip">
      {listView.items.map((client) => (
        <button
          key={client.id}
          type="button"
          className={client.id === selectedClientId ? 'client-chip active' : 'client-chip'}
          onClick={() => onSelect(client.id)}
        >
          <div className="client-chip-title">
            <strong>{client.name}</strong>
            <span className={`status-badge ${client.status}`}>{clientStatusLabel[client.status]}</span>
          </div>
          <div className="client-chip-meta">
            <span>{`업무 ${client.openTaskCount}`}</span>
            <span>{`일정 ${client.upcomingEventCount}`}</span>
            <span>{client.hasBizMoneyWarning ? '비즈머니 확인' : '비즈머니 정상'}</span>
          </div>
          <div className="client-chip-flags">
            {client.hasDriveFolder ? <span>드라이브</span> : null}
            {client.hasLookerLink ? <span>루커</span> : null}
            {client.hasSheetLink ? <span>시트</span> : null}
            {client.latestLogAt ? <span>{client.latestLogAt}</span> : null}
          </div>
        </button>
      ))}
    </section>
  )
}
