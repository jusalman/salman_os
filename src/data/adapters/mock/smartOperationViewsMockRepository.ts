import type { SmartOperationViewsRepository } from '../../repositories/smartOperationViewsRepository'
import { buildSmartViews } from '../../../domain/smartViews'
import { readMockClientRecords } from './clientRecordReadStore'

export const smartOperationViewsMockRepository: SmartOperationViewsRepository = {
  async getSmartOperationViews() {
    return buildSmartViews(readMockClientRecords())
  },
}
