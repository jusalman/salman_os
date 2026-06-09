export type AdsCampaignType = 'SA' | 'DA'

export type AdsCampaignStatus = 'normal' | 'check_needed' | 'risk' | 'paused'

export type AdsRiskSignalCode =
  | 'spend_spike'
  | 'no_conversion'
  | 'cpa_rise'
  | 'roas_drop'
  | 'creative_fatigue'
  | 'biz_money_risk'
  | 'report_needed'

export type AdsCampaignItem = {
  id: string
  name: string
  type: AdsCampaignType
  status: AdsCampaignStatus
  todaySpend: number
  conversions: number
  cpa: number | null
  roas: number | null
  latestUpdate: string
  owner: string
  riskSignals: AdsRiskSignalCode[]
  actionMemo: string
  linkedFileName: string
}

export type AdsCampaignSummary = {
  status: AdsCampaignStatus
  todaySpend: number
  conversions: number
  cpa: number | null
  roas: number | null
  attentionCount: number
}

export function buildAdsCampaignSummary(
  campaigns: AdsCampaignItem[],
): AdsCampaignSummary {
  const todaySpend = campaigns.reduce((total, campaign) => total + campaign.todaySpend, 0)
  const conversions = campaigns.reduce((total, campaign) => total + campaign.conversions, 0)
  const roasValues = campaigns
    .map((campaign) => campaign.roas)
    .filter((value): value is number => typeof value === 'number')

  return {
    status: campaigns.reduce<AdsCampaignStatus>(
      (currentStatus, campaign) => getHigherAdsCampaignStatus(currentStatus, campaign.status),
      'normal',
    ),
    todaySpend,
    conversions,
    cpa: conversions > 0 ? todaySpend / conversions : null,
    roas:
      roasValues.length > 0
        ? roasValues.reduce((total, value) => total + value, 0) / roasValues.length
        : null,
    attentionCount: campaigns.filter((campaign) => isAdsCampaignAttention(campaign)).length,
  }
}

export function sortAdsCampaignsByAttention(
  campaigns: AdsCampaignItem[],
): AdsCampaignItem[] {
  return [...campaigns].sort((a, b) => {
    const statusWeightDiff =
      getAdsCampaignStatusWeight(b.status) - getAdsCampaignStatusWeight(a.status)

    if (statusWeightDiff !== 0) {
      return statusWeightDiff
    }

    const signalDiff = b.riskSignals.length - a.riskSignals.length

    if (signalDiff !== 0) {
      return signalDiff
    }

    return b.todaySpend - a.todaySpend
  })
}

export function getHigherAdsCampaignStatus(
  currentStatus: AdsCampaignStatus,
  nextStatus: AdsCampaignStatus,
): AdsCampaignStatus {
  return getAdsCampaignStatusWeight(nextStatus) > getAdsCampaignStatusWeight(currentStatus)
    ? nextStatus
    : currentStatus
}

export function getAdsCampaignStatusWeight(status: AdsCampaignStatus) {
  if (status === 'risk') {
    return 3
  }

  if (status === 'check_needed') {
    return 2
  }

  if (status === 'paused') {
    return 1
  }

  return 0
}

export function isAdsCampaignAttention(campaign: AdsCampaignItem) {
  return campaign.status !== 'normal' || campaign.riskSignals.length > 0
}

export function formatAdsCurrency(amount: number | null) {
  if (amount === null) {
    return '-'
  }

  return `${Math.round(amount).toLocaleString('ko-KR')}원`
}

export function formatAdsRoas(roas: number | null) {
  if (roas === null) {
    return '-'
  }

  return `${Math.round(roas * 100).toLocaleString('ko-KR')}%`
}
