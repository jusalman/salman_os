import type { ClientListRepository } from '../../repositories/clientListRepository'
import { projectClientSummary } from '../../projections/clientSummary'
import { readMockClientRecords } from './clientRecordReadStore'

export const clientListMockRepository: ClientListRepository = {
  async listClientSummaries() {
    return readMockClientRecords().map((client) =>
      projectClientSummary(client, {
        tasks: client.tasks,
        events: client.events,
        files: client.files,
        moneyItems: client.moneyItems,
        links: client.links,
        logs: client.logs,
      }),
    )
  },
}
