import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveAdsSheetsReaderMode } from '../../src/domain/adsSheetsReaderActivation.ts'

const REPO_ROOT = 'C:/Users/USER/Desktop/automation/salman_os'

test('defaults to mock when env is empty', () => {
  const result = resolveAdsSheetsReaderMode({}, { repoRoot: REPO_ROOT })

  assert.equal(result.mode, 'mock')
  assert.equal(result.diagnostics.length, 0)
})

test('returns mock when ADS_SHEETS_READER_MODE is mock', () => {
  const result = resolveAdsSheetsReaderMode(
    { ADS_SHEETS_READER_MODE: 'mock' },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'mock')
  assert.equal(result.diagnostics.length, 0)
})

test('returns local_candidate for local mode with safe absolute credential path', () => {
  const result = resolveAdsSheetsReaderMode(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_CREDENTIAL_PATH: 'C:/Users/USER/.config/salman/google-credentials.json',
    },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'local_candidate')
  assert.equal(result.credentialEnvName, 'ADS_GOOGLE_CREDENTIAL_PATH')
  assert.equal(result.normalizedCredentialPath, 'C:/Users/USER/.config/salman/google-credentials.json')
  assert.equal(result.diagnostics.length, 0)
})

test('returns error for local mode without credential path', () => {
  const result = resolveAdsSheetsReaderMode(
    { ADS_SHEETS_READER_MODE: 'local' },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'error')
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'missing_local_credential_path'))
})

test('returns error for invalid reader mode', () => {
  const result = resolveAdsSheetsReaderMode(
    { ADS_SHEETS_READER_MODE: 'enabled' },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'error')
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'invalid_reader_mode'))
})

test('returns error when VITE credential env is present', () => {
  const result = resolveAdsSheetsReaderMode(
    {
      ADS_SHEETS_READER_MODE: 'mock',
      VITE_GOOGLE_CREDENTIAL_PATH: 'C:/Users/USER/.config/salman/google-credentials.json',
    },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'error')
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'vite_credential_env_exposed'))
})

test('does not silently fall back to mock when local validation fails', () => {
  const result = resolveAdsSheetsReaderMode(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_SERVICE_ACCOUNT_PATH: 'credentials/google-service-account.json',
    },
    { repoRoot: REPO_ROOT },
  )

  assert.equal(result.mode, 'error')
  assert.notEqual(result.mode, 'mock')
  assert.equal(result.credentialEnvName, 'ADS_GOOGLE_SERVICE_ACCOUNT_PATH')
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'relative_credential_path'))
})

test('accepts token path env when local absolute', () => {
  const result = resolveAdsSheetsReaderMode(
    {
      ADS_SHEETS_READER_MODE: 'local',
      ADS_GOOGLE_TOKEN_PATH: '/Users/user/.config/salman/sheets-token-local.json',
    },
    { repoRoot: '/Users/user/work/salman_os' },
  )

  assert.equal(result.mode, 'local_candidate')
  assert.equal(result.credentialEnvName, 'ADS_GOOGLE_TOKEN_PATH')
})
