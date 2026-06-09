import { useState } from 'react'
import { clientStatusLabel } from '../../domain/labels'
import { useClientDriveFiles } from '../../hooks/useClientDriveFiles'
import type {
  ClientListItem,
  ClientFilePanelItem,
  ClientLogPanelItem,
  SelectedClientDetailView,
  WorkspaceView,
} from '../../types'
import { AdsOperationsPlaceholder } from './AdsOperationsPlaceholder'
import { BusinessMoneyPanel } from './BusinessMoneyPanel'
import { ClientTabs } from './ClientTabs'
import { FilesPanel } from './FilesPanel'
import { InternalSchedulePanel } from './InternalSchedulePanel'
import { LinksPanel } from './LinksPanel'
import { OperationLogsPanel } from './OperationLogsPanel'
import { TasksPanel } from './TasksPanel'

type WorkspaceProps = {
  viewerName: string
  workspaceView: WorkspaceView
  selectedClientId: string
  onSelectClient: (clientId: string) => void
}

type DetailTab =
  | 'overview'
  | 'tasks'
  | 'schedule'
  | 'files'
  | 'ads'
  | 'contracts'
  | 'money'
  | 'links'
  | 'logs'

type WorkspaceSection = 'dashboard' | 'clients'

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: '개요' },
  { id: 'tasks', label: '업무' },
  { id: 'schedule', label: '일정' },
  { id: 'files', label: '자료실' },
  { id: 'ads', label: '광고' },
  { id: 'contracts', label: '견적/계약' },
  { id: 'money', label: '정산/비즈머니' },
  { id: 'links', label: '링크' },
  { id: 'logs', label: '로그' },
]

type SidebarItem =
  | { id: WorkspaceSection; label: string }
  | { id: 'prepared'; label: string }

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'clients', label: '고객사 관리' },
  { id: 'prepared', label: '업무/일정' },
  { id: 'prepared', label: '광고 운영' },
  { id: 'prepared', label: '견적/계약/정산' },
  { id: 'prepared', label: '지식저장소' },
  { id: 'prepared', label: '리포트' },
  { id: 'prepared', label: '설정' },
]

export function Workspace({
  viewerName,
  workspaceView,
  selectedClientId,
  onSelectClient,
}: WorkspaceProps) {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('dashboard')
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview')
  const [preparedNotice, setPreparedNotice] = useState('')
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

  function handleOpenDashboard() {
    setActiveSection('dashboard')
    setActiveDetailTab('overview')
    setPreparedNotice('')
    onSelectClient('')
  }

  function handleOpenClient(clientId: string) {
    setActiveSection('clients')
    setActiveDetailTab('overview')
    setPreparedNotice('')
    onSelectClient(clientId)
  }

  function handleBackToList() {
    setActiveSection('clients')
    setActiveDetailTab('overview')
    setPreparedNotice('')
    onSelectClient('')
  }

  function handlePreparedAction(actionName: string) {
    setPreparedNotice(`${actionName} 기능은 현재 mock UI로만 준비되어 있습니다.`)
  }

  function handlePreparedModule(actionName: string) {
    setActiveSection('dashboard')
    setActiveDetailTab('overview')
    onSelectClient('')
    setPreparedNotice(`${actionName} 메뉴는 현재 대시보드 mock UI에서 준비 상태만 표시합니다.`)
  }

  return (
    <section className="workspace">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">SALMAN OS</p>
          <h2>Digital HQ</h2>
          <p className="sidebar-copy">
            <strong>{viewerName}</strong> 님의 운영 워크스페이스
          </p>
        </div>

        <nav className="workspace-nav" aria-label="SALMAN OS 주요 메뉴">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={getSidebarButtonClass(item, activeSection, isDetailMode)}
              onClick={() => {
                if (item.id === 'dashboard') {
                  handleOpenDashboard()
                  return
                }

                if (item.id === 'clients') {
                  handleBackToList()
                  return
                }

                handlePreparedModule(item.label)
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-pane">
        {preparedNotice ? <p className="prepared-notice">{preparedNotice}</p> : null}

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
        ) : activeSection === 'dashboard' ? (
          <DashboardScreen
            totalCount={listView.totalCount}
            attentionCount={attentionCount}
            openTaskCount={openTaskCount}
            upcomingEventCount={upcomingEventCount}
            moneyWarningCount={moneyWarningCount}
            workspaceView={workspaceView}
            onSelectClient={handleOpenClient}
          />
        ) : (
          <ClientListScreen
            workspaceView={workspaceView}
            selectedClientId={selectedClientId}
            onSelectClient={handleOpenClient}
            onPreparedAction={handlePreparedAction}
          />
        )}
      </div>
    </section>
  )
}

