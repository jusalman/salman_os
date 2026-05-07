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

export function projectSelectedClientDetailView(client: ClientRecord): SelectedClientDetailView {
  return {
    header: projectClientDetailHeader(client),
    files: projectClientFilePanelItems(client),
    tasks: projectClientTaskPanelItems(client),
    scheduleItems: projectClientSchedulePanelItems(client),
    moneyItems: projectClientMoneyPanelItems(client),
    links: projectClientLinkPanelItems(client),
    logs: projectClientLogPanelItems(client),
  }
}
