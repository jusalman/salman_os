import { useMemo, useState } from 'react'
import {
  buildAdsCampaignSummary,
  formatAdsCurrency,
  formatAdsRoas,
  getHigherAdsCampaignStatus,
  sortAdsCampaignsByAttention,
  type AdsCampaignItem,
  type AdsCampaignStatus,
  type AdsRiskSignalCode,
} from '../../domain/adOperations'
import { moneyStatusLabel } from '../../domain/labels'
import type { ClientMoneyPanelItem, MoneyStatus } from '../../types'
import { Panel } from '../common/Panel'
import { createMockOperationLogNotice } from './operatorRecord'

type AdsOperationsPlaceholderProps = {
  clientName?: string
  currentOperatorName?: string
  moneyItems?: ClientMoneyPanelItem[]
}

type BusinessMoneyConnection = {
  status: MoneyStatus | 'none'
  title: string
  description: string
  hasRisk: boolean
}

const MOCK_CLIENT_ADS_CAMPAIGNS: AdsCampaignItem[] = [
  {
    id: 'ads-sa-core',
    name: 'SA 핵심 키워드 운영',
    type: 'SA',
    status: 'check_needed',
    todaySpend: 342000,
    conversions: 8,
    cpa: 42750,
    roas: 2.4,
    latestUpdate: '2026-05-22 11:30',
    owner: '살만',
    riskSignals: ['cpa_rise', 'report_needed'],
    actionMemo: '핵심 키워드 입찰가와 전환 단가를 오늘 안에 재확인합니다.',
    linkedFileName: 'SA_Keyword_Report_mock.xlsx',
  },
  {
    id: 'ads-da-retarget',
    name: 'DA 리타겟팅 소재 A/B',
    type: 'DA',
    status: 'risk',
    todaySpend: 284000,
    conversions: 0,
    cpa: null,
    roas: 0.4,
    latestUpdate: '2026-05-22 10:10',
    owner: '민아',
    riskSignals: ['no_conversion', 'roas_drop', 'creative_fatigue'],
    actionMemo: '전환이 없는 소재 세트를 우선 중지 후보로 두고 신규 소재를 검토합니다.',
    linkedFileName: 'DA_Creative_Fatigue_mock.pdf',
  },
  {
    id: 'ads-sa-brand',
    name: 'SA 브랜드 방어 캠페인',
    type: 'SA',
    status: 'normal',
    todaySpend: 96000,
    conversions: 12,
    cpa: 8000,
    roas: 5.1,
    latestUpdate: '2026-05-22 09:40',
    owner: '진우',
    riskSignals: [],
    actionMemo: '브랜드 검색어 방어는 정상 범위입니다. 주간 리포트에만 요약합니다.',
    linkedFileName: 'Brand_Search_Snapshot_mock.xlsx',
  },
  {
    id: 'ads-da-awareness',
    name: 'DA 신규 인지도 캠페인',
    type: 'DA',
    status: 'paused',
    todaySpend: 0,
    conversions: 0,
    cpa: null,
    roas: null,
    latestUpdate: '2026-05-21 18:20',
    owner: '살만',
    riskSignals: ['spend_spike'],
    actionMemo: '전일 소진 급증 이후 수동 보류 상태입니다. 재개 전 예산 한도를 확인합니다.',
    linkedFileName: 'DA_Budget_Check_mock.xlsx',
  },
]

const adsStatusLabel: Record<AdsCampaignStatus, string> = {
  normal: '정상',
  check_needed: '확인 필요',
  risk: '위험',
  paused: '중지',
}

const riskSignalMeta: Record<
  AdsRiskSignalCode,
  { label: string; description: string; tone: 'normal' | 'warning' | 'danger' }
> = {
  spend_spike: {
    label: '소진 급증',
    description: '전일 또는 기준 대비 소진 속도가 빠릅니다.',
    tone: 'warning',
  },
  no_conversion: {
    label: '전환 없음',
    description: '집행 비용은 있으나 전환이 없습니다.',
    tone: 'danger',
  },
  cpa_rise: {
    label: 'CPA 상승',
    description: '전환 단가가 기준보다 높아졌습니다.',
    tone: 'warning',
  },
  roas_drop: {
    label: 'ROAS 하락',
    description: '광고 효율이 기준보다 낮아졌습니다.',
    tone: 'danger',
  },
  creative_fatigue: {
    label: '소재 피로',
    description: '소재 반응 저하 가능성이 있습니다.',
    tone: 'warning',
  },
  biz_money_risk: {
    label: '비즈머니 위험',
    description: '광고 집행 전 잔액 또는 결제 상태 확인이 필요합니다.',
    tone: 'danger',
  },
  report_needed: {
    label: '보고서 필요',
    description: '고객사 공유 전 내부 리포트 초안 검토가 필요합니다.',
    tone: 'normal',
  },
}