function getSidebarButtonClass(
  item: SidebarItem,
  activeSection: WorkspaceSection,
  isDetailMode: boolean,
) {
  const isActive =
    item.id === 'clients'
      ? activeSection === 'clients' || isDetailMode
      : item.id === activeSection && !isDetailMode

  return isActive ? 'workspace-nav-button active' : 'workspace-nav-button'
}

type DashboardScreenProps = {
  totalCount: number
  attentionCount: number
  openTaskCount: number
  upcomingEventCount: number
  moneyWarningCount: number
  workspaceView: WorkspaceView
  onSelectClient: (clientId: string) => void
}

function DashboardScreen({
  totalCount,
  attentionCount,
  openTaskCount,
  upcomingEventCount,
  moneyWarningCount,
  workspaceView,
  onSelectClient,
}: DashboardScreenProps) {
  const attentionClients = workspaceView.listView.items.filter(
    (client) => client.status === 'attention' || client.hasBizMoneyWarning,
  )
  const recentLogClients = [...workspaceView.listView.items]
    .filter((client) => client.latestLogAt)
    .sort((a, b) => (b.latestLogAt ?? '').localeCompare(a.latestLogAt ?? ''))
    .slice(0, 6)
  const autoClassificationItems = workspaceView.listView.items
    .filter(
      (client) => !client.hasDriveFolder || !client.hasLookerLink || !client.hasSheetLink,
    )
    .slice(0, 6)

  return (
    <section className="dashboard-screen">
      <header className="crm-page-header dashboard-heading">
        <div>
          <p className="eyebrow">Today Command</p>
          <h1>오늘의 운영 현황</h1>
          <p className="intro">
            오늘 확인해야 할 고객사, 업무, 일정, 비즈머니 상태를 한 화면에서 먼저 점검합니다.
          </p>
        </div>
      </header>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <section className="ops-overview" aria-label="전체 운영 요약">
            <OverviewMetric label="전체 고객사" value={totalCount} tone="neutral" />
            <OverviewMetric label="확인 필요" value={attentionCount} tone="warning" />
            <OverviewMetric label="진행 업무" value={openTaskCount} tone="active" />
            <OverviewMetric label="예정 일정" value={upcomingEventCount} tone="neutral" />
            <OverviewMetric label="비즈머니 이슈" value={moneyWarningCount} tone="danger" />
          </section>

          <section className="panel dashboard-panel">
            <div className="section-head">
              <div>
                <h3>확인 필요 고객사</h3>
                <p>상태 또는 비즈머니 점검이 필요한 고객사를 먼저 엽니다.</p>
              </div>
              <span className="section-count">
                {attentionClients.length.toLocaleString('ko-KR')}건
              </span>
            </div>
            <DashboardClientList
              clients={attentionClients}
              onSelectClient={onSelectClient}
            />
          </section>

          <section className="panel dashboard-panel">
            <div className="section-head">
              <div>
                <h3>최근 운영 로그</h3>
                <p>최근 기록이 있는 고객사부터 빠르게 확인합니다.</p>
              </div>
            </div>
            <DashboardRecentLogs clients={recentLogClients} onSelectClient={onSelectClient} />
          </section>
        </div>

        <aside className="dashboard-right-panel" aria-label="오늘의 체크리스트">
          <div className="dashboard-checklist-head">
            <p className="eyebrow">Checklist</p>
            <h2>오늘의 체크리스트</h2>
            <p>대시보드에서만 운영 요약 위젯을 보여줍니다.</p>
          </div>

          <ChecklistGroup title="오늘 볼 항목" items={workspaceView.smartViews.todaysItems} />
          <ChecklistGroup title="우선 업무" items={workspaceView.smartViews.priorityTasks} />
          <AutoClassificationGroup clients={autoClassificationItems} />
        </aside>
      </div>
    </section>
  )
}

