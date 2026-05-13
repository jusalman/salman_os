import { TODAY } from '../../../config/constants.ts'
import type { ClientListRepository } from '../../repositories/clientListRepository.ts'
import {
  assembleClientSummaryFromRows,
  type ClientSummaryEventRow,
  type ClientSummaryFileRow,
  type ClientSummaryLinkRow,
  type ClientSummaryLogRow,
  type ClientSummaryMemberRow,
  type ClientSummaryMoneyRow,
  type ClientSummaryTaskRow,
} from './clientSummaryAssembler.ts'
import {
  supabaseClientSummaryRowsReader,
  type ClientSummaryRowsReader,
} from './clientRowsReader.ts'

type ClientOwnedSummaryRow =
  | ClientSummaryMemberRow
  | ClientSummaryTaskRow
  | ClientSummaryEventRow
  | ClientSummaryFileRow
  | ClientSummaryMoneyRow
  | ClientSummaryLinkRow
  | ClientSummaryLogRow

export type ClientListSupabaseRepositoryOptions = {
  rowsReader?: ClientSummaryRowsReader
  getReferenceDate?: () => string
}

export function createClientListSupabaseRepository({
  rowsReader = supabaseClientSummaryRowsReader,
  getReferenceDate = () => TODAY,
}: ClientListSupabaseRepositoryOptions = {}): ClientListRepository {
  return {
    async listClientSummaries() {
      const clients = await rowsReader.listClients()
      const clientIds = clients.map((client) => client.id)

      if (clientIds.length === 0) {
        return []
      }

      const [members, tasks, events, files, moneyItems, links, logs] = await Promise.all([
        rowsReader.listMembers(clientIds),
        rowsReader.listTasks(clientIds),
        rowsReader.listEvents(clientIds),
        rowsReader.listFiles(clientIds),
        rowsReader.listMoneyItems(clientIds),
        rowsReader.listLinks(clientIds),
        rowsReader.listLogs(clientIds),
      ])
      const referenceDate = getReferenceDate()
      const membersByClientId = groupRowsByClientId(members)
      const tasksByClientId = groupRowsByClientId(tasks)
      const eventsByClientId = groupRowsByClientId(events)
      const filesByClientId = groupRowsByClientId(files)
      const moneyItemsByClientId = groupRowsByClientId(moneyItems)
      const linksByClientId = groupRowsByClientId(links)
      const logsByClientId = groupRowsByClientId(logs)

      return clients.map((client) =>
        assembleClientSummaryFromRows({
          client,
          referenceDate,
          members: membersByClientId.get(client.id),
          tasks: tasksByClientId.get(client.id),
          events: eventsByClientId.get(client.id),
          files: filesByClientId.get(client.id),
          moneyItems: moneyItemsByClientId.get(client.id),
          links: linksByClientId.get(client.id),
          logs: logsByClientId.get(client.id),
        }),
      )
    },
  }
}

export const clientListSupabaseReadRepository = createClientListSupabaseRepository()

function groupRowsByClientId<T extends ClientOwnedSummaryRow>(rows: T[]): Map<string, T[]> {
  return rows.reduce((rowsByClientId, row) => {
    const existingRows = rowsByClientId.get(row.client_id) ?? []
    existingRows.push(row)
    rowsByClientId.set(row.client_id, existingRows)
    return rowsByClientId
  }, new Map<string, T[]>())
}