const riskSignalOrder: AdsRiskSignalCode[] = [
  'spend_spike',
  'no_conversion',
  'cpa_rise',
  'roas_drop',
  'creative_fatigue',
  'biz_money_risk',
  'report_needed',
]

export function AdsOperationsPlaceholder({
  clientName = '선택 고객사',
  currentOperatorName = '',
  moneyItems = [],
}: AdsOperationsPlaceholderProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [notice, setNotice] = useState('')
  const moneyConnection = useMemo(() => resolveBusinessMoneyConnection(moneyItems), [moneyItems])
  const campaigns = useMemo(
    () => applyBusinessMoneySignal(MOCK_CLIENT_ADS_CAMPAIGNS, moneyConnection),
    [moneyConnection],
  )
  const sortedCampaigns = useMemo(() => sortAdsCampaignsByAttention(campaigns), [campaigns])
  const selectedCampaign =
    sortedCampaigns.find((campaign) => campaign.id === selectedCampaignId) ??
    sortedCampaigns[0] ??
    null
  const summary = useMemo(() => buildAdsCampaignSummary(sortedCampaigns), [sortedCampaigns])
  const riskSignals = useMemo(
    () => buildRiskSignalCards(sortedCampaigns, moneyConnection),
    [sortedCampaigns, moneyConnection],
  )

  function handlePreparedAction(actionName: string) {
    setNotice(createMockOperationLogNotice(actionName, currentOperatorName))
  }

  return (
    <Panel title="광고" subtitle={`${clientName} SA/DA 광고 운영 상태`}>
      <div className="ads-operations">
        <div className="ops-toolbar">
          <div>
            <strong>광고 운영 보드</strong>
            <p>캠페인별 소진, 전환, CPA, ROAS와 확인 필요 신호를 mock 데이터로 점검합니다.</p>
          </div>
          <div className="ops-actions">
            <button type="button" onClick={() => handlePreparedAction('지표 새로고침')}>
              지표 새로고침
            </button>
            <button type="button" onClick={() => handlePreparedAction('보고서 생성')}>
              보고서 생성
            </button>
            <button type="button" onClick={() => handlePreparedAction('조치 완료')}>
              조치 완료
            </button>
            <button type="button" onClick={() => handlePreparedAction('메모 추가')}>
              메모 추가
            </button>
          </div>
        </div>

        <div className="ops-state-strip" aria-label="광고 운영 mock-first 상태">
          <span>mock-first 캠페인 데이터</span>
          <span>Google Sheets/API 실제 연결 없음</span>
          <span>광고 매체 API 연결 없음</span>
          <span>쓰기 기능 비활성</span>
          <span>향후 operation_logs 기록 예정</span>
        </div>

        {notice ? <p className="ops-prepared-notice">{notice}</p> : null}

        <section className="ops-summary-grid ads-ops-summary-grid" aria-label="광고 운영 요약">
          <SummaryCard
            label="광고 상태"
            value={adsStatusLabel[summary.status]}
            tone={getSummaryTone(summary.status)}
          />
          <SummaryCard label="오늘 소진액" value={formatAdsCurrency(summary.todaySpend)} tone="neutral" />
          <SummaryCard
            label="전환 수"
            value={`${summary.conversions.toLocaleString('ko-KR')}건`}
            tone="active"
          />
          <SummaryCard label="CPA" value={formatAdsCurrency(summary.cpa)} tone="neutral" />
          <SummaryCard label="ROAS" value={formatAdsRoas(summary.roas)} tone="neutral" />
          <SummaryCard
            label="확인 필요"
            value={`${summary.attentionCount.toLocaleString('ko-KR')}건`}
            tone={summary.attentionCount > 0 ? 'warning' : 'active'}
          />
        </section>

        <section className="ads-risk-signal-grid" aria-label="광고 위험 신호">
          {riskSignals.map((signal) => (
            <article
              key={signal.code}
              className={
                signal.count > 0
                  ? `ads-risk-signal-card ${signal.tone} active`
                  : 'ads-risk-signal-card'
              }
            >
              <div>
                <strong>{riskSignalMeta[signal.code].label}</strong>
                <p>{riskSignalMeta[signal.code].description}</p>
              </div>
              <span>{signal.count > 0 ? `${signal.count}건` : '정상'}</span>
            </article>
          ))}
        </section>

        {sortedCampaigns.length === 0 ? (
          <div className="ops-empty">
            <strong>표시할 광고 캠페인이 없습니다.</strong>
            <p>현재는 고객사별 광고 운영 구조를 확인하기 위한 mock UI입니다.</p>
          </div>
        ) : (
          <div className="ads-workbench">
            <section className="ops-list-panel" aria-label="광고 캠페인 리스트">
              <div className="ops-table-head ads-campaign-table-head">
                <span>캠페인명</span>
                <span>유형</span>
                <span>상태</span>
                <span>오늘 소진액</span>
                <span>전환</span>
                <span>CPA</span>
                <span>ROAS</span>
                <span>최근 업데이트</span>
                <span>담당자</span>
              </div>

              <div className="ops-row-list">
                {sortedCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    type="button"
                    className={
                      selectedCampaign?.id === campaign.id
                        ? 'ops-row ads-campaign-row active'
                        : 'ops-row ads-campaign-row'
                    }
                    onClick={() => setSelectedCampaignId(campaign.id)}
                  >
                    <span className="ops-row-title">{campaign.name}</span>
                    <span className={`ads-type-badge ${campaign.type.toLowerCase()}`}>
                      {campaign.type}
                    </span>
                    <span className={`status-badge ${campaign.status}`}>
                      {adsStatusLabel[campaign.status]}
                    </span>
                    <span>{formatAdsCurrency(campaign.todaySpend)}</span>
                    <span>{campaign.conversions.toLocaleString('ko-KR')}건</span>
                    <span>{formatAdsCurrency(campaign.cpa)}</span>
                    <span>{formatAdsRoas(campaign.roas)}</span>
                    <span>{campaign.latestUpdate}</span>
                    <span>{campaign.owner}</span>
                  </button>
                ))}
              </div>
            </section>

            <AdsCampaignDetailPanel
              campaign={selectedCampaign}
              moneyConnection={moneyConnection}
              onPreparedAction={handlePreparedAction}
            />
          </div>
        )}
      </div>
    </Panel>
  )
}

