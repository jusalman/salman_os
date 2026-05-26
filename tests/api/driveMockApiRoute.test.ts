import assert from 'node:assert/strict'
import test from 'node:test'

import driveCategoriesRoute, {
  handleMockDriveCategoriesRoute,
} from '../../api/drive/categories.ts'
import driveDetailRoute, { handleMockDriveDetailRoute } from '../../api/drive/detail.ts'
import driveListRoute, { handleMockDriveListRoute } from '../../api/drive/list.ts'
import type { DriveBackendRouteResponse } from '../../src/domain/driveRouteValidation.ts'

test('mock Drive API list route returns sanitized active files only by default', async () => {
  const response = await handleMockDriveListRoute({
    clientId: 'c1',
  })

  assert.equal(response.ok, true)

  if (!response.ok || !('files' in response)) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.status === 'active'))
  assert.ok(response.diagnostics.some((diagnostic) => diagnostic.code === 'mock_backend_client_used'))
})

test('mock Drive API detail route preserves archived default block and opt-in behavior', async () => {
  const defaultResponse = await handleMockDriveDetailRoute({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-004',
  })
  const optInResponse = await handleMockDriveDetailRoute({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-004',
    includeArchived: true,
  })

  assert.equal(defaultResponse.ok, false)
  assert.equal(optInResponse.ok, true)

  if (!defaultResponse.ok) {
    assert.equal(defaultResponse.error.code, 'file_not_found')
  }

  if (optInResponse.ok && 'file' in optInResponse) {
    assert.equal(optInResponse.file.status, 'archived')
  }
})

test('mock Drive API categories route returns safe category summaries', async () => {
  const response = await handleMockDriveCategoriesRoute({
    clientId: 'c1',
  })
  const serializedResponse = JSON.stringify(response).toLowerCase()

  assert.equal(response.ok, true)
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
  assert.equal(serializedResponse.includes('service_role'), false)

  if (response.ok && 'categories' in response) {
    assert.ok(response.categories.length > 0)
  }
})

test('mock Drive API route default exports write expected response status and payload', async () => {
  const listResponse = createMockApiResponse()
  const detailResponse = createMockApiResponse()
  const categoriesResponse = createMockApiResponse()

  await driveListRoute({ body: { clientId: 'c1' } }, listResponse.response)
  await driveDetailRoute(
    { body: { clientId: 'c1', fileId: 'mock-drive-file-c1-004' } },
    detailResponse.response,
  )
  await driveCategoriesRoute({ body: { clientId: 'c1' } }, categoriesResponse.response)

  assert.equal(listResponse.result.statusCode, 200)
  assert.equal(listResponse.result.payload?.ok, true)
  assert.equal(detailResponse.result.statusCode, 404)
  assert.equal(detailResponse.result.payload?.ok, false)
  assert.equal(categoriesResponse.result.statusCode, 200)
  assert.equal(categoriesResponse.result.payload?.ok, true)
})

test('mock Drive API route boundary does not call fetch', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalls = 0

  globalThis.fetch = (() => {
    fetchCalls += 1
    throw new Error('Unexpected network call from mock Drive API route.')
  }) as typeof fetch

  try {
    const response = await handleMockDriveListRoute({
      clientId: 'c1',
    })

    assert.equal(response.ok, true)
    assert.equal(fetchCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

function createMockApiResponse() {
  const result: {
    statusCode?: number
    payload?: DriveBackendRouteResponse
  } = {}

  return {
    result,
    response: {
      status(code: number) {
        result.statusCode = code

        return {
          json(payload: DriveBackendRouteResponse) {
            result.payload = payload
          },
        }
      },
    },
  }
}
