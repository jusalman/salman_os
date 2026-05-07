import type { SmartViews as SmartViewsData } from '../../domain/smartViews'
import { SmartViews } from './SmartViews'

type SmartOperationViewsPanelProps = {
  data: SmartViewsData
}

export function SmartOperationViewsPanel({ data }: SmartOperationViewsPanelProps) {
  return <SmartViews data={data} />
}
