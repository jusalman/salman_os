import { useState } from 'react'
import {
  buildMockAdsOperationsViewModel,
  type AdsClientSummary,
  type AdsOperationsMockConnectorViewModel,
  type AdsViewDiagnostic,
} from '../../domain/adsOperationsViewModel'
import type { AdsMetricStatus } from '../../domain/adsMetrics'

type AdsTab =
  | '전체 광고 현황'
  | '고객사별 광고 상세'
  | '광고 이상징후'
  | '담당자 액션'
  | '고객사 리포트 초안'

const adsTabs: AdsTab[] = [
  '전체 광고 현황',
  '고객사별 광고 상세',
  '광고 이상징후',
  '담당자 액션',
  '고객사 리포트 초안',
]

const mockAdsViewModel = buildMockAdsOperationsViewModel()

export function AdsOperationsPlaceholder() {
  const [selectedTab, setSelectedTab] = useState<AdsTab>('전체 광고 현황')

  return (
    <section className="ads-operations">
      <header className="topbar">
        <div>
          <p className="eyebrow">SA/DA 광고 운영</p>
          <h1>광고 운영 대시보드</h1>
          <p className="intro">
            고객사별 광고비, 클릭, 전환, 효율 지표를 한 번에 확인하고 조치가 필요한
            항목을 빠르게 분류합니다.
          </p>
        </div>
        <div className="topbar-notes">
          <span>운영 미리보기</span>
          <span>구글 시트 연결 전</span>
        </div>
      </header>

      <nav className="ads-tabs" aria-label="광고 운영 탭">
        {adsTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === selectedTab ? 'ads-tab active' : 'ads-tab'}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {mockAdsViewModel.state.type === 'empty' ? (
        <NoDataPanel message={mockAdsViewModel.state.message} />
      ) : selectedTab === '전체 광고 현황' ? (
        <OverviewTab viewModel={mockAdsViewModel} />
      ) : selectedTab === '고객사별 광고 상세' ? (
        <ClientDetailTab clients={mockAdsViewModel.clients} />
      ) : selectedTab === '광고 이상징후' ? (
        <AuditTab diagnostics={mockAdsViewModel.diagnostics} />
      ) : selectedTab === '담당자 액션' ? (
        <ActionTab diagnostics={mockAdsViewModel.diagnostics} />
      ) : (
        <ReportTab clients={mockAdsViewModel.clients} />
      )}
    </section>
  )
}

function OverviewTab({ viewModel }: { viewModel: AdsOperationsMockConnectorViewModel }) {
  return (
    <>
      <section className="ads-summary-grid">
        <SummaryCard label="전체 고객사" value={viewModel.summary.totalClients} />
        <SummaryCard label="정상" value={viewModel.summary.normalCount} />
        <SummaryCard label="주의" value={viewModel.summary.warningCount} />
        <SummaryCard label="위험" value={viewModel.summary.riskCount} />
        <SummaryCard label="데이터 미수집" value={viewModel.summary.missingDataCount} />
      </section>
      <ClientSummaryList clients={viewModel.clients} />
    </>
  )
}

