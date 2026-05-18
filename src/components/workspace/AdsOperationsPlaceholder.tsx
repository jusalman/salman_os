import { useState } from 'react'
import {
  calculateAdsMetrics,
  type AdsMetricDiagnostic,
  type AdsMetricStatus,
  type RawAdsMetricRow,
} from '../../domain/adsMetrics'

type AdsSeverity = 'info' | 'warning' | 'risk'
type AdsTab =
  | '전체 광고 현황'
  | '고객사별 광고 상세'
  | 'AI 광고 감사'
  | '담당자 액션리스트'
  | '고객사 리포트 초안'

type AdsViewDiagnostic = AdsMetricDiagnostic

type AdsClientSummary = {
  clientId: string
  clientName: string
  healthScore: number | null
  status: AdsMetricStatus
  spend: number | null
  clicks: number | null
  conversions: number | null
  cpc: number | null
  cpa: number | null
  roas: number | null
  lastUpdatedAt: string | null
  diagnostics: AdsViewDiagnostic[]
}

type AdsAuditFinding = {
  id: string
  clientId: string
  clientName: string
  severity: AdsSeverity
  title: string
  reason: string
  source: 'rule_placeholder' | 'future_audit_engine'
}

type AdsActionItem = {
  id: string
  clientId: string
  clientName: string
  title: string
  ownerName: string | null
  status: 'todo' | 'in_progress' | 'done'
  dueDate: string | null
  sourceFindingId: string | null
}

type AdsReportDraft = {
  id: string
  clientId: string
  clientName: string
  title: string
  body: string
  status: 'draft_placeholder' | 'ready_for_review' | 'reviewed'
  updatedAt: string | null
}

type AdsOperationsViewModel = {
  summary: {
    totalClients: number
    normalCount: number
    warningCount: number
    riskCount: number
    missingDataCount: number
  }
  clients: AdsClientSummary[]
  auditFindings: AdsAuditFinding[]
  actionItems: AdsActionItem[]
  reportDrafts: AdsReportDraft[]
  state: { type: 'ready' }
}

type MockAdsClientInput = {
  clientId: string
  clientName: string
  rows: RawAdsMetricRow[]
  lastUpdatedAt: string | null
  diagnostics?: AdsMetricDiagnostic[]
  isStale?: boolean
  highCostNoConversionThreshold?: number
}

const adsTabs: AdsTab[] = [
  '전체 광고 현황',
  '고객사별 광고 상세',
  'AI 광고 감사',
  '담당자 액션리스트',
  '고객사 리포트 초안',
]

const mockClientInputs: MockAdsClientInput[] = [
  {
    clientId: 'ads-client-01',
    clientName: '테스트 고객사',
    rows: [
      {
        spend: 100_000,
        impressions: 10_000,
        clicks: 500,
        conversions: 25,
        revenue: 400_000,
      },
    ],
    lastUpdatedAt: '2026-05-18 09:30',
  },
  {
    clientId: 'ads-client-02',
    clientName: '브랜드 성장랩',
    rows: [
      {
        spend: 100_000,
        impressions: 10_000,
        clicks: 500,
        conversions: 25,
        revenue: 400_000,
      },
    ],
    lastUpdatedAt: '2026-05-17 18:10',
    isStale: true,
  },
  {
    clientId: 'ads-client-03',
    clientName: '로컬 전환센터',
    rows: [
      {
        spend: 200_000,
        impressions: 12_000,
        clicks: 700,
        conversions: 0,
        revenue: 0,
      },
    ],
    lastUpdatedAt: '2026-05-18 08:55',
    highCostNoConversionThreshold: 100_000,
  },
  {
    clientId: 'ads-client-04',
    clientName: '신규 온보딩몰',
    rows: [],
    lastUpdatedAt: null,
    diagnostics: [
      {
        severity: 'error',
        code: 'missing_sheet_id',
        message: '광고 원본 Google Sheets ID가 아직 등록되지 않았습니다.',
      },
      {
        severity: 'warning',
        code: 'missing_tab',
        message: '위클리키워드SA_RAW 탭 확인이 필요합니다.',
      },
    ],
  },
]

