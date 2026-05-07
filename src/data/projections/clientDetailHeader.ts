import type { ClientDetailHeaderModel, ClientRecord } from '../../types'

export function projectClientDetailHeader(client: ClientRecord): ClientDetailHeaderModel {
  return {
    id: client.id,
    name: client.name,
    status: client.status,
    owner: client.owner,
    driveRootUrl: client.driveRootUrl,
    memo: client.memo,
    updatedAt: client.updatedAt,
  }
}
