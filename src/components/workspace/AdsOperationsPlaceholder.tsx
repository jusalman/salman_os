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
  | 'AI 광고 감사'
  | '담당자 액션리스트'
  | '고객사 리포트 초안'

const adsTabs: AdsTab[] = [
  '전체 광고 현황',
  '고객사별 광고 상세',
  'AI 광고 감사',
  '담당자 액션리스트',
  '고객사 리포트 초안',
]

const mockAdsViewModel = buildMockAdsOperationsViewModel()

export function AdsOperationsPlaceholder() {
  const [selectedTab, setSelectedTab] = useState<AdsTab>('전체 광고 현황')

  return (
    <section className="ads-operations">
      <header className="topbar">
        <div>
          <p className="eyebrow">고객사 네이버 광고 운영</p>
          <h1>광고 운영</h1>
          <p className="intro">
            mock 설정과 raw sheet 샘플을 정규화한 뒤 광고 지표 계산기로 만든 내부 운영용
            광고 현황입니다. 실제 Google Sheets 연결은 아직 활성화하지 않았습니다.
          </p>
        </div>
        <div className="topbar-notes">
          <span>mock pipeline</span>
          <span>Google Sheets 미연결</span>
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
      ) : selectedTab === 'AI 광고 감사' ? (
        <AuditTab diagnostics={mockAdsViewModel.diagnostics} />
      ) : selectedTab === '담당자 액션리스트' ? (
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
            현재는 mock connector pipeline이 만든 고객사별 지표만 표시합니다. 캠페인,
            광고그룹, 키워드 상세 drill-down은 실제 connector 승인 이후 분리합니다.
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
          <h3>AI 광고 감사</h3>
          <p>
            실제 AI 감사나 RAG는 아직 연결하지 않았습니다. 현재는 mock pipeline 진단만
            내부 검토 신호로 표시합니다.
          </p>
        </div>
      </div>
      <DiagnosticList diagnostics={diagnostics} emptyMessage="현재 mock 진단이 없습니다." />
    </section>
  )
}

function ActionTab({ diagnostics }: { diagnostics: AdsViewDiagnostic[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>담당자 액션리스트</h3>
          <p>
            실제 업무 생성은 아직 구현하지 않았습니다. 진단이 발생하면 담당자 확인
            후보로만 표시합니다.
          </p>
        </div>
      </div>
      <DiagnosticList diagnostics={diagnostics} emptyMessage="생성할 mock 액션 후보가 없습니다." />
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
            실제 리포트 생성은 아직 연결하지 않았습니다. 아래 내용은 계산된 mock 지표를
            기반으로 한 초안 준비 상태입니다.
          </p>
        </div>
      </div>
      <div className="stack">
        {clients.map((client) => (
          <article key={client.clientId} className="ads-report-draft">
            <div>
              <p className="eyebrow">{client.clientName}</p>
              <h3>광고 운영 리포트 초안 준비 중</h3>
              <p>
                광고 점수 {client.healthScore ?? '-'}점, 상태 {statusLabel[client.status]} 기준으로
                담당자 검토용 리포트 초안을 생성할 예정입니다.
              </p>
            </div>
            <span>초안 placeholder</span>
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
          <p>mock connector pipeline 결과이며 실제 Google Sheets 읽기는 아직 수행하지 않습니다.</p>
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
            <span>{statusLabel[client.status]}</span>
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
            <span>mock</span>
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
            <span>{diagnosticSeverityLabel[diagnostic.severity]}</span>
            <span>{diagnostic.code}</span>
            <span>{diagnostic.source}</span>
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