const mockClients = mockClientInputs.map(toClientSummary)

const mockAdsViewModel: AdsOperationsViewModel = {
  summary: {
    totalClients: mockClients.length,
    normalCount: countByStatus(mockClients, 'normal'),
    warningCount: countByStatus(mockClients, 'warning'),
    riskCount: countByStatus(mockClients, 'risk'),
    missingDataCount: countByStatus(mockClients, 'missing_data'),
  },
  clients: mockClients,
  auditFindings: [
    {
      id: 'audit-01',
      clientId: 'ads-client-02',
      clientName: '브랜드 성장랩',
      severity: 'warning',
      title: '원본 데이터 신선도 확인 필요',
      reason: '계산기 결과가 stale_data 진단을 반영해 주의 상태로 분류한 mock 사례입니다.',
      source: 'rule_placeholder',
    },
    {
      id: 'audit-02',
      clientId: 'ads-client-03',
      clientName: '로컬 전환센터',
      severity: 'risk',
      title: '전환 없는 고비용 구간',
      reason: '계산기 결과가 high_cost_no_conversion 신호를 감지해 위험 상태로 분류한 mock 사례입니다.',
      source: 'rule_placeholder',
    },
  ],
  actionItems: [
    {
      id: 'action-01',
      clientId: 'ads-client-02',
      clientName: '브랜드 성장랩',
      title: '원본 Google Sheets 갱신 시간 확인',
      ownerName: '운영팀',
      status: 'todo',
      dueDate: '2026-05-20',
      sourceFindingId: 'audit-01',
    },
    {
      id: 'action-02',
      clientId: 'ads-client-03',
      clientName: '로컬 전환센터',
      title: '고비용 무전환 구간 원인 점검',
      ownerName: null,
      status: 'in_progress',
      dueDate: null,
      sourceFindingId: 'audit-02',
    },
  ],
  reportDrafts: [
    {
      id: 'report-01',
      clientId: 'ads-client-01',
      clientName: '테스트 고객사',
      title: '5월 3주차 네이버 광고 운영 요약 초안',
      body: '이번 주 mock 계산 결과는 정상 상태입니다. CPC, CPA, ROAS가 계산 가능한 상태이며 추가 위험 신호는 없습니다.',
      status: 'draft_placeholder',
      updatedAt: '2026-05-18 10:00',
    },
  ],
  state: { type: 'ready' },
}

export function AdsOperationsPlaceholder() {
  const [selectedTab, setSelectedTab] = useState<AdsTab>('전체 광고 현황')

  return (
    <section className="ads-operations">
      <header className="topbar">
        <div>
          <p className="eyebrow">고객사 네이버 광고 운영</p>
          <h1>광고 운영</h1>
          <p className="intro">
            정적 raw mock 데이터를 adsMetrics 계산기에 통과시킨 결과로 광고 현황, 감사 샘플,
            담당자 액션, 리포트 초안을 확인하는 화면입니다.
          </p>
        </div>
        <div className="topbar-notes">
          <span>실데이터 연결 전</span>
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

      {selectedTab === '전체 광고 현황' ? (
        <OverviewTab viewModel={mockAdsViewModel} />
      ) : selectedTab === '고객사별 광고 상세' ? (
        <ClientDetailTab clients={mockAdsViewModel.clients} />
      ) : selectedTab === 'AI 광고 감사' ? (
        <AuditTab findings={mockAdsViewModel.auditFindings} />
      ) : selectedTab === '담당자 액션리스트' ? (
        <ActionTab actionItems={mockAdsViewModel.actionItems} />
      ) : (
        <ReportTab drafts={mockAdsViewModel.reportDrafts} />
      )}
    </section>
  )
}