function DashboardClientList({
  clients,
  onSelectClient,
}: {
  clients: ClientListItem[]
  onSelectClient: (clientId: string) => void
}) {
  if (clients.length === 0) {
    return (
      <div className="empty-state compact-empty">
        <strong>확인 필요 고객사가 없습니다.</strong>
        <p>현재 mock 데이터 기준으로 즉시 조치할 고객사가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-client-list">
      {clients.map((client) => (
        <button
          key={client.id}
          type="button"
          className="dashboard-client-row"
          onClick={() => onSelectClient(client.id)}
        >
          <div>
            <strong>{client.name}</strong>
            <span>{client.latestLogAt ?? '최근 로그 없음'}</span>
          </div>
          <div className="dashboard-client-meta">
            <span className={`status-badge ${client.status}`}>
              {clientStatusLabel[client.status]}
            </span>
            <span>{client.openTaskCount.toLocaleString('ko-KR')} 업무</span>
            <span>{client.upcomingEventCount.toLocaleString('ko-KR')} 일정</span>
            {client.hasBizMoneyWarning ? (
              <span className="status-badge check_needed">비즈머니</span>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  )
}

function DashboardRecentLogs({
  clients,
  onSelectClient,
}: {
  clients: ClientListItem[]
  onSelectClient: (clientId: string) => void
}) {
  if (clients.length === 0) {
    return (
      <div className="empty-state compact-empty">
        <strong>최근 운영 로그가 없습니다.</strong>
        <p>고객사 상세 로그 탭에 기록이 쌓이면 이 영역에서 먼저 확인합니다.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-log-list">
      {clients.map((client) => (
        <button
          key={client.id}
          type="button"
          className="dashboard-log-row"
          onClick={() => onSelectClient(client.id)}
        >
          <strong>{client.name}</strong>
          <span>{client.latestLogAt}</span>
          <em>상세 로그 열기</em>
        </button>
      ))}
    </div>
  )
}

function ChecklistGroup({
  title,
  items,
}: {
  title: string
  items: WorkspaceView['smartViews']['todaysItems']
}) {
  return (
    <article className="checklist-card">
      <div className="checklist-card-head">
        <strong>{title}</strong>
        <span>{items.length.toLocaleString('ko-KR')}</span>
      </div>

      {items.length > 0 ? (
        <ul className="checklist-list">
          {items.slice(0, 5).map((item) => (
            <li key={`${title}-${item.clientName}-${item.title}`}>
              <strong>{item.clientName}</strong>
              <span>{item.title}</span>
              <em>{item.meta}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="checklist-empty">해당 항목 없음</p>
      )}
    </article>
  )
}

function AutoClassificationGroup({ clients }: { clients: ClientListItem[] }) {
  return (
    <article className="checklist-card">
      <div className="checklist-card-head">
        <strong>자동 분류 대기</strong>
        <span>{clients.length.toLocaleString('ko-KR')}</span>
      </div>

      {clients.length > 0 ? (
        <ul className="checklist-list">
          {clients.map((client) => (
            <li key={`auto-classification-${client.id}`}>
              <strong>{client.name}</strong>
              <span>운영 링크 연결 상태 확인</span>
              <em>{getMissingOperationLinks(client)}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p className="checklist-empty">분류 대기 항목 없음</p>
      )}
    </article>
  )
}

function getMissingOperationLinks(client: ClientListItem) {
  const missingLinks = [
    !client.hasDriveFolder ? 'Drive' : '',
    !client.hasLookerLink ? '리포트' : '',
    !client.hasSheetLink ? '시트' : '',
  ].filter(Boolean)

  return missingLinks.length > 0 ? `${missingLinks.join(', ')} 확인 필요` : '연결 정상'
}

type ClientListScreenProps = {
  workspaceView: WorkspaceView
  selectedClientId: string
  onSelectClient: (clientId: string) => void
  onPreparedAction: (actionName: string) => void
}

function ClientListScreen({
  workspaceView,
  selectedClientId,
  onSelectClient,
  onPreparedAction,
}: ClientListScreenProps) {
  return (
    <section className="client-list-screen">
      <header className="crm-page-header">
        <div>
          <p className="eyebrow">Client Management</p>
          <h1>고객 관리 (CRM)</h1>
          <p className="intro">고객사 정보 통합 관리 및 운영 데이터베이스</p>
        </div>
        <button
          type="button"
          className="primary-action"
          onClick={() => onPreparedAction('클라이언트 등록')}
        >
          + 클라이언트 등록
        </button>
      </header>

      <section className="crm-filter-bar" aria-label="고객사 검색 및 필터">
        <label>
          <span>검색</span>
          <input type="search" placeholder="회사명 또는 담당자 검색" disabled />
        </label>
        <label>
          <span>상태</span>
          <select disabled defaultValue="all">
            <option value="all">전체 상태</option>
          </select>
        </label>
        <label>
          <span>담당자</span>
          <select disabled defaultValue="all">
            <option value="all">전체 담당자</option>
          </select>
        </label>
        <button type="button" className="secondary-action" disabled>
          필터 준비 중
        </button>
      </section>

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
      <header className="crm-page-header detail-heading">
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
        ) : activeDetailTab === 'contracts' ? (
          <ContractsPlaceholder />
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
              <p>자료실 탭에서 폴더, 파일, 상세 정보를 확인합니다.</p>
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

function ContractsPlaceholder() {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <h3>견적/계약</h3>
          <p>견적서, 계약 상태, 정산 연결 정보는 후속 승인 작업에서 연결할 영역입니다.</p>
        </div>
      </div>
      <div className="empty-state">
        <strong>준비된 관리 영역</strong>
        <p>현재 v1에서는 실제 계약 생성이나 외부 고객 포털 기능을 실행하지 않습니다.</p>
      </div>
    </section>
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
