import { useState } from 'react'
import { useClientDriveFiles } from '../../hooks/useClientDriveFiles'
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
  const {
    driveFilesResult,
    loading: driveFilesLoading,
    error: driveFilesError,
    reload: reloadDriveFiles,
  } = useClientDriveFiles(header.id)
  const attentionCount = listView.items.filter((client) => client.status === 'attention').length
  const openTaskCount = listView.items.reduce((total, client) => total + client.openTaskCount, 0)
  const upcomingEventCount = listView.items.reduce(
    (total, client) => total + client.upcomingEventCount,
    0,
  )
  const moneyWarningCount = listView.items.filter((client) => client.hasBizMoneyWarning).length
  const panelSections = [
    <TasksPanel key="tasks" tasks={panels.tasks} />,
    <InternalSchedulePanel key="schedule" scheduleItems={panels.schedule} />,
    <BusinessMoneyPanel key="money" moneyItems={panels.money} />,
    <FilesPanel
      key="files"
      driveResult={driveFilesResult}
      loading={driveFilesLoading}
      error={driveFilesError}
      onReload={() => void reloadDriveFiles()}
    />,
    <LinksPanel key="links" links={panels.links} />,
    <OperationLogsPanel key="logs" logs={panels.logs} />,
  ]

  return (
    <section className="workspace">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">SALMAN OS</p>
          <h2>운영센터</h2>
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
            <span>고객사 운영</span>
            <small>업무, 일정, 자료</small>
          </button>
          <button
            type="button"
            className={activeSection === 'ads' ? 'workspace-nav-button active' : 'workspace-nav-button'}
            onClick={() => setActiveSection('ads')}
          >
            <span>광고 운영</span>
            <small>SA/DA 지표 점검</small>
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
                <p className="eyebrow">오늘의 운영 현황</p>
                <h1>고객사 운영 대시보드</h1>
                <p className="intro">
                  확인할 고객사, 막힌 업무, 비즈머니 이슈를 한 화면에서 빠르게 점검합니다.
                </p>
              </div>
              <div className="topbar-notes">
                <span>내부 직원용</span>
                <span>구글 드라이브 원본 연동</span>
              </div>
            </header>

            <section className="ops-overview" aria-label="운영 요약">
              <OverviewMetric label="전체 고객사" value={listView.totalCount} tone="neutral" />
              <OverviewMetric label="확인 필요" value={attentionCount} tone="warning" />
              <OverviewMetric label="진행 업무" value={openTaskCount} tone="active" />
              <OverviewMetric label="예정 일정" value={upcomingEventCount} tone="neutral" />
              <OverviewMetric label="비즈머니 이슈" value={moneyWarningCount} tone="danger" />
            </section>

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

function OverviewMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'active' | 'danger' | 'neutral' | 'warning'
}) {
  return (
    <article className={`ops-overview-card ${tone}`}>
      <span>{label}</span>
      <strong>{value.toLocaleString('ko-KR')}</strong>
    </article>
  )
}
