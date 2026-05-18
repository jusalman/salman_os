import assert from 'node:assert/strict'
import test from 'node:test'

import { validateLocalCredentialPath } from '../../src/domain/adsLocalCredentialValidation.ts'

const WINDOWS_REPO_ROOT = 'C:/Users/USER/Desktop/automation/salman_os'
const UNIX_REPO_ROOT = '/Users/user/work/salman_os'

test('returns error for empty credential path', () => {
  const result = validateLocalCredentialPath('   ', { repoRoot: WINDOWS_REPO_ROOT })

  assert.equal(result.ok, false)
  assert.equal(result.diagnostics[0]?.code, 'missing_credential_path')
})

test('returns error for .env.example path', () => {
  const result = validateLocalCredentialPath('C:/Users/USER/.config/salman/.env.example', {
    repoRoot: WINDOWS_REPO_ROOT,
  })

  assert.equal(result.ok, false)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'example_credential_path'))
})

test('returns error for credentials.example.json path', () => {
  const result = validateLocalCredentialPath('/Users/user/.config/salman/credentials.example.json', {
    repoRoot: UNIX_REPO_ROOT,
  })

  assert.equal(result.ok, false)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'example_credential_path'))
})

test('returns error for repo-internal credentials json path', () => {
  const result = validateLocalCredentialPath(
    'C:\\Users\\USER\\Desktop\\automation\\salman_os\\credentials\\google-credentials.json',
    { repoRoot: WINDOWS_REPO_ROOT },
  )

  assert.equal(result.ok, false)
  assert.equal(result.normalizedPath, 'C:/Users/USER/Desktop/automation/salman_os/credentials/google-credentials.json')
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'repo_internal_credential_path'))
})

test('returns ok for repo-external absolute unix path', () => {
  const result = validateLocalCredentialPath('/Users/user/.config/salman/google-credentials.json', {
    repoRoot: UNIX_REPO_ROOT,
  })

  assert.equal(result.ok, true)
  assert.equal(result.normalizedPath, '/Users/user/.config/salman/google-credentials.json')
  assert.equal(result.diagnostics.length, 0)
})

test('returns error for relative path', () => {
  const result = validateLocalCredentialPath('credentials/google-credentials.json', {
    repoRoot: WINDOWS_REPO_ROOT,
  })

  assert.equal(result.ok, false)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'relative_credential_path'))
})

test('allows token-looking filename only when path is local absolute', () => {
  const localAbsolute = validateLocalCredentialPath('C:/Users/USER/.config/salman/sheets-token-local.json', {
    repoRoot: WINDOWS_REPO_ROOT,
  })
  const relative = validateLocalCredentialPath('tokens/sheets-token-local.json', {
    repoRoot: WINDOWS_REPO_ROOT,
  })

  assert.equal(localAbsolute.ok, true)
  assert.equal(relative.ok, false)
  assert.ok(relative.diagnostics.some((diagnostic) => diagnostic.code === 'relative_credential_path'))
})

test('allows service-account-looking filename only when path is local absolute', () => {
  const localAbsolute = validateLocalCredentialPath('/Users/user/.config/salman/google-service-account.json', {
    repoRoot: UNIX_REPO_ROOT,
  })
  const relative = validateLocalCredentialPath('google-service-account.json', {
    repoRoot: UNIX_REPO_ROOT,
  })

  assert.equal(localAbsolute.ok, true)
  assert.equal(relative.ok, false)
  assert.ok(relative.diagnostics.some((diagnostic) => diagnostic.code === 'relative_credential_path'))
})
