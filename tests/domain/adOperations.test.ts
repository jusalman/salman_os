import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildAdsCampaignSummary,
  formatAdsCurrency,
  formatAdsRoas,
  sortAdsCampaignsByAttention,
  type AdsCampaignItem,
} from '../../src/domain/adOperations.ts'

const campaigns: AdsCampaignItem[] = [
  {
    id: 'normal-sa',
    name: 'SA 정상 캠페인',
    type: 'SA',
    status: 'normal',
    todaySpend: 100000,
    conversions: 10,
    cpa: 10000,
    roas: 4,
    latestUpdate: '2026-05-22 09:00',
    owner: '살만',
    riskSignals: [],
    actionMemo: '정상 운영',
    linkedFileName: 'normal.xlsx',
  },
  {
    id: 'risk-da',
    name: 'DA 위험 캠페인',
    type: 'DA',
    status: 'risk',
    todaySpend: 200000,
    conversions: 0,
    cpa: null,
    roas: 0.5,
    latestUpdate: '2026-05-22 10:00',
    owner: '민아',
    riskSignals: ['no_conversion', 'roas_drop'],
    actionMemo: '전환 없음',
    linkedFileName: 'risk.pdf',
  },
  {
    id: 'check-sa',
    name: 'SA 확인 캠페인',
    type: 'SA',
    status: 'check_needed',
    todaySpend: 50000,
    conversions: 2,
    cpa: 25000,
    roas: 2,
    latestUpdate: '2026-05-22 11:00',
    owner: '진우',
    riskSignals: ['cpa_rise'],
    actionMemo: 'CPA 확인',
    linkedFileName: 'check.xlsx',
  },
]

test('summarizes campaign metrics and worst status', () => {
  const summary = buildAdsCampaignSummary(campaigns)

  assert.equal(summary.status, 'risk')
  assert.equal(summary.todaySpend, 350000)
  assert.equal(summary.conversions, 12)
  assert.equal(summary.cpa, 350000 / 12)
  assert.equal(summary.roas, (4 + 0.5 + 2) / 3)
  assert.equal(summary.attentionCount, 2)
})

test('sorts risky campaigns before normal campaigns', () => {
  const sortedCampaigns = sortAdsCampaignsByAttention(campaigns)

  assert.equal(sortedCampaigns[0]?.id, 'risk-da')
  assert.equal(sortedCampaigns[1]?.id, 'check-sa')
  assert.equal(sortedCampaigns[2]?.id, 'normal-sa')
})

test('formats ads currency and ROAS for scan-friendly UI', () => {
  assert.equal(formatAdsCurrency(123456.7), '123,457원')
  assert.equal(formatAdsCurrency(null), '-')
  assert.equal(formatAdsRoas(2.456), '246%')
  assert.equal(formatAdsRoas(null), '-')
})