function AdsCampaignDetailPanel({
  campaign,
  moneyConnection,
  onPreparedAction,
}: {
  campaign: AdsCampaignItem | null
  moneyConnection: BusinessMoneyConnection
  onPreparedAction: (actionName: string) => void
}) {
  if (!campaign) {
    return (
      <aside className="ops-detail-panel">
        <div className="ops-empty compact-empty">
          <strong>캠페인을 선택하면 상세 정보가 표시됩니다.</strong>
          <p>왼쪽 리스트에서 확인할 캠페인을 선택하세요.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="ops-detail-panel" aria-label="선택한 광고 캠페인 상세">
      <div className="ops-detail-title">
        <p className="eyebrow">Campaign Detail</p>
        <h4>{campaign.name}</h4>
        <div className="ops-detail-badges">
          <span className={`ads-type-badge ${campaign.type.toLowerCase()}`}>{campaign.type}</span>
          <span className={`status-badge ${campaign.status}`}>
            {adsStatusLabel[campaign.status]}
          </span>
        </div>
      </div>

      <div className="ads-metric-strip" aria-label="주요 광고 지표">
        <div>
          <span>오늘 소진액</span>
          <strong>{formatAdsCurrency(campaign.todaySpend)}</strong>
        </div>
        <div>
          <span>전환 수</span>
          <strong>{campaign.conversions.toLocaleString('ko-KR')}건</strong>
        </div>
        <div>
          <span>CPA</span>
          <strong>{formatAdsCurrency(campaign.cpa)}</strong>
        </div>
        <div>
          <span>ROAS</span>
          <strong>{formatAdsRoas(campaign.roas)}</strong>
        </div>
      </div>

      <div className="ops-note-box">
        <strong>문제 신호</strong>
        {campaign.riskSignals.length > 0 ? (
          <div className="ads-signal-list">
            {campaign.riskSignals.map((signal) => (
              <span key={signal} className={`ads-signal-pill ${riskSignalMeta[signal].tone}`}>
                {riskSignalMeta[signal].label}
              </span>
            ))}
          </div>
        ) : (
          <p>현재 확인된 문제 신호가 없습니다.</p>
        )}
      </div>

      <div className="ops-note-box">
        <strong>조치 메모</strong>
        <p>{campaign.actionMemo}</p>
      </div>

      <dl className="ops-detail-grid">
        <div>
          <dt>연결 자료</dt>
          <dd>{campaign.linkedFileName}</dd>
        </div>
        <div>
          <dt>최근 업데이트</dt>
          <dd>{campaign.latestUpdate}</dd>
        </div>
        <div>
          <dt>담당자</dt>
          <dd>{campaign.owner}</dd>
        </div>
        <div>
          <dt>비즈머니 연결 상태</dt>
          <dd>{moneyConnection.title}</dd>
        </div>
      </dl>

      <div className="ops-log-placeholder">
        <strong>비즈머니 연결</strong>
        <p>{moneyConnection.description}</p>
      </div>

      <div className="ops-log-placeholder">
        <strong>향후 연동 안내</strong>
        <p>
          후속 승인 단계에서 Google Sheets 또는 광고 매체 API 읽기 결과를 이 구조에
          연결할 수 있습니다. 현재는 실제 저장 없이 mock-first 표시만 사용합니다.
        </p>
      </div>

      <div className="ops-detail-actions">
        <button type="button" onClick={() => onPreparedAction('지표 새로고침')}>
          지표 새로고침
        </button>
        <button type="button" onClick={() => onPreparedAction('보고서 생성')}>
          보고서 생성
        </button>
        <button type="button" onClick={() => onPreparedAction('조치 완료')}>
          조치 완료
        </button>
        <button type="button" onClick={() => onPreparedAction('메모 추가')}>
          메모 추가
        </button>
      </div>
    </aside>
  )
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'active' | 'danger' | 'neutral' | 'warning'
}) {
  return (
    <article className={`ops-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function applyBusinessMoneySignal(
  campaigns: AdsCampaignItem[],
  moneyConnection: BusinessMoneyConnection,
): AdsCampaignItem[] {
  if (!moneyConnection.hasRisk) {
    return campaigns
  }

  const nextStatus: AdsCampaignStatus =
    moneyConnection.status === 'issue' || moneyConnection.status === 'unknown'
      ? 'risk'
      : 'check_needed'

  return campaigns.map((campaign, index) => {
    if (index !== 0) {
      return campaign
    }

    return {
      ...campaign,
      status: getHigherAdsCampaignStatus(campaign.status, nextStatus),
      riskSignals: campaign.riskSignals.includes('biz_money_risk')
        ? campaign.riskSignals
        : [...campaign.riskSignals, 'biz_money_risk' as AdsRiskSignalCode],
    }
  })
}

function buildRiskSignalCards(
  campaigns: AdsCampaignItem[],
  moneyConnection: BusinessMoneyConnection,
) {
  return riskSignalOrder.map((code) => {
    const campaignCount = campaigns.filter((campaign) => campaign.riskSignals.includes(code)).length
    const count = code === 'biz_money_risk' && moneyConnection.hasRisk
      ? Math.max(campaignCount, 1)
      : campaignCount

    return {
      code,
      count,
      tone: riskSignalMeta[code].tone,
    }
  })
}

function resolveBusinessMoneyConnection(
  moneyItems: ClientMoneyPanelItem[],
): BusinessMoneyConnection {
  if (moneyItems.length === 0) {
    return {
      status: 'none',
      title: '비즈머니 항목 없음',
      description: '정산/비즈머니 탭에 등록된 계정이 없어 광고 집행 전 수동 확인이 필요합니다.',
      hasRisk: true,
    }
  }

  const sortedMoneyItems = [...moneyItems].sort(
    (a, b) => getMoneyStatusWeight(b.status) - getMoneyStatusWeight(a.status),
  )
  const attentionItem = sortedMoneyItems.find((item) => item.status !== 'checked')

  if (!attentionItem) {
    return {
      status: 'checked',
      title: '비즈머니 정상',
      description: `${moneyItems.length.toLocaleString('ko-KR')}개 비즈머니 항목이 정상 범위입니다.`,
      hasRisk: false,
    }
  }

  return {
    status: attentionItem.status,
    title: `${attentionItem.title} · ${moneyStatusLabel[attentionItem.status]}`,
    description: `${attentionItem.title} 항목이 ${moneyStatusLabel[attentionItem.status]} 상태입니다. 광고 집행 전 정산/비즈머니 탭에서 잔액과 확인일을 점검하세요.`,
    hasRisk: true,
  }
}

function getMoneyStatusWeight(status: MoneyStatus) {
  if (status === 'issue') {
    return 3
  }

  if (status === 'unknown') {
    return 2
  }

  if (status === 'check_needed') {
    return 1
  }

  return 0
}

function getSummaryTone(
  status: AdsCampaignStatus,
): 'active' | 'danger' | 'neutral' | 'warning' {
  if (status === 'risk') {
    return 'danger'
  }

  if (status === 'check_needed') {
    return 'warning'
  }

  if (status === 'paused') {
    return 'neutral'
  }

  return 'active'
}