function OverviewTab({ viewModel }: { viewModel: AdsOperationsViewModel }) {
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
          <p>캠페인, 광고그룹, 키워드 상세는 이후 Google Sheets connector 연결 후 확장합니다.</p>
        </div>
      </div>
      <ClientSummaryList clients={clients} />
    </section>
  )
}

function AuditTab({ findings }: { findings: AdsAuditFinding[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>AI 광고 감사</h3>
          <p>현재는 실제 AI/RAG가 아닌 adsMetrics 계산기 결과 기반 mock 감사 샘플입니다.</p>
        </div>
      </div>
      <div className="stack">
        {findings.map((finding) => (
          <article key={finding.id} className="item-row">
            <div>
              <strong>{finding.title}</strong>
              <p>{finding.reason}</p>
            </div>
            <div className="item-meta">
              <span>{finding.clientName}</span>
              <span>{severityLabel[finding.severity]}</span>
              <span>룰 placeholder</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ActionTab({ actionItems }: { actionItems: AdsActionItem[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>담당자 액션리스트</h3>
          <p>광고 점검 결과를 담당자 업무로 전환하는 화면의 mock 예시입니다.</p>
        </div>
      </div>
      <div className="stack">
        {actionItems.map((item) => (
          <article key={item.id} className="item-row">
            <div>
              <strong>{item.title}</strong>
              <p>{item.clientName}</p>
            </div>
            <div className="item-meta">
              <span>{item.ownerName ?? '담당자 미정'}</span>
              <span>{actionStatusLabel[item.status]}</span>
              <span>{item.dueDate ?? '기한 미정'}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReportTab({ drafts }: { drafts: AdsReportDraft[] }) {
  return (
    <section className="panel ads-placeholder-panel">
      <div className="section-head">
        <div>
          <h3>고객사 리포트 초안</h3>
          <p>고객 발송 기능 없이 내부 검토용 초안 샘플만 표시합니다.</p>
        </div>
      </div>
      <div className="stack">
        {drafts.map((draft) => (
          <article key={draft.id} className="ads-report-draft">
            <div>
              <p className="eyebrow">{draft.clientName}</p>
              <h3>{draft.title}</h3>
              <p>{draft.body}</p>
            </div>
            <span>{reportStatusLabel[draft.status]}</span>
          </article>
        ))}
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
          <p>정적 mock data이며 실제 Google Sheets 값이 아닙니다.</p>
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
            <span>{client.lastUpdatedAt ?? '미수집'}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function toClientSummary(input: MockAdsClientInput): AdsClientSummary {
  const metrics = calculateAdsMetrics(input.rows, {
    diagnostics: input.diagnostics,
    isStale: input.isStale,
    highCostNoConversionThreshold: input.highCostNoConversionThreshold,
  })

  return {
    clientId: input.clientId,
    clientName: input.clientName,
    healthScore: metrics.healthScore,
    status: metrics.status,
    spend: metrics.spend,
    clicks: metrics.clicks,
    conversions: metrics.conversions,
    cpc: metrics.cpc,
    cpa: metrics.cpa,
    roas: metrics.roas,
    lastUpdatedAt: input.lastUpdatedAt,
    diagnostics: metrics.diagnostics,
  }
}

function countByStatus(clients: AdsClientSummary[], status: AdsMetricStatus) {
  return clients.filter((client) => client.status === status).length
}

const statusLabel: Record<AdsMetricStatus, string> = {
  normal: '정상',
  warning: '주의',
  risk: '위험',
  missing_data: '데이터 미수집',
}

const severityLabel: Record<AdsSeverity, string> = {
  info: '정보',
  warning: '주의',
  risk: '위험',
}

const actionStatusLabel: Record<AdsActionItem['status'], string> = {
  todo: '대기',
  in_progress: '진행 중',
  done: '완료',
}

const reportStatusLabel: Record<AdsReportDraft['status'], string> = {
  draft_placeholder: '초안 placeholder',
  ready_for_review: '검토 대기',
  reviewed: '검토 완료',
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
