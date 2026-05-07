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
          <strong>{client.name}</strong>
          <span>{clientStatusLabel[client.status]}</span>
          <div className="client-chip-meta">
            <span>{`Tasks ${client.openTaskCount}`}</span>
            <span>{`Events ${client.upcomingEventCount}`}</span>
            <span>{client.hasBizMoneyWarning ? 'Biz warning' : 'Biz clear'}</span>
          </div>
          <div className="client-chip-flags">
            {client.hasDriveFolder ? <span>Drive</span> : null}
            {client.hasLookerLink ? <span>Looker</span> : null}
            {client.hasSheetLink ? <span>Sheet</span> : null}
            {client.latestLogAt ? <span>{client.latestLogAt}</span> : null}
          </div>
        </button>
      ))}
    </section>
  )
}
