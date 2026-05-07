import type { ClientRecord } from '../../types'

export type ClientDetailRepository = {
  getClientDetail: (clientId: string) => Promise<ClientRecord | undefined>
}
