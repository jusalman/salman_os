import type { ClientSummary } from '../../types'

export type ClientListRepository = {
  listClientSummaries: () => Promise<ClientSummary[]>
}
