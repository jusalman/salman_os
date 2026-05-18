import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADS_SHEETS_REQUIRED_RAW_TABS,
  readMockAdsSheetsClientConfigs,
  type AdsSheetsClientConfigInput,
} from '../../src/domain/adsSheetsConfig.ts'

test('returns enabled mock configs only', () => {
  const result = readMockAdsSheetsClientConfigs()

  assert.equal(result.configs.length, 1)
  assert.equal(result.configs[0]?.clientId, 'mock-client-ads-001')
  assert.equal(result.configs[0]?.spreadsheetId, 'mock-spreadsheet-id-001')
  assert.deepEqual(result.configs[0]?.rawTabs, ADS_SHEETS_REQUIRED_RAW_TABS)
})

test('returns missing spreadsheetId diagnostics and excludes invalid enabled config', () => {
  const sourceConfigs: AdsSheetsClientConfigInput[] = [
    {
      clientId: 'mock-client-missing-sheet',
      clientName: '시트 미설정 고객사',
      spreadsheetId: ' ',
      rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
      enabled: true,
      lastConfiguredAt: '2026-05-18T00:00:00.000Z',
    },
  ]

  const result = readMockAdsSheetsClientConfigs(sourceConfigs)

  assert.equal(result.configs.length, 0)
  assert.equal(result.diagnostics.length, 1)
  assert.equal(result.diagnostics[0]?.code, 'missing_spreadsheet_id')
  assert.equal(result.diagnostics[0]?.field, 'spreadsheetId')
})

test('returns missing raw tab diagnostics and excludes invalid enabled config', () => {
  const sourceConfigs: AdsSheetsClientConfigInput[] = [
    {
      clientId: 'mock-client-missing-tab',
      clientName: '탭 미설정 고객사',
      spreadsheetId: 'mock-spreadsheet-id-missing-tab',
      rawTabs: {
        dailySa: '데일리SA_RAW',
        dailyConversionSa: '',
      },
      enabled: true,
      lastConfiguredAt: '2026-05-18T00:00:00.000Z',
    },
  ]

  const result = readMockAdsSheetsClientConfigs(sourceConfigs)

  assert.equal(result.configs.length, 0)
  assert.equal(result.diagnostics.length, 2)
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => diagnostic.field),
    ['rawTabs.dailyConversionSa', 'rawTabs.weeklyKeywordSa'],
  )
  assert.ok(result.diagnostics.every((diagnostic) => diagnostic.code === 'missing_raw_tab_name'))
})

test('flags disabled clients and excludes them from read targets', () => {
  const sourceConfigs: AdsSheetsClientConfigInput[] = [
    {
      clientId: 'mock-client-disabled',
      clientName: '비활성 고객사',
      spreadsheetId: 'mock-spreadsheet-id-disabled',
      rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
      enabled: false,
      lastConfiguredAt: '2026-05-18T00:00:00.000Z',
    },
  ]

  const result = readMockAdsSheetsClientConfigs(sourceConfigs)

  assert.equal(result.configs.length, 0)
  assert.equal(result.diagnostics.length, 1)
  assert.equal(result.diagnostics[0]?.code, 'disabled_client')
  assert.equal(result.diagnostics[0]?.severity, 'info')
})
