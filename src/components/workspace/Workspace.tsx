import type { WorkspaceView } from '../../types'
import { BusinessMoneyPanel } from './BusinessMoneyPanel'
import { ClientDetailHeaderSection } from './ClientDetailHeaderSection'
import { ClientTabs } from './ClientTabs'
import { FilesPanel } from './FilesPanel'
import { InternalSchedulePanel } from './InternalSchedulePanel'
import { LinksPanel } from './LinksPanel'
import { OperationLogsPanel } from './OperationLogsPanel'
import { SmartOperationViewsPanel } from './SmartOperationViewsPanel'
import { TasksPanel } from './TasksPanel'

type WorkspaceProps = {
  viewerName: string
  workspaceView: WorkspaceView
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

export function Workspace({
  viewerName,
  workspaceView,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
  const { listView, detailView } = workspaceView
  const { header, panels } = detailView
  const panelSections = [
    <FilesPanel key="files" files={panels.files} />,
    <TasksPanel key="tasks" tasks={panels.tasks} />,
    <InternalSchedulePanel key="schedule" scheduleItems={panels.schedule} />,
    <BusinessMoneyPanel key="money" moneyItems={panels.money} />,
    <LinksPanel key="links" links={panels.links} />,
    <OperationLogsPanel key="logs" logs={panels.logs} />,
  ]

  return (
    <section className="workspace">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">SALMAN OS</p>
          <h2>Internal client ops</h2>
          <p className="sidebar-copy">
            Signed in as <strong>{viewerName}</strong>
          </p>
        </div>
        <SmartOperationViewsPanel data={panels.smartViews} />
      </aside>

      <div className="main-pane">
        <header className="topbar">
          <div>
            <p className="eyebrow">v1 / Internal Staff MVP</p>
            <h1>Client operation center</h1>
          </div>
          <div className="topbar-notes">
            <span>Supabase = operational data</span>
            <span>Google Drive = source files</span>
            <span>No AI / No Google Calendar sync</span>
          </div>
        </header>

        <ClientTabs
          listView={listView}
          selectedClientId={selectedClientId}
          onSelect={onSelectClient}
        />

        <ClientDetailHeaderSection client={header} />

        <section className="panel-grid">
          {panelSections}
        </section>
      </div>
    </section>
  )
}
