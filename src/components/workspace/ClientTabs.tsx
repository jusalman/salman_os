import { clientStatusLabel } from '../../domain/labels'
import type { ClientSummary } from '../../types'

type ClientTabsProps = {
  clients: ClientSummary[]
  selectedClientId: string
  onSelect: (clientId: string) => void
}

export function ClientTabs({ clients, selectedClientId, onSelect }: ClientTabsProps) {
  return (
    <section className="client-strip">
      {clients.map((client) => (
        <button
          key={client.id}
          type="button"
          className={client.id === selectedClientId ? 'client-chip active' : 'client-chip'}
          onClick={() => onSelect(client.id)}
        >
          <strong>{client.name}</strong>
          <span>{clientStatusLabel[client.status]}</span>
        </button>
      ))}
    </section>
  )
}