function ClientDetailTab({ clients }: { clients: AdsClientSummary[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>고객사별 광고 상세</h3>
          <p>
            고객사별 핵심 광고 지표를 비교합니다. 실제 연결 전까지는 구조 검토용
            샘플 데이터로 표시합니다.
          </p>
        </div>
      </div>
      <ClientSummaryList clients={clients} />
    </section>
  )
}

function AuditTab({ diagnostics }: { diagnostics: AdsViewDiagnostic[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>광고 이상징후</h3>
          <p>
            원본 데이터 누락, 지표 계산 오류, 비용 대비 전환 저하처럼 담당자가 먼저
            확인해야 할 신호를 모아 보여줍니다.
          </p>
        </div>
      </div>
      <DiagnosticList diagnostics={diagnostics} emptyMessage="현재 확인할 이상징후가 없습니다." />
    </section>
  )
}

function ActionTab({ diagnostics }: { diagnostics: AdsViewDiagnostic[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>담당자 액션</h3>
          <p>
            이상징후가 있는 고객사를 담당자 확인 후보로 정리합니다. 업무 생성은 다음
            단계에서 별도 승인 후 연결합니다.
          </p>
        </div>
      </div>
      <DiagnosticList diagnostics={diagnostics} emptyMessage="오늘 생성할 액션 후보가 없습니다." />
    </section>
  )
}

function ReportTab({ clients }: { clients: AdsClientSummary[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>고객사 리포트 초안</h3>
          <p>
            고객사에게 공유하기 전 내부 담당자가 먼저 검토할 리포트 초안 상태입니다.
          </p>
        </div>
      </div>
      <div className="stack">
        {clients.map((client) => (
          <article key={client.clientId} className="ads-report-draft">
            <div>
              <p className="eyebrow">{client.clientName}</p>
              <h3>광고 운영 리포트 초안</h3>
              <p>
                광고 점수 {client.healthScore ?? '-'}점, 상태 {statusLabel[client.status]} 기준으로
                담당자 검토용 리포트 초안을 생성할 예정입니다.
              </p>
            </div>
            <span>검토 대기</span>
          </article>
        ))}
      </div>
    </section>
  )
}

function NoDataPanel({ message }: { message: string }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>광고 운영 데이터 없음</h3>
          <p>{message}</p>
        </div>
      </div>
    </section>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="ads-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function ClientSummaryList({ clients }: { clients: AdsClientSummary[] }) {
  return (
    <section className="panel ads-client-list">
      <div className="section-head">
        <div>
          <h3>고객사 광고 요약</h3>
          <p>운영 화면 구조 확인을 위한 광고 지표 샘플입니다.</p>
        </div>
      </div>
      <div className="ads-client-table" role="table" aria-label="고객사 광고 요약">
        <div className="ads-client-row ads-client-row-head" role="row">
          <span>고객사명</span>
          <span>광고 점수</span>
          <span>상태</span>
          <span>비용</span>
          <span>클릭</span>
          <span>전환</span>
          <span>CPC</span>
          <span>CPA</span>
          <span>ROAS</span>
          <span>마지막 업데이트</span>
        </div>
        {clients.map((client) => (
          <div key={client.clientId} className="ads-client-row" role="row">
            <strong>{client.clientName}</strong>
            <span>{client.healthScore ?? '-'}</span>
            <span className={`status-badge ${client.status}`}>{statusLabel[client.status]}</span>
            <span>{formatWon(client.spend)}</span>
            <span>{formatNumber(client.clicks)}</span>
            <span>{formatNumber(client.conversions)}</span>
            <span>{formatWon(client.cpc)}</span>
            <span>{formatWon(client.cpa)}</span>
            <span>{formatRoas(client.roas)}</span>
            <span>{formatDateTime(client.lastUpdatedAt)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function DiagnosticList({
  diagnostics,
  emptyMessage,
}: {
  diagnostics: AdsViewDiagnostic[]
  emptyMessage: string
}) {
  if (diagnostics.length === 0) {
    return (
      <div className="stack">
        <article className="item-row">
          <div>
            <strong>준비 상태</strong>
            <p>{emptyMessage}</p>
          </div>
          <div className="item-meta">
            <span>정상</span>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="stack">
      {diagnostics.map((diagnostic, index) => (
        <article key={`${diagnostic.clientId}-${diagnostic.source}-${index}`} className="item-row">
          <div>
            <strong>{diagnostic.clientName}</strong>
            <p>{diagnostic.message}</p>
          </div>
          <div className="item-meta">
            <span className={`status-badge ${diagnostic.severity}`}>{diagnosticSeverityLabel[diagnostic.severity]}</span>
            <span>{diagnosticCodeLabel[diagnostic.code]}</span>
            <span>{diagnosticSourceLabel(diagnostic.source)}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

const statusLabel: Record<AdsMetricStatus, string> = {
  normal: '정상',
  warning: '주의',
  risk: '위험',
  missing_data: '데이터 미수집',
}

const diagnosticSeverityLabel: Record<AdsViewDiagnostic['severity'], string> = {
  info: '정보',
  warning: '주의',
  error: '오류',
}

const diagnosticCodeLabel: Record<AdsViewDiagnostic['code'], string> = {
  column_mismatch: '컬럼 불일치',
  disabled_client: '비활성 고객사',
  empty_data: '데이터 없음',
  invalid_number: '숫자 오류',
  missing_config: '설정 누락',
  missing_sheet_id: '시트 누락',
  missing_tab: '탭 누락',
  unsupported_report_type: '지원 안 함',
}

function diagnosticSourceLabel(source: string) {
  const sourceLabels: Record<string, string> = {
    adsMetrics: '광고 지표',
    dailyConversionSa: '전환 SA',
    dailySa: '데일리 SA',
    enabled: '활성 상태',
    rawSheetsByClientId: '원본 시트',
    spreadsheetId: '스프레드시트',
    weeklyKeywordSa: '주간 키워드',
  }

  return sourceLabels[source] ?? source.replace('rawTabs.', '원본 탭 ')
}

function formatWon(value: number | null) {
  return value === null ? '-' : `${Math.round(value).toLocaleString('ko-KR')}원`
}

function formatNumber(value: number | null) {
  return value === null ? '-' : value.toLocaleString('ko-KR')
}

function formatRoas(value: number | null) {
  return value === null ? '-' : `${Math.round(value * 100).toLocaleString('ko-KR')}%`
}

function formatDateTime(value: string | null) {
  if (value === null) {
    return '미수집'
  }

  return value.replace('T', ' ').replace('.000Z', '')
}
