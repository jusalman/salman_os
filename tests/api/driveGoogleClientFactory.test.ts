import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import test from 'node:test'

import {
  GOOGLE_DRIVE_READONLY_SCOPE,
  createGoogleDriveClientFactory,
  type GoogleDriveServiceAccountAuthInput,
} from '../../api/drive/googleDriveClientFactory.ts'
import { runGoogleDriveListSmoke } from '../../api/drive/googleDriveListSmoke.ts'
import {
  GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
  GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY,
} from '../../api/drive/googleDriveServerAdapter.ts'
import { handleMockDriveListRoute } from '../../api/drive/list.ts'

test('Google Drive client factory builds a service account client through injected deps only', () => {
  const calls: {
    authInputs: GoogleDriveServiceAccountAuthInput[]
    driveInputs: unknown[]
  } = {
    authInputs: [],
    driveInputs: [],
  }
  const fakeAuth = { kind: 'fake-auth' }
  const fakeClient = { files: { list() {} } }
  const result = createGoogleDriveClientFactory(
    {
      authMode: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
      credentialPath: 'C:/local-only/drive-key.json',
      allowedRootFolderId: 'driveRootFolder_12345',
    },
    {
      createServiceAccountAuth(input) {
        calls.authInputs.push(input)
        return fakeAuth
      },
      createDriveClient(input) {
        calls.driveInputs.push(input)
        return fakeClient as never
      },
    },
  )

  assert.equal(result.ok, true)

  if (!result.ok) {
    return
  }

  assert.equal(result.client, fakeClient)
  assert.equal(result.authMode, GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT)
  assert.deepEqual(result.scopes, [GOOGLE_DRIVE_READONLY_SCOPE])
  assert.equal(JSON.stringify(result).includes('C:/local-only/drive-key.json'), false)
  assert.equal(calls.authInputs.length, 1)
  assert.equal(calls.driveInputs.length, 1)
  assert.equal(calls.authInputs[0]?.credentialPath, 'C:/local-only/drive-key.json')
})

test('Google Drive client factory returns safe diagnostics for invalid config', () => {
  const result = createGoogleDriveClientFactory({
    authMode: 'oauth',
    credentialPath: 'SECRET_PATH_SHOULD_NOT_LEAK',
    allowedRootFolderId: 'driveRootFolder_12345',
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (!result.ok) {
    assert.equal(result.diagnostic.code, 'drive_backend_unavailable')
  }

  assert.equal(serializedResult.includes('SECRET_PATH_SHOULD_NOT_LEAK'), false)
  assert.equal(serializedResult.includes('oauth'), false)
  assert.equal(serializedResult.includes('credential'), false)
  assert.equal(serializedResult.includes('token'), false)
})

test('googleapis import boundary stays out of src and route default runtime', async () => {
  const srcHits = await findFilesContaining('src', 'googleapis')
  const apiHits = await findFilesContaining('api', 'googleapis')
  const response = await handleMockDriveListRoute({
    clientId: 'c1',
  })

  assert.deepEqual(srcHits, [])
  assert.deepEqual(apiHits, ['api\\drive\\googleDriveClientFactory.ts'])
  assert.equal(response.ok, true)

  if (response.ok && 'files' in response) {
    assert.ok(response.files.every((file) => file.source === 'fake_backend_client'))
  }
})

test('local smoke gate script is explicit and is not part of default verification scripts', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8')) as {
    scripts: Record<string, string>
  }
  const scriptSource = await readFile(
    new URL('../../scripts/driveLocalSmokeGate.ts', import.meta.url),
    'utf8',
  )

  assert.equal(packageJson.scripts['drive:smoke:gate'], 'node scripts/driveLocalSmokeGate.ts')
  assert.equal(packageJson.scripts['drive:smoke:list'], 'node scripts/driveListSmoke.ts')
  assert.equal(packageJson.scripts.build.includes('drive:smoke:gate'), false)
  assert.equal(packageJson.scripts.build.includes('drive:smoke:list'), false)
  assert.equal(packageJson.scripts.lint.includes('drive:smoke:gate'), false)
  assert.equal(packageJson.scripts.lint.includes('drive:smoke:list'), false)
  assert.equal(scriptSource.includes('googleapis'), false)
  assert.equal(scriptSource.includes('drive.files'), false)
})

