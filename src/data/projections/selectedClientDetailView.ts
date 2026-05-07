import type { SmartViews as SmartViewsData } from '../../domain/smartViews'
import type { ClientRecord, SelectedClientDetailView } from '../../types'
import { projectClientDetailHeader } from './clientDetailHeader'
import {
  projectClientFilePanelItems,
  projectClientLinkPanelItems,
  projectClientLogPanelItems,
  projectClientMoneyPanelItems,
  projectClientSchedulePanelItems,
  projectClientTaskPanelItems,
} from './clientDetailPanels'

export function projectSelectedClientDetailView(
  client: ClientRecord,
  smartViews: SmartViewsData,
): SelectedClientDetailView {
  return {
    header: projectClientDetailHeader(client),
    panels: {
      files: projectClientFilePanelItems(client),
      tasks: projectClientTaskPanelItems(client),
      schedule: projectClientSchedulePanelItems(client),
      money: projectClientMoneyPanelItems(client),
      links: projectClientLinkPanelItems(client),
      logs: projectClientLogPanelItems(client),
      smartViews,
    },
  }
}
