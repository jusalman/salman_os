import assert from 'node:assert/strict'
import test from 'node:test'

import { handleDriveRouteHarness } from '../../src/data/adapters/mock/driveRouteFakeHandler.ts'

test('handles list files through the pure fake route harness', async () => {
  const response = await handleDriveRouteHarness({
    operation: 'list_files',
    body: {
      clientId: 'c1',
    },
  })

  assert.equal(response.ok, true)

  if (!response.ok || !('files' in response)) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.status === 'active'))
  assert.ok(response.diagnostics.some((diagnostic) => diagnostic.code === 'mock_backend_client_used'))
})

test('returns safe invalid request diagnostics from the fake route harness', async () => {
  const response = await handleDriveRouteHarness({
    operation: 'list_files',
    body: {
      clientId: 'c1',
      status: 'not_a_status',
    },
  })
  const serializedResponse = JSON.stringify(response)

  assert.equal(response.ok, false)

  if (response.ok) {
    return
  }

  assert.equal(response.error.code, 'invalid_request')
  assert.equal(serializedResponse.includes('not_a_status'), false)
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
})

test('does not call fetch while running the fake route harness', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalls = 0

  globalThis.fetch = (() => {
    fetchCalls += 1
    throw new Error('Unexpected network call from fake Drive route harness.')
  }) as typeof fetch

  try {
    const response = await handleDriveRouteHarness({
      operation: 'list_categories',
      body: {
        clientId: 'c1',
      },
    })

    assert.equal(response.ok, true)
    assert.equal(fetchCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})
