import type { ClientListView, ClientSummary } from '../../types'
import { projectClientListItem } from './clientListItem'

export function projectClientListView(clients: ClientSummary[]): ClientListView {
  const items = clients.map(projectClientListItem)

  return {
    items,
    totalCount: items.length,
  }
}
