import { useState } from 'react'
import type { WorkspaceView } from '../../types'
import { AdsOperationsPlaceholder } from './AdsOperationsPlaceholder'
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

type WorkspaceSection = 'clients' | 'ads'

export function Workspace({
  viewerName,
  workspaceView,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('clients')
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
          <h2>고객사 운영 허브</h2>
          <p className="sidebar-copy">
            <strong>{viewerName}</strong>님으로 접속 중
          </p>
        </div>

        <nav className="workspace-nav" aria-label="SALMAN OS 주요 섹션">
          <button
            type="button"
            className={activeSection === 'clients' ? 'workspace-nav-button active' : 'workspace-nav-button'}
            onClick={() => setActiveSection('clients')}
          >
            고객사 운영
          </button>
          <button
            type="button"
            className={activeSection === 'ads' ? 'workspace-nav-button active' : 'workspace-nav-button'}
            onClick={() => setActiveSection('ads')}
          >
            광고 운영
          </button>
        </nav>

        {activeSection === 'clients' ? <SmartOperationViewsPanel data={panels.smartViews} /> : null}
      </aside>

      <div className="main-pane">
        {activeSection === 'ads' ? (
          <AdsOperationsPlaceholder />
        ) : (
          <>
            <header className="topbar">
              <div>
                <p className="eyebrow">내부 직원용 운영 화면</p>
                <h1>고객사 운영센터</h1>
              </div>
              <div className="topbar-notes">
                <span>운영 데이터 기준</span>
                <span>Google Drive 원본 파일</span>
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
          </>
        )}
      </div>
    </section>
  )
}
