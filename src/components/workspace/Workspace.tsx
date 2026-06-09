import { useState } from 'react'
import { clientStatusLabel } from '../../domain/labels'
import { useClientDriveFiles } from '../../hooks/useClientDriveFiles'
import type {
  ClientFilePanelItem,
  ClientLogPanelItem,
  SelectedClientDetailView,
  WorkspaceView,
} from '../../types'
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

type DetailTab = 'overview' | 'tasks' | 'schedule' | 'files' | 'ads' | 'money' | 'links' | 'logs'

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: '개요' },
  { id: 'tasks', label: '업무' },
  { id: 'schedule', label: '일정' },
  { id: 'files', label: '자료실' },
  { id: 'ads', label: '광고운영' },
  { id: 'money', label: '비즈머니' },
  { id: 'links', label: '링크' },
  { id: 'logs', label: '로그' },
]

export function Workspace({
  viewerName,
  workspaceView,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview')
  const { listView, detailView } = workspaceView
  const selectedClientDetailId = detailView?.header.id ?? ''
  const {
    driveFilesResult,
    loading: driveFilesLoading,
    error: driveFilesError,
    reload: reloadDriveFiles,
  } = useClientDriveFiles(selectedClientDetailId)
  const attentionCount = listView.items.filter((client) => client.status === 'attention').length
  const openTaskCount = listView.items.reduce((total, client) => total + client.openTaskCount, 0)
  const upcomingEventCount = listView.items.reduce(
    (total, client) => total + client.upcomingEventCount,
    0,
  )
  const moneyWarningCount = listView.items.filter((client) => client.hasBizMoneyWarning).length
  const isDetailMode = Boolean(selectedClientId && detailView)

  function handleOpenClient(clientId: string) {
    setActiveDetailTab('overview')
    onSelectClient(clientId)
  }

  function handleBackToList() {
    setActiveDetailTab('overview')
    onSelectClient('')
  }

  return (
    <section className="workspace">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">SALMAN OS</p>
          <h2>Digital HQ</h2>
          <p className="sidebar-copy">
            <strong>{viewerName}</strong> 님의 커맨드센터
          </p>
        </div>

        <nav className="workspace-nav" aria-label="SALMAN OS 주요 화면">
          <button
            type="button"
            className={isDetailMode ? 'workspace-nav-button' : 'workspace-nav-button active'}
            onClick={handleBackToList}
          >
            <span>고객사 목록</span>
            <small>전체 운영 현황</small>
          </button>
          {detailView ? (
            <button
              type="button"
              className={isDetailMode ? 'workspace-nav-button active' : 'workspace-nav-button'}
              onClick={() => handleOpenClient(detailView.header.id)}
            >
              <span>고객사 상세</span>
              <small>{detailView.header.name}</small>
            </button>
          ) : null}
        </nav>

        <SmartOperationViewsPanel data={workspaceView.smartViews} />
      </aside>

      <div className="main-pane">
        {isDetailMode && detailView ? (
          <ClientDetailScreen
            detailView={detailView}
            activeDetailTab={activeDetailTab}
            driveFilesResult={driveFilesResult}
            driveFilesLoading={driveFilesLoading}
            driveFilesError={driveFilesError}
            onBack={handleBackToList}
            onSelectTab={setActiveDetailTab}
            onReloadDriveFiles={() => void reloadDriveFiles()}
          />
        ) : (
          <ClientListScreen
            totalCount={listView.totalCount}
            attentionCount={attentionCount}
            openTaskCount={openTaskCount}
            upcomingEventCount={upcomingEventCount}
            moneyWarningCount={moneyWarningCount}
            workspaceView={workspaceView}
            selectedClientId={selectedClientId}
            onSelectClient={handleOpenClient}
          />
        )}
      </div>
    </section>
  )
}

type ClientListScreenProps = {
  totalCount: number
  attentionCount: number
  openTaskCount: number
  upcomingEventCount: number
  moneyWarningCount: number
  workspaceView: WorkspaceView
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

function ClientListScreen({
  totalCount,
  attentionCount,
  openTaskCount,
  upcomingEventCount,
  moneyWarningCount,
  workspaceView,
  selectedClientId,
  onSelectClient,
}: ClientListScreenProps) {
  return (
    <section className="client-list-screen">
      <header className="topbar list-hero">
        <div>
          <p className="eyebrow">Client Control Center</p>
          <h1>고객사 운영센터</h1>
          <p className="intro">
            먼저 고객사를 선택한 뒤 상세 화면에서 업무, 일정, 자료실, 비즈머니, 링크, 로그를
            탭으로 확인합니다.
          </p>
        </div>
        <div className="topbar-notes">
          <span>내부 직원용</span>
          <span>mock-first 운영 데이터</span>
        </div>
      </header>

      <section className="ops-overview" aria-label="운영 요약">
        <OverviewMetric label="전체 고객사" value={totalCount} tone="neutral" />
        <OverviewMetric label="확인 필요" value={attentionCount} tone="warning" />
        <OverviewMetric label="진행 업무" value={openTaskCount} tone="active" />
        <OverviewMetric label="예정 일정" value={upcomingEventCount} tone="neutral" />
        <OverviewMetric label="비즈머니 이슈" value={moneyWarningCount} tone="danger" />
      </section>

      <div className="client-list-heading">
        <div>
          <p className="eyebrow">Client Directory</p>
          <h2>고객사 목록</h2>
        </div>
        <span>카드를 클릭하면 상세 화면으로 이동합니다.</span>
      </div>

      <ClientTabs
        listView={workspaceView.listView}
        selectedClientId={selectedClientId}
        onSelect={onSelectClient}
      />
    </section>
  )
}

type ClientDetailScreenProps = {
  detailView: SelectedClientDetailView
  activeDetailTab: DetailTab
  driveFilesResult: ReturnType<typeof useClientDriveFiles>['driveFilesResult']
  driveFilesLoading: boolean
  driveFilesError: string
  onBack: () => void
  onSelectTab: (tab: DetailTab) => void
  onReloadDriveFiles: () => void
}

function ClientDetailScreen({
  detailView,
  activeDetailTab,
  driveFilesResult,
  driveFilesLoading,
  driveFilesError,
  onBack,
  onSelectTab,
  onReloadDriveFiles,
}: ClientDetailScreenProps) {
  const { header, panels } = detailView

  return (
    <section className="client-detail-screen">
      <header className="topbar detail-hero">
        <div>
          <button type="button" className="back-button" onClick={onBack}>
            고객사 목록
          </button>
          <p className="eyebrow">Client Workroom</p>
          <h1>{header.name}</h1>
          <p className="intro">{header.memo}</p>
        </div>
        <div className="detail-hero-meta" aria-label="고객사 핵심 정보">
          <span className={`status-badge ${header.status}`}>{clientStatusLabel[header.status]}</span>
          <span>담당자 {header.owner}</span>
          <span>최근 업데이트 {header.updatedAt}</span>
        </div>
      </header>

      <ClientDetailHeaderSection client={header} />

      <nav className="detail-tabs" aria-label="고객사 상세 탭">
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeDetailTab ? 'detail-tab active' : 'detail-tab'}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="detail-tab-body">
        {activeDetailTab === 'overview' ? (
          <ClientOverview
            tasksCount={panels.tasks.filter((item) => item.status !== 'done' && item.status !== 'archived').length}
            scheduleCount={panels.schedule.filter((item) => item.status === 'scheduled').length}
            hasBizMoneyWarning={panels.money.some((item) => item.status !== 'checked')}
            recentFiles={panels.files.slice(0, 3)}
            recentLogs={panels.logs.slice(0, 3)}
          />
        ) : activeDetailTab === 'tasks' ? (
          <TasksPanel tasks={panels.tasks} />
        ) : activeDetailTab === 'schedule' ? (
          <InternalSchedulePanel scheduleItems={panels.schedule} />
        ) : activeDetailTab === 'files' ? (
          <FilesPanel
            driveResult={driveFilesResult}
            loading={driveFilesLoading}
            error={driveFilesError}
            onReload={onReloadDriveFiles}
          />
        ) : activeDetailTab === 'ads' ? (
          <AdsOperationsPlaceholder />
        ) : activeDetailTab === 'money' ? (
          <BusinessMoneyPanel moneyItems={panels.money} />
        ) : activeDetailTab === 'links' ? (
          <LinksPanel links={panels.links} />
        ) : (
          <OperationLogsPanel logs={panels.logs} />
        )}
      </section>
    </section>
  )
}

function ClientOverview({
  tasksCount,
  scheduleCount,
  hasBizMoneyWarning,
  recentFiles,
  recentLogs,
}: {
  tasksCount: number
  scheduleCount: number
  hasBizMoneyWarning: boolean
  recentFiles: ClientFilePanelItem[]
  recentLogs: ClientLogPanelItem[]
}) {
  return (
    <div className="client-overview">
      <section className="detail-summary-grid" aria-label="고객사 핵심 요약">
        <DetailSummaryCard label="진행 업무" value={`${tasksCount.toLocaleString('ko-KR')}건`} tone="active" />
        <DetailSummaryCard label="예정 일정" value={`${scheduleCount.toLocaleString('ko-KR')}건`} tone="neutral" />
        <DetailSummaryCard
          label="비즈머니"
          value={hasBizMoneyWarning ? '확인 필요' : '정상'}
          tone={hasBizMoneyWarning ? 'danger' : 'active'}
        />
      </section>

      <section className="overview-preview-grid">
        <article className="overview-preview-panel">
          <div className="section-head">
            <div>
              <h3>최근 자료</h3>
              <p>고객사 상세 자료실에서 전체 구조를 확인합니다.</p>
            </div>
          </div>
          <PreviewList
            items={recentFiles.map((file) => ({
              id: file.id,
              title: file.name,
              meta: file.folderPath,
            }))}
            emptyMessage="최근 자료가 없습니다."
          />
        </article>

        <article className="overview-preview-panel">
          <div className="section-head">
            <div>
              <h3>최근 운영 로그</h3>
              <p>가장 최근에 기록된 내부 변경 이력입니다.</p>
            </div>
          </div>
          <PreviewList
            items={recentLogs.map((log) => ({
              id: log.id,
              title: log.message,
              meta: `${log.actor} · ${log.createdAt}`,
            }))}
            emptyMessage="최근 운영 로그가 없습니다."
          />
        </article>
      </section>
    </div>
  )
}

function PreviewList({
  items,
  emptyMessage,
}: {
  items: { id: string; title: string; meta: string }[]
  emptyMessage: string
}) {
  if (items.length === 0) {
    return <p className="empty-note">{emptyMessage}</p>
  }

  return (
    <div className="preview-list">
      {items.map((item) => (
        <div key={item.id} className="preview-row">
          <strong>{item.title}</strong>
          <span>{item.meta}</span>
        </div>
      ))}
    </div>
  )
}

function DetailSummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'active' | 'danger' | 'neutral'
}) {
  return (
    <article className={`detail-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
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
