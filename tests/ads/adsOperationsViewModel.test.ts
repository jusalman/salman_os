import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADS_SHEETS_REQUIRED_RAW_TABS,
  readMockAdsSheetsClientConfigs,
  type AdsSheetsClientConfig,
} from '../../src/domain/adsSheetsConfig.ts'
import {
  readAdsSheetsWithReader,
  type AdsSheetsReader,
  type AdsSheetsSanitizedClientReadResult,
} from '../../src/domain/adsSheetsConnector.ts'
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

class FakeAdsSheetsReader implements AdsSheetsReader {
  private resultsByClientId: Record<string, AdsSheetsSanitizedClientReadResult>

  constructor(resultsByClientId: Record<string, AdsSheetsSanitizedClientReadResult>) {
    this.resultsByClientId = resultsByClientId
  }

  readClientSheets(config: AdsSheetsClientConfig): AdsSheetsSanitizedClientReadResult {
    return (
      this.resultsByClientId[config.clientId] ?? {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {},
        diagnostics: [
          {
            severity: 'error',
            code: 'permission_denied',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: null,
            message: 'fake reader has no configured result',
          },
        ],
      }
    )
  }
}

function getEnabledMockConfig() {
  const result = readMockAdsSheetsClientConfigs()
  const config = result.configs[0]

  assert.ok(config)

  return config
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

test('reads successful fake connector result into view model pipeline', async () => {
  const config = getEnabledMockConfig()
  const readResult = await readAdsSheetsWithReader(
    [config],
    new FakeAdsSheetsReader({
      [config.clientId]: {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: normalRawSheets[config.clientId] ?? {},
        diagnostics: [],
      },
    }),
  )
  const viewModel = buildMockAdsOperationsViewModel({
    configs: [config],
    rawSheetsByClientId: readResult.rawSheetsByClientId,
  })

  assert.equal(readResult.diagnostics.length, 0)
  assert.equal(viewModel.summary.normalCount, 1)
  assert.equal(viewModel.clients[0]?.status, 'normal')
})

test('returns missing tab diagnostics from fake connector and view model pipeline', async () => {
  const config = getEnabledMockConfig()
  const readResult = await readAdsSheetsWithReader(
    [config],
    new FakeAdsSheetsReader({
      [config.clientId]: {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {
          dailySa: normalRawSheets[config.clientId]?.dailySa,
        },
        diagnostics: [
          {
            severity: 'warning',
            code: 'missing_tab',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: 'dailyConversionSa',
            message: 'fake missing tab',
          },
        ],
      },
    }),
  )
  const viewModel = buildMockAdsOperationsViewModel({
    configs: [config],
    rawSheetsByClientId: readResult.rawSheetsByClientId,
  })

  assert.ok(readResult.diagnostics.some((diagnostic) => diagnostic.code === 'missing_tab'))
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'missing_tab'))
})

test('returns empty tab diagnostics through fake connector path', async () => {
  const config = getEnabledMockConfig()
  const readResult = await readAdsSheetsWithReader(
    [config],
    new FakeAdsSheetsReader({
      [config.clientId]: {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {
          dailySa: [],
          dailyConversionSa: [],
          weeklyKeywordSa: [],
        },
        diagnostics: [
          {
            severity: 'warning',
            code: 'empty_data',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: 'dailySa',
            message: 'fake empty tab',
          },
        ],
      },
    }),
  )
  const viewModel = buildMockAdsOperationsViewModel({
    configs: [config],
    rawSheetsByClientId: readResult.rawSheetsByClientId,
  })

  assert.ok(readResult.diagnostics.some((diagnostic) => diagnostic.code === 'empty_data'))
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'empty_data'))
  assert.equal(viewModel.clients[0]?.status, 'missing_data')
})

test('returns permission denied diagnostic from fake connector', async () => {
  const config = getEnabledMockConfig()
  const readResult = await readAdsSheetsWithReader(
    [config],
    new FakeAdsSheetsReader({
      [config.clientId]: {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {},
        diagnostics: [
          {
            severity: 'error',
            code: 'permission_denied',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: null,
            message: 'fake permission denied',
          },
        ],
      },
    }),
  )

  assert.equal(readResult.diagnostics.length, 1)
  assert.equal(readResult.diagnostics[0]?.code, 'permission_denied')
})

test('returns column mismatch diagnostic through fake connector path', async () => {
  const config = getEnabledMockConfig()
  const readResult = await readAdsSheetsWithReader(
    [config],
    new FakeAdsSheetsReader({
      [config.clientId]: {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {
          dailySa: [
            {
              date: '2026-05-18',
              campaignName: 'mock campaign',
              spend: '100,000',
            },
          ],
          dailyConversionSa: normalRawSheets[config.clientId]?.dailyConversionSa,
          weeklyKeywordSa: normalRawSheets[config.clientId]?.weeklyKeywordSa,
        },
        diagnostics: [
          {
            severity: 'error',
            code: 'column_mismatch',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: 'dailySa',
            message: 'fake column mismatch',
          },
        ],
      },
    }),
  )
  const viewModel = buildMockAdsOperationsViewModel({
    configs: [config],
    rawSheetsByClientId: readResult.rawSheetsByClientId,
  })

  assert.ok(readResult.diagnostics.some((diagnostic) => diagnostic.code === 'column_mismatch'))
  assert.ok(viewModel.diagnostics.some((diagnostic) => diagnostic.code === 'column_mismatch'))
  assert.equal(viewModel.clients[0]?.status, 'missing_data')
})
