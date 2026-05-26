import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createFakeDriveServerAdapter,
  handleDriveServerRoute,
  type DriveServerAdapter,
} from '../../api/drive/driveServerAdapter.ts'
import { handleMockDriveListRoute } from '../../api/drive/list.ts'

test('fake Drive server adapter uses the existing sanitized backend client', async () => {
  const adapter = createFakeDriveServerAdapter()
  const response = await adapter.listFiles({ clientId: 'c1' })

  assert.equal(response.ok, true)

  if (!response.ok) {
    return
  }

  assert.ok(response.files.length > 0)
  assert.ok(response.files.every((file) => file.source === 'fake_backend_client'))
  assert.ok(response.files.every((file) => file.status === 'active'))
})

test('Drive server route applies validator and safety checks to injected adapters', async () => {
  const response = await handleMockDriveListRoute(
    {
      clientId: 'c1',
    },
    createUnsafeDriveServerAdapter(),
  )
  const serializedResponse = JSON.stringify(response)

  assert.equal(response.ok, false)

  if (response.ok) {
    return
  }

  assert.equal(response.error.code, 'unknown_error')
  assert.equal(serializedResponse.includes('drive.google.com'), false)
})

test('Drive server route rejects invalid request bodies before calling injected adapters', async () => {
  let adapterCalls = 0
  const adapter = createCountingDriveServerAdapter(() => {
    adapterCalls += 1
  })
  const response = await handleDriveServerRoute(
    {
      operation: 'list_files',
      body: {
        clientId: 'c1',
        unexpected: 'not-allowed',
      },
    },
    adapter,
  )

  assert.equal(response.ok, false)
  assert.equal(adapterCalls, 0)
})

function createUnsafeDriveServerAdapter(): DriveServerAdapter {
  return {
    async listFiles(input) {
      return {
        ok: true,
        clientId: input.clientId,
        categories: [],
        files: [
          {
            fileId: 'mock-drive-file-c1-unsafe',
            clientId: input.clientId,
            displayName: 'Unsafe Drive URL.pdf',
            category: 'client_operations',
            section: 'client_operations',
            folderName: '01_Client_Operations',
            folderPath: '01_Client_Operations/Mock_Client',
            fileType: 'PDF',
            status: 'active',
            sensitivity: 'internal',
            owner: 'Operations',
            updatedAt: '2026-05-22 09:10',
            source: 'server_drive_route',
            sourceUrl: 'https://drive.google.com/file/d/raw',
          },
        ],
        diagnostics: [],
      }
    },
    async getFile(input) {
      return {
        ok: false,
        clientId: input.clientId,
        error: {
          severity: 'warning',
          code: 'file_not_found',
          message: 'Drive file was not found.',
        },
        diagnostics: [],
      }
    },
    async listCategories(input) {
      return {
        ok: true,
        clientId: input.clientId,
        categories: [],
        diagnostics: [],
      }
    },
  }
}

function createCountingDriveServerAdapter(onCall: () => void): DriveServerAdapter {
  return {
    async listFiles(input) {
      onCall()

      return {
        ok: true,
        clientId: input.clientId,
        categories: [],
        files: [],
        diagnostics: [],
      }
    },
    async getFile(input) {
      onCall()

      return {
        ok: false,
        clientId: input.clientId,
        error: {
          severity: 'warning',
          code: 'file_not_found',
          message: 'Drive file was not found.',
        },
        diagnostics: [],
      }
    },
    async listCategories(input) {
      onCall()

      return {
        ok: true,
        clientId: input.clientId,
        categories: [],
        diagnostics: [],
      }
    },
  }
}
