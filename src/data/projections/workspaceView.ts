import type { ClientRecord, ClientSummary, WorkspaceView } from '../../types'
import { projectClientListView } from './clientListView'
import { projectSelectedClientDetailView } from './selectedClientDetailView'

type ProjectWorkspaceViewParams = {
  clients: ClientSummary[]
  selectedClient: ClientRecord | null
}

export function projectWorkspaceView({
  clients,
  selectedClient,
}: ProjectWorkspaceViewParams): WorkspaceView | null {
  if (!selectedClient) {
    return null
  }

  return {
    listView: projectClientListView(clients),
    detailView: projectSelectedClientDetailView(selectedClient),
  }
}
