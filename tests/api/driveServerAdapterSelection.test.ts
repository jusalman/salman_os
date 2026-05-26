import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  DRIVE_SERVER_ADAPTER_MODE_KEY,
  handleDriveServerRoute,
  handleDriveServerRouteWithAdapterSelection,
  selectDriveServerAdapter,
} from '../../api/drive/driveServerAdapter.ts'
import { handleMockDriveCategoriesRoute } from '../../api/drive/categories.ts'
import { handleMockDriveDetailRoute } from '../../api/drive/detail.ts'
import { handleMockDriveListRoute } from '../../api/drive/list.ts'

test('Drive server adapter selection defaults to the fake adapter with no mode', async () => {
  const selection = selectDriveServerAdapter()

  assert.equal(selection.ok, true)

  if (!selection.ok) {
    return
  }

  assert.equal(selection.mode, 'fake')

  const response = await selection.adapter.listFiles({ clientId: 'c1' })

  assert.equal(response.ok, true)

  if (response.ok) {
    assert.ok(response.files.every((file) => file.source === 'fake_backend_client'))
  }
})

test('Drive server adapter selection accepts explicit fake mode', async () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'fake',
  })

  assert.equal(selection.ok, true)

  if (selection.ok) {
    assert.equal(selection.mode, 'fake')
  }
})

test('Drive server adapter selection allows explicit google skeleton mode only as unavailable skeleton', async () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'google_skeleton',
  })

  assert.equal(selection.ok, true)

  if (!selection.ok) {
    return
  }

  assert.equal(selection.mode, 'google_skeleton')

  const response = await handleDriveServerRoute(
    {
      operation: 'list_files',
      body: {
        clientId: 'c1',
      },
    },
    selection.adapter,
  )

  assert.equal(response.ok, false)

  if (!response.ok) {
    assert.equal(response.error.code, 'drive_backend_unavailable')
  }
})

test('Drive server adapter selection rejects unknown modes without falling back', () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'actual',
  })
  const serializedSelection = JSON.stringify(selection).toLowerCase()

  assert.equal(selection.ok, false)

  if (selection.ok) {
    return
  }

  assert.equal(selection.response.error.code, 'invalid_request')
  assert.equal(serializedSelection.includes('actual'), false)
  assert.equal(serializedSelection.includes('credential'), false)
  assert.equal(serializedSelection.includes('token'), false)
})

test('Drive server adapter selection blocks public Google or Drive Vite keys', () => {
  const googleSelection = selectDriveServerAdapter({
    VITE_GOOGLE_CLIENT_ID: 'not-returned',
  })
  const driveSelection = selectDriveServerAdapter({
    VITE_DRIVE_MODE: 'not-returned',
  })
  const serializedSelections = JSON.stringify([googleSelection, driveSelection])

  assert.equal(googleSelection.ok, false)
  assert.equal(driveSelection.ok, false)
  assert.equal(serializedSelections.includes('VITE_GOOGLE_CLIENT_ID'), false)
  assert.equal(serializedSelections.includes('VITE_DRIVE_MODE'), false)
  assert.equal(serializedSelections.includes('not-returned'), false)
})

test('default mock Drive route remains on fake adapter without selection input', async () => {
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

test('mock Drive route test path accepts explicit fake adapter selection', async () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'fake',
  })
  const response = await handleMockDriveCategoriesRoute(
    {
      clientId: 'c1',
    },
    selection,
  )

  assert.equal(response.ok, true)

  if (response.ok && 'categories' in response) {
    assert.ok(response.categories.length > 0)
  }
})

test('mock Drive route test path accepts explicit google skeleton selection safely', async () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'google_skeleton',
  })
  const response = await handleMockDriveDetailRoute(
    {
      clientId: 'c1',
      fileId: 'mock-drive-file-c1-001',
    },
    selection,
  )

  assert.equal(response.ok, false)

  if (!response.ok) {
    assert.equal(response.error.code, 'drive_backend_unavailable')
  }
})

test('mock Drive route test path returns rejected adapter selection without route fallback', async () => {
  const selection = selectDriveServerAdapter({
    [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'actual',
  })
  const response = await handleMockDriveListRoute(
    {
      clientId: 'c1',
    },
    selection,
  )
  const serializedResponse = JSON.stringify(response).toLowerCase()

  assert.equal(response.ok, false)

  if (!response.ok) {
    assert.equal(response.error.code, 'invalid_request')
  }

  assert.equal(serializedResponse.includes('actual'), false)
})

test('direct Drive route selection helper returns Vite Google or Drive selection blocks safely', async () => {
  const googleSelection = selectDriveServerAdapter({
    VITE_GOOGLE_CLIENT_ID: 'not-returned',
  })
  const driveSelection = selectDriveServerAdapter({
    VITE_DRIVE_MODE: 'not-returned',
  })

  const googleResponse = await handleDriveServerRouteWithAdapterSelection(
    {
      operation: 'list_files',
      body: {
        clientId: 'c1',
      },
    },
    googleSelection,
  )
  const driveResponse = await handleDriveServerRouteWithAdapterSelection(
    {
      operation: 'list_categories',
      body: {
        clientId: 'c1',
      },
    },
    driveSelection,
  )
  const serializedResponses = JSON.stringify([googleResponse, driveResponse])

  assert.equal(googleResponse.ok, false)
  assert.equal(driveResponse.ok, false)

  if (!googleResponse.ok) {
    assert.equal(googleResponse.error.code, 'invalid_request')
  }

  if (!driveResponse.ok) {
    assert.equal(driveResponse.error.code, 'invalid_request')
  }

  assert.equal(serializedResponses.includes('VITE_GOOGLE_CLIENT_ID'), false)
  assert.equal(serializedResponses.includes('VITE_DRIVE_MODE'), false)
  assert.equal(serializedResponses.includes('not-returned'), false)
})

test('Drive server adapter selection guard does not import googleapis or read runtime env', async () => {
  const source = await readFile(new URL('../../api/drive/driveServerAdapter.ts', import.meta.url), 'utf8')

  assert.equal(source.includes('googleapis'), false)
  assert.equal(source.includes('process.env'), false)
  assert.equal(source.includes('import.meta.env'), false)
})