test('local smoke gate reports setting names only', async () => {
  const { evaluateGoogleDriveLocalSmokeGate } = await import(
    '../../api/drive/googleDriveLocalSmokeGate.ts'
  )
  const report = evaluateGoogleDriveLocalSmokeGate({
    [GOOGLE_DRIVE_AUTH_MODE_ENV_KEY]: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
    [GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY]: 'SECRET_PATH_SHOULD_NOT_PRINT',
    [GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY]: 'driveRootFolder_12345',
    VITE_GOOGLE_CLIENT_ID: 'PUBLIC_VALUE_SHOULD_NOT_PRINT',
  })
  const serializedReport = JSON.stringify(report)

  assert.equal(report.ok, false)
  assert.ok(report.forbiddenPublicEnvNames.includes('VITE_GOOGLE_CLIENT_ID'))
  assert.equal(serializedReport.includes('SECRET_PATH_SHOULD_NOT_PRINT'), false)
  assert.equal(serializedReport.includes('PUBLIC_VALUE_SHOULD_NOT_PRINT'), false)
})

test('Drive list smoke runner stops at gate before API work when settings are missing', async () => {
  let authCalls = 0
  const result = await runGoogleDriveListSmoke(
    {},
    {
      createServiceAccountAuth() {
        authCalls += 1
        return {}
      },
      createDriveClient() {
        throw new Error('Drive client should not be created before gate passes.')
      },
    },
  )

  assert.equal(result.ok, false)
  assert.equal(result.reason, 'gate_not_ready')
  assert.equal(authCalls, 0)
  assert.equal(JSON.stringify(result).includes('credential'), false)
})

test('Drive list smoke runner outputs sanitized summary from a stubbed Drive client only', async () => {
  const result = await runGoogleDriveListSmoke(
    {
      DRIVE_SERVER_ADAPTER_MODE: 'google_skeleton',
      [GOOGLE_DRIVE_AUTH_MODE_ENV_KEY]: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
      [GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY]: 'SECRET_PATH_SHOULD_NOT_PRINT',
      [GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY]: 'driveRootFolder_12345',
    },
    {
      createServiceAccountAuth() {
        return { kind: 'fake-auth' }
      },
      createDriveClient() {
        return {
          files: {
            async list() {
              return {
                data: {
                  nextPageToken: 'SECRET_NEXT_PAGE_TOKEN_SHOULD_NOT_PRINT',
                  files: [
                    {
                      id: 'SECRET_FILE_ID_SHOULD_NOT_PRINT',
                      name: 'Sensitive Client File.pdf',
                      mimeType: 'application/pdf',
                      modifiedTime: '2026-05-01T00:00:00.000Z',
                    },
                  ],
                },
              }
            },
          },
        } as never
      },
    },
  )
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, true)
  assert.equal(result.reason, 'ok')
  assert.ok(result.lines.includes('Returned file count: 1'))
  assert.ok(result.lines.includes('Additional pages present: yes'))
  assert.equal(serializedResult.includes('SECRET_PATH_SHOULD_NOT_PRINT'), false)
  assert.equal(serializedResult.includes('SECRET_NEXT_PAGE_TOKEN_SHOULD_NOT_PRINT'), false)
  assert.equal(serializedResult.includes('SECRET_FILE_ID_SHOULD_NOT_PRINT'), false)
  assert.equal(serializedResult.includes('Sensitive Client File.pdf'), false)
})

async function findFilesContaining(root: string, pattern: string): Promise<string[]> {
  const hits: string[] = []

  await visit(root, hits, pattern)

  return hits.sort()
}

async function visit(path: string, hits: string[], pattern: string): Promise<void> {
  const entries = await readdir(path, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      const childPath = join(path, entry.name)

      if (entry.isDirectory()) {
        await visit(childPath, hits, pattern)
        return
      }

      const source = await readFile(childPath, 'utf8')

      if (source.includes(pattern)) {
        hits.push(childPath)
      }
    }),
  )
}
