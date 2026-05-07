import type { SmartViews as SmartViewsData } from '../../domain/smartViews'
import type { ClientRecord, ClientSummary, WorkspaceView } from '../../types'
import { projectClientListView } from './clientListView'
import { projectSelectedClientDetailView } from './selectedClientDetailView'

type ProjectWorkspaceViewParams = {
  clients: ClientSummary[]
  selectedClient: ClientRecord | null
  smartViews: SmartViewsData | null
}

export function projectWorkspaceView({
  clients,
  selectedClient,
  smartViews,
}: ProjectWorkspaceViewParams): WorkspaceView | null {
  if (!selectedClient || !smartViews) {
    return null
  }

  return {
    listView: projectClientListView(clients),
    detailView: projectSelectedClientDetailView(selectedClient, smartViews),
  }
}
