import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
  GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY,
  createGoogleDriveServerAdapterFromConfig,
  createGoogleDriveServerAdapterSkeleton,
  googleDriveServerAdapterSkeleton,
  readGoogleDriveServerAdapterConfigFromEnvLike,
  validateGoogleDriveServerAdapterConfig,
} from '../../api/drive/googleDriveServerAdapter.ts'
import { handleDriveServerRoute } from '../../api/drive/driveServerAdapter.ts'
import { handleMockDriveListRoute } from '../../api/drive/list.ts'
import type { DriveServerAdapter } from '../../api/drive/driveServerAdapter.ts'

test('actual Google Drive adapter skeleton satisfies the DriveServerAdapter shape', async () => {
  const adapter: DriveServerAdapter = createGoogleDriveServerAdapterSkeleton()
  const response = await adapter.listFiles({ clientId: 'c1' })

  assert.equal(response.ok, false)

  if (response.ok) {
    return
  }

  assert.equal(response.error.code, 'drive_backend_unavailable')
  assert.equal(response.clientId, 'c1')
})

test('actual Google Drive adapter config is service account first and envLike only', () => {
  const config = readGoogleDriveServerAdapterConfigFromEnvLike({
    [GOOGLE_DRIVE_AUTH_MODE_ENV_KEY]: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
    [GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY]: 'C:/local-only/drive-key.json',
    [GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY]: 'driveRootFolder_12345',
  })
  const validation = validateGoogleDriveServerAdapterConfig(config)

  assert.equal(GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT, 'service_account')
  assert.equal(validation.ok, true)

  if (validation.ok) {
    assert.equal(validation.config.authMode, GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT)
    assert.equal(validation.config.allowedRootFolderId, 'driveRootFolder_12345')
  }
})

test('actual Google Drive adapter config validation rejects incomplete or unsupported config safely', async () => {
  const adapter = createGoogleDriveServerAdapterFromConfig({
    authMode: 'oauth',
    credentialPath: 'SECRET_LOCAL_PATH_SHOULD_NOT_RETURN',
    allowedRootFolderId: 'driveRootFolder_12345',
  })
  const response = await adapter.listFiles({ clientId: 'c1' })
  const serializedResponse = JSON.stringify(response)

  assert.equal(response.ok, false)

  if (!response.ok) {
    assert.equal(response.error.code, 'drive_backend_unavailable')
  }

  assert.equal(serializedResponse.includes('oauth'), false)
  assert.equal(serializedResponse.includes('SECRET_LOCAL_PATH_SHOULD_NOT_RETURN'), false)
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
  assert.equal(serializedResponse.includes('private_key'), false)
  assert.equal(serializedResponse.includes('service_account'), false)
})

test('actual Google Drive adapter config factory still does not call fetch or Drive API', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalls = 0
  const adapter = createGoogleDriveServerAdapterFromConfig({
    authMode: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
    credentialPath: 'C:/local-only/drive-key.json',
    allowedRootFolderId: 'driveRootFolder_12345',
  })

  globalThis.fetch = (() => {
    fetchCalls += 1
    throw new Error('Unexpected network call from Drive adapter config factory.')
  }) as typeof fetch

  try {
    const response = await adapter.listFiles({ clientId: 'c1' })

    assert.equal(response.ok, false)

    if (!response.ok) {
      assert.equal(response.error.code, 'drive_backend_unavailable')
    }

    assert.equal(fetchCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('actual Google Drive adapter skeleton returns safe diagnostics through route safety checks', async () => {
  const response = await handleDriveServerRoute(
    {
      operation: 'get_file',
      body: {
        clientId: 'c1',
        fileId: 'mock-drive-file-c1-001',
      },
    },
    googleDriveServerAdapterSkeleton,
  )
  const serializedResponse = JSON.stringify(response).toLowerCase()

  assert.equal(response.ok, false)

  if (response.ok) {
    return
  }

  assert.equal(response.error.code, 'drive_backend_unavailable')
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
  assert.equal(serializedResponse.includes('privatekey'), false)
  assert.equal(serializedResponse.includes('private_key'), false)
  assert.equal(serializedResponse.includes('serviceaccount'), false)
  assert.equal(serializedResponse.includes('service_account'), false)
  assert.equal(serializedResponse.includes('.env'), false)
})

test('actual Google Drive adapter skeleton does not call fetch', async () => {
  const originalFetch = globalThis.fetch
  let fetchCalls = 0

  globalThis.fetch = (() => {
    fetchCalls += 1
    throw new Error('Unexpected network call from Drive adapter skeleton.')
  }) as typeof fetch

  try {
    const response = await googleDriveServerAdapterSkeleton.listCategories({ clientId: 'c1' })

    assert.equal(response.ok, false)
    assert.equal(fetchCalls, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('actual Google Drive adapter skeleton does not import googleapis or read runtime env', async () => {
  const source = await readFile(new URL('../../api/drive/googleDriveServerAdapter.ts', import.meta.url), 'utf8')

  assert.equal(source.includes('googleapis'), false)
  assert.equal(source.includes('process.env'), false)
  assert.equal(source.includes('import.meta.env'), false)
})

test('actual Google Drive package gate remains closed before local smoke task', async () => {
  const packageJson = await readFile(new URL('../../package.json', import.meta.url), 'utf8')
  const packageLock = await readFile(new URL('../../package-lock.json', import.meta.url), 'utf8')

  assert.equal(packageJson.includes('googleapis'), false)
  assert.equal(packageLock.includes('googleapis'), false)
})

test('default mock Drive route still uses the fake adapter', async () => {
  const response = await handleMockDriveListRoute({
    clientId: 'c1',
  })

  assert.equal(response.ok, true)

  if (!response.ok || !('files' in response)) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.source === 'fake_backend_client'))
})
