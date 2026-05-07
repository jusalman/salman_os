import type { ClientDetailRepository } from '../../repositories/clientDetailRepository'
import { readMockClientRecordById } from './clientRecordReadStore'

export const clientDetailMockRepository: ClientDetailRepository = {
  async getClientDetail(clientId) {
    return readMockClientRecordById(clientId)
  },
}
