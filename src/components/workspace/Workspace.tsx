import type { SmartViews as SmartViewsData } from '../../domain/smartViews'
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
  smartViews: SmartViewsData
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

export function Workspace({
  viewerName,
  workspaceView,
  smartViews,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
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
        <SmartOperationViewsPanel data={smartViews} />
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
          listView={workspaceView.listView}
          selectedClientId={selectedClientId}
          onSelect={onSelectClient}
        />

        <ClientDetailHeaderSection client={workspaceView.detailView.header} />

        <section className="panel-grid">
          <FilesPanel files={workspaceView.detailView.files} />
          <TasksPanel tasks={workspaceView.detailView.tasks} />
          <InternalSchedulePanel scheduleItems={workspaceView.detailView.scheduleItems} />
          <BusinessMoneyPanel moneyItems={workspaceView.detailView.moneyItems} />
          <LinksPanel links={workspaceView.detailView.links} />
          <OperationLogsPanel logs={workspaceView.detailView.logs} />
        </section>
      </div>
    </section>
  )
}
