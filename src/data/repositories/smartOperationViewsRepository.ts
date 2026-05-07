import type { SmartViews } from '../../domain/smartViews'

export type SmartOperationViewsRepository = {
  getSmartOperationViews: () => Promise<SmartViews>
}
