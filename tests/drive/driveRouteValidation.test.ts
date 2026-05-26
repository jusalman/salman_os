import assert from 'node:assert/strict'
import test from 'node:test'

import {
  checkDriveBackendResponseSafety,
  validateDriveBackendGetFileRequest,
  validateDriveBackendListCategoriesRequest,
  validateDriveBackendListFilesRequest,
} from '../../src/domain/driveRouteValidation.ts'

test('validates safe Drive backend list file requests', () => {
  const result = validateDriveBackendListFilesRequest({
    clientId: 'c1',
    category: 'sa_operations',
    status: 'active',
    sensitivity: 'internal',
    includeArchived: false,
  })

  assert.equal(result.ok, true)

  if (!result.ok) {
    return
  }

  assert.equal(result.value.clientId, 'c1')
  assert.equal(result.value.category, 'sa_operations')
})

test('rejects invalid Drive backend request filters with safe diagnostics', () => {
  const result = validateDriveBackendListFilesRequest({
    clientId: 'c1',
    category: 'unknown_category',
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (result.ok) {
    return
  }

  assert.equal(result.response.error.code, 'invalid_request')
  assert.equal(serializedResult.includes('unknown_category'), false)
  assert.equal(serializedResult.includes('credential'), false)
  assert.equal(serializedResult.includes('token'), false)
})

test('rejects credential-shaped request keys before route handling', () => {
  const result = validateDriveBackendGetFileRequest({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-001',
    credentialPath: 'not-returned',
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (result.ok) {
    return
  }

  assert.equal(result.response.error.code, 'invalid_request')
  assert.equal(serializedResult.includes('not-returned'), false)
})

test('rejects unexpected request keys before route handling', () => {
  const result = validateDriveBackendListFilesRequest({
    clientId: 'c1',
    category: 'client_operations',
    rawDriveUrl: 'not-returned',
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (result.ok) {
    return
  }

  assert.equal(result.response.error.code, 'invalid_request')
  assert.equal(serializedResult.includes('rawDriveUrl'), false)
  assert.equal(serializedResult.includes('not-returned'), false)
})

test('validates list categories requests without requiring route files', () => {
  const result = validateDriveBackendListCategoriesRequest({
    clientId: 'c1',
    includeArchived: true,
  })

  assert.equal(result.ok, true)

  if (!result.ok) {
    return
  }

  assert.equal(result.value.includeArchived, true)
})

test('flags backend responses that contain unsafe metadata', () => {
  const result = checkDriveBackendResponseSafety({
    ok: true,
    clientId: 'c1',
    categories: [],
    files: [
      {
        fileId: 'mock-drive-file-c1-001',
        clientId: 'c1',
        displayName: 'Unsafe.pdf',
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
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (result.ok) {
    return
  }

  assert.equal(result.response.error.code, 'unknown_error')
  assert.equal(serializedResult.includes('drive.google.com'), false)
})

test('flags backend responses that contain camelCase secret metadata', () => {
  const result = checkDriveBackendResponseSafety({
    ok: false,
    clientId: 'c1',
    error: {
      severity: 'error',
      code: 'unknown_error',
      message: 'server rejected serviceAccount privateKey metadata',
    },
    diagnostics: [],
  })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.ok, false)

  if (result.ok) {
    return
  }

  assert.equal(result.response.error.code, 'unknown_error')
  assert.equal(serializedResult.includes('serviceAccount'), false)
  assert.equal(serializedResult.includes('privateKey'), false)
})
