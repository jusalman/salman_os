import assert from 'node:assert/strict'
import test from 'node:test'

import { driveBackendFakeClient } from '../../src/data/adapters/mock/driveBackendFakeClient.ts'

test('returns active Drive file metadata through the fake backend client contract', async () => {
  const response = await driveBackendFakeClient.listFiles({ clientId: 'c1' })

  assert.equal(response.ok, true)

  if (!response.ok) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.source === 'fake_backend_client'))
  assert.ok(response.files.every((file) => file.status === 'active'))
  assert.ok(response.diagnostics.some((diagnostic) => diagnostic.code === 'mock_backend_client_used'))
})

test('keeps archived and excluded Drive files out of the default fake backend list', async () => {
  const response = await driveBackendFakeClient.listFiles({ clientId: 'c1' })

  assert.equal(response.ok, true)

  if (!response.ok) {
    return
  }

  const serializedResponse = JSON.stringify(response)

  assert.equal(response.files.some((file) => file.status === 'archived'), false)
  assert.equal(response.files.some((file) => file.status === 'excluded'), false)
  assert.equal(serializedResponse.includes('Do Not Index Working Notes'), false)
})

test('allows archived Drive metadata only when explicitly requested', async () => {
  const response = await driveBackendFakeClient.listFiles({
    clientId: 'c1',
    includeArchived: true,
    status: 'archived',
  })

  assert.equal(response.ok, true)

  if (!response.ok) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.status === 'archived'))
})

test('returns safe fake backend diagnostics for missing files', async () => {
  const response = await driveBackendFakeClient.getFile({
    clientId: 'c1',
    fileId: 'missing-drive-file',
  })
  const serializedResponse = JSON.stringify(response)

  assert.equal(response.ok, false)

  if (response.ok) {
    return
  }

  assert.equal(response.error.code, 'file_not_found')
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
  assert.equal(serializedResponse.includes('service_account'), false)
  assert.equal(serializedResponse.includes('.env'), false)
  assert.equal(serializedResponse.includes('drive.google.com'), false)
})

test('does not call fetch while returning fake backend metadata', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalls = 0

  globalThis.fetch = (() => {
    fetchCalls += 1
    throw new Error('Unexpected network call from fake Drive backend client.')
  }) as typeof fetch

  try {
    const response = await driveBackendFakeClient.listFiles({ clientId: 'c1' })

    assert.equal(response.ok, true)
    assert.equal(fetchCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})
