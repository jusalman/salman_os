import assert from 'node:assert/strict'
import test from 'node:test'

import { driveFileMockRepository } from '../../src/data/adapters/mock/driveFileMockRepository.ts'

test('returns active mock Drive files through the repository boundary', async () => {
  const result = await driveFileMockRepository.listDriveFiles({ clientId: 'c1' })

  assert.equal(result.clientId, 'c1')
  assert.ok(result.files.length > 0)
  assert.ok(result.files.every((file) => file.source === 'mock_drive_backend'))
  assert.ok(result.files.every((file) => file.status === 'active'))
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'mock_repository_used'))
})

test('filters mock Drive files by category, status, and sensitivity', async () => {
  const byCategory = await driveFileMockRepository.listDriveFiles({
    clientId: 'c1',
    category: 'sa_operations',
  })
  const byStatus = await driveFileMockRepository.listDriveFiles({
    clientId: 'c1',
    includeArchived: true,
    status: 'archived',
  })
  const bySensitivity = await driveFileMockRepository.listDriveFiles({
    clientId: 'c1',
    sensitivity: 'internal',
  })

  assert.ok(byCategory.files.length > 0)
  assert.ok(byCategory.files.every((file) => file.category === 'sa_operations'))
  assert.ok(byStatus.files.length > 0)
  assert.ok(byStatus.files.every((file) => file.status === 'archived'))
  assert.ok(bySensitivity.files.length > 0)
  assert.ok(bySensitivity.files.every((file) => file.sensitivity === 'internal'))
})

test('excludes archived and restricted files from the default list', async () => {
  const result = await driveFileMockRepository.listDriveFiles({ clientId: 'c1' })
  const serializedResult = JSON.stringify(result)

  assert.equal(result.files.some((file) => file.status === 'archived'), false)
  assert.equal(result.files.some((file) => file.status === 'excluded'), false)
  assert.equal(serializedResult.includes('Do Not Index Working Notes'), false)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'archived_file_excluded'))
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'excluded_file_blocked'))
})

test('returns safe diagnostics and no real Drive URL or credential metadata', async () => {
  const result = await driveFileMockRepository.listDriveFiles({ clientId: 'unknown-client' })
  const serializedResult = JSON.stringify(result)

  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'client_not_found'))
  assert.equal(serializedResult.includes('credential'), false)
  assert.equal(serializedResult.includes('token'), false)
  assert.equal(serializedResult.includes('service_account'), false)
  assert.equal(serializedResult.includes('drive.google.com'), false)
})

test('gets a mock Drive file by id without widening default archived access', async () => {
  const activeFile = await driveFileMockRepository.getDriveFileById({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-001',
  })
  const archivedFile = await driveFileMockRepository.getDriveFileById({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-004',
  })
  const archivedFileWithOptIn = await driveFileMockRepository.getDriveFileById({
    clientId: 'c1',
    fileId: 'mock-drive-file-c1-004',
    includeArchived: true,
  })

  assert.equal(activeFile?.id, 'mock-drive-file-c1-001')
  assert.equal(archivedFile, undefined)
  assert.equal(archivedFileWithOptIn?.status, 'archived')
})

test('lists Drive categories with counts from the mock repository boundary', async () => {
  const categories = await driveFileMockRepository.listDriveFileCategories({ clientId: 'c1' })
  const saCategory = categories.find((category) => category.id === 'sa_operations')
  const archiveCategory = categories.find((category) => category.id === 'archive')

  assert.equal(saCategory?.fileCount, 1)
  assert.equal(archiveCategory?.fileCount, 0)
})
