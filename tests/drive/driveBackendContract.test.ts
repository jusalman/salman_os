import assert from 'node:assert/strict'
import test from 'node:test'

import type { DriveBackendListFilesResponse } from '../../src/domain/driveBackendContract.ts'

test('defines a sanitized Drive backend list files response contract', () => {
  const response = {
    ok: true,
    clientId: 'c1',
    categories: [
      {
        id: 'client_operations',
        name: '01_Client_Operations',
        description: 'Client operations source files',
        fileCount: 1,
      },
    ],
    files: [
      {
        fileId: 'mock-drive-file-c1-001',
        clientId: 'c1',
        displayName: '2026-05 Operations Brief.pdf',
        category: 'client_operations',
        section: 'client_operations',
        folderName: '01_Client_Operations',
        folderPath: '01_Client_Operations/Mock_Client',
        fileType: 'PDF',
        status: 'active',
        sensitivity: 'internal',
        owner: 'Operations',
        updatedAt: '2026-05-22 09:10',
        source: 'fake_backend_client',
      },
    ],
    diagnostics: [
      {
        severity: 'info',
        code: 'mock_backend_client_used',
        message: 'Fake Drive backend client returned sanitized local metadata only.',
      },
    ],
  } satisfies DriveBackendListFilesResponse

  const serializedResponse = JSON.stringify(response)

  assert.equal(response.ok, true)
  assert.equal(response.files[0].sourceUrl, undefined)
  assert.equal(response.files[0].openUrl, undefined)
  assert.equal(serializedResponse.includes('credential'), false)
  assert.equal(serializedResponse.includes('token'), false)
  assert.equal(serializedResponse.includes('service_account'), false)
  assert.equal(serializedResponse.includes('.env'), false)
  assert.equal(serializedResponse.includes('drive.google.com'), false)
})
