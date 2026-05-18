import assert from 'node:assert/strict'
import test from 'node:test'

import { ADS_SHEETS_REQUIRED_RAW_TABS } from '../../src/domain/adsSheetsConfig.ts'
import {
  buildMockAdsOperationsViewModel,
  type MockAdsSheetsRawTablesByClient,
} from '../../src/domain/adsOperationsViewModel.ts'

const normalRawSheets: MockAdsSheetsRawTablesByClient = {
  'mock-client-ads-001': {
    dailySa: [
      {
        date: '2026-05-18',
        campaignName: 'mock campaign',
        adGroupName: 'mock group',
        keyword: 'mock keyword',
        spend: '100,000',
        impressions: '10,000',
        clicks: '500',
        conversions: '25',
        revenue: '400,000',
      },
    ],
    dailyConversionSa: [
      {
        date: '2026-05-18',
        campaignName: 'mock campaign',
        adGroupName: 'mock group',
        keyword: 'mock keyword',
        spend: '0',
        impressions: '1,000',
        clicks: '50',
        conversions: '5',
        revenue: '80,000',
      },
    ],
    weeklyKeywordSa: [
      {
        date: '2026-05-18',
        campaignName: 'mock campaign',
        adGroupName: 'mock group',
        keyword: 'mock keyword',
        spend: '20,000',
        impressions: '2,000',
        clicks: '100',
        conversions: '5',
        revenue: '120,000',
      },
    ],
  },
}

test('builds normal mock connector view model', () => {
  const viewModel = buildMockAdsOperationsViewModel({ rawSheetsByClientId: normalRawSheets })

  assert.equal(viewModel.summary.totalClients, 1)
  assert.equal(viewModel.summary.normalCount, 1)
  assert.equal(viewModel.clients[0]?.clientId, 'mock-client-ads-001')
  assert.equal(viewModel.clients[0]?.spend, 120000)
  assert.equal(viewModel.tablesByClientId['mock-client-ads-001']?.dailySa?.rowCount, 1)
})

test('aggregates missing tab diagnostics', () => {
  const viewModel = buildMockAdsOperationsViewModel({
    rawSheetsByClientId: {
      'mock-client-ads-001': {
        dailySa: normalRawSheets['mock-client-ads-001']?.dailySa,
      },
    },
  })

  assert.equal(viewModel.clients[0]?.status, 'warning')
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'missing_tab'))
  assert.equal(
    viewModel.clients[0]?.diagnostics.filter((diagnostic) => diagnostic.code === 'missing_tab')
      .length,
    4,
  )
})

test('aggregates empty data diagnostics', () => {
  const viewModel = buildMockAdsOperationsViewModel({
    rawSheetsByClientId: {
      'mock-client-ads-001': {
        dailySa: [],
        dailyConversionSa: [],
        weeklyKeywordSa: [],
      },
    },
  })

  assert.equal(viewModel.clients[0]?.status, 'missing_data')
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'empty_data'))
  assert.equal(viewModel.clients[0]?.healthScore, null)
})

test('aggregates invalid number diagnostics', () => {
  const viewModel = buildMockAdsOperationsViewModel({
    rawSheetsByClientId: {
      'mock-client-ads-001': {
        ...normalRawSheets['mock-client-ads-001'],
        dailySa: [
          {
            date: '2026-05-18',
            campaignName: 'mock campaign',
            adGroupName: 'mock group',
            keyword: 'mock keyword',
            spend: 'not-a-number',
            impressions: '10,000',
            clicks: '500',
            conversions: '25',
            revenue: '400,000',
          },
        ],
      },
    },
  })

  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'invalid_number'))
  assert.equal(viewModel.clients[0]?.spend, 20000)
})

test('generates health score and status from calculator', () => {
  const viewModel = buildMockAdsOperationsViewModel({
    rawSheetsByClientId: {
      'mock-client-ads-001': {
        dailySa: [
          {
            date: '2026-05-18',
            campaignName: 'mock risk campaign',
            adGroupName: 'mock risk group',
            keyword: 'mock risk keyword',
            spend: '200,000',
            impressions: '12,000',
            clicks: '700',
            conversions: '0',
            revenue: '0',
          },
        ],
        dailyConversionSa: [
          {
            date: '2026-05-18',
            campaignName: 'mock risk campaign',
            adGroupName: 'mock risk group',
            keyword: 'mock risk keyword',
            spend: '0',
            impressions: '0',
            clicks: '0',
            conversions: '0',
            revenue: '0',
          },
        ],
        weeklyKeywordSa: [
          {
            date: '2026-05-18',
            campaignName: 'mock risk campaign',
            adGroupName: 'mock risk group',
            keyword: 'mock risk keyword',
            spend: '0',
            impressions: '0',
            clicks: '0',
            conversions: '0',
            revenue: '0',
          },
        ],
      },
    },
  })

  assert.equal(viewModel.clients[0]?.status, 'risk')
  assert.equal(viewModel.clients[0]?.healthScore, 70)
  assert.equal(viewModel.summary.riskCount, 1)
})

test('aggregates missing config diagnostics', () => {
  const viewModel = buildMockAdsOperationsViewModel({
    configs: [
      {
        clientId: 'mock-client-missing-config',
        clientName: 'mock missing config',
        spreadsheetId: '',
        rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
        enabled: true,
        lastConfiguredAt: '2026-05-18T00:00:00.000Z',
      },
    ],
    rawSheetsByClientId: {},
  })

  assert.equal(viewModel.summary.totalClients, 0)
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'missing_sheet_id'))
})
