import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADS_SHEETS_REQUIRED_RAW_TABS,
  type AdsSheetsClientConfig,
} from '../../src/domain/adsSheetsConfig.ts'
import type {
  AdsSheetsReader,
  AdsSheetsSanitizedClientReadResult,
} from '../../src/domain/adsSheetsConnector.ts'
import { createAdsSheetsReaderFromEnv } from '../../src/domain/adsSheetsReaderFactory.ts'

const REPO_ROOT = 'C:/Users/USER/Desktop/automation/salman_os'
const SAFE_CREDENTIAL_PATH = 'C:/Users/USER/.config/salman/google-credentials.json'
const CONFIG: AdsSheetsClientConfig = {
  clientId: 'mock-client-ads-001',
  clientName: 'mock client',
  spreadsheetId: 'mock-spreadsheet-id-001',
  rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
  enabled: true,
  lastConfiguredAt: '2026-05-18T00:00:00.000Z',
}

test('uses mock reader when env is empty', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv({}, createDeps(calls))
  const result = reader.readClientSheets(CONFIG)

  assert.equal(result.diagnostics[0]?.message, 'mock reader used')
  assert.equal(calls.mock, 1)
  assert.equal(calls.local, 0)
})

test('uses mock reader when ADS_SHEETS_READER_MODE is mock', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    { ADS_SHEETS_READER_MODE: 'mock' },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)

  assert.equal(result.diagnostics[0]?.message, 'mock reader used')
  assert.equal(calls.mock, 1)
  assert.equal(calls.local, 0)
})

test('uses local reader candidate when local mode has safe absolute credential path', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_CREDENTIAL_PATH: SAFE_CREDENTIAL_PATH,
    },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)

  assert.equal(result.diagnostics[0]?.message, 'local reader candidate used')
  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 1)
})

test('uses error reader when local mode has no credential path and does not use mock reader', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    { ADS_SHEETS_READER_MODE: 'local' },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)

  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 0)
  assert.equal(result.tabs.dailySa, undefined)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.message.includes('missing_local_credential_path')))
})

test('uses error reader for invalid mode', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    { ADS_SHEETS_READER_MODE: 'enabled' },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)

  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 0)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.message.includes('invalid_reader_mode')))
})

test('uses error reader when VITE credential env exists', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    {
      ADS_SHEETS_READER_MODE: 'mock',
      VITE_GOOGLE_CREDENTIAL_PATH: SAFE_CREDENTIAL_PATH,
    },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)

  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 0)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.message.includes('vite_credential_env_exposed')))
})

test('does not expose raw credential path in error result', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_CREDENTIAL_PATH: 'credentials/google-credentials.json',
    },
    createDeps(calls),
  )
  const result = reader.readClientSheets(CONFIG)
  const serializedResult = JSON.stringify(result)

  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 0)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.message.includes('relative_credential_path')))
  assert.equal(serializedResult.includes('credentials/google-credentials.json'), false)
})

test('factory selection does not require actual API call or file read', () => {
  const calls = createReaderCalls()
  const reader = createAdsSheetsReaderFromEnv(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_TOKEN_PATH: '/Users/user/.config/salman/sheets-token-local.json',
    },
    createDeps(calls, { repoRoot: '/Users/user/work/salman_os' }),
  )

  assert.equal(calls.mock, 0)
  assert.equal(calls.local, 0)
  reader.readClientSheets(CONFIG)
  assert.equal(calls.local, 1)
})

function createReaderCalls() {
  return {
    mock: 0,
    local: 0,
  }
}

function createDeps(
  calls: ReturnType<typeof createReaderCalls>,
  options: { repoRoot?: string } = {},
) {
  return {
    mockReader: createCountingReader('mock reader used', () => {
      calls.mock += 1
    }),
    localReaderCandidate: createCountingReader('local reader candidate used', () => {
      calls.local += 1
    }),
    repoRoot: options.repoRoot ?? REPO_ROOT,
  }
}

function createCountingReader(message: string, onRead: () => void): AdsSheetsReader {
  return {
    readClientSheets(config: AdsSheetsClientConfig): AdsSheetsSanitizedClientReadResult {
      onRead()

      return {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {},
        diagnostics: [
          {
            severity: 'info',
            code: 'empty_data',
            clientId: config.clientId,
            clientName: config.clientName,
            tabKey: null,
            message,
          },
        ],
      }
    },
  }
}
