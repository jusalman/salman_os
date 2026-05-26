import type {
  DriveBackendClient,
  DriveBackendDiagnostic,
  DriveBackendErrorResponse,
} from '../../src/domain/driveBackendContract.ts'
import {
  handleDriveRouteHarness,
  type DriveRouteHandlerHarnessRequest,
} from '../../src/data/adapters/mock/driveRouteFakeHandler.ts'
import { driveBackendFakeClient } from '../../src/data/adapters/mock/driveBackendFakeClient.ts'
import type { DriveBackendRouteResponse } from '../../src/domain/driveRouteValidation.ts'
import { googleDriveServerAdapterSkeleton } from './googleDriveServerAdapter.ts'

export type DriveServerAdapter = DriveBackendClient
export type DriveServerAdapterMode = 'fake' | 'google_skeleton'
export type DriveServerAdapterEnvLike = Readonly<Record<string, string | undefined>>

export type DriveServerAdapterSelection =
  | {
      ok: true
      mode: DriveServerAdapterMode
      adapter: DriveServerAdapter
    }
  | {
      ok: false
      response: DriveBackendErrorResponse
    }

export type DriveServerAdapterInput = DriveServerAdapter | DriveServerAdapterSelection

export const DRIVE_SERVER_ADAPTER_MODE_KEY = 'DRIVE_SERVER_ADAPTER_MODE'

export const fakeDriveServerAdapter: DriveServerAdapter = driveBackendFakeClient

export function createFakeDriveServerAdapter(): DriveServerAdapter {
  return fakeDriveServerAdapter
}

export function selectDriveServerAdapter(
  envLike: DriveServerAdapterEnvLike = {},
): DriveServerAdapterSelection {
  if (hasForbiddenPublicDriveKey(envLike)) {
    return {
      ok: false,
      response: createAdapterSelectionRejectedResponse(),
    }
  }

  const mode = envLike[DRIVE_SERVER_ADAPTER_MODE_KEY]?.trim()

  if (!mode) {
    return {
      ok: true,
      mode: 'fake',
      adapter: fakeDriveServerAdapter,
    }
  }

  if (mode === 'fake') {
    return {
      ok: true,
      mode: 'fake',
      adapter: fakeDriveServerAdapter,
    }
  }

  if (mode === 'google_skeleton') {
    return {
      ok: true,
      mode: 'google_skeleton',
      adapter: googleDriveServerAdapterSkeleton,
    }
  }

  return {
    ok: false,
    response: createAdapterSelectionRejectedResponse(),
  }
}

export async function handleDriveServerRoute(
  request: DriveRouteHandlerHarnessRequest,
  adapter: DriveServerAdapter = fakeDriveServerAdapter,
): Promise<DriveBackendRouteResponse> {
  return handleDriveRouteHarness(request, adapter)
}

export async function handleDriveServerRouteWithAdapterSelection(
  request: DriveRouteHandlerHarnessRequest,
  selection: DriveServerAdapterSelection,
): Promise<DriveBackendRouteResponse> {
  if (!selection.ok) {
    return selection.response
  }

  return handleDriveServerRoute(request, selection.adapter)
}

export async function handleDriveServerRouteWithAdapterInput(
  request: DriveRouteHandlerHarnessRequest,
  input?: DriveServerAdapterInput,
): Promise<DriveBackendRouteResponse> {
  if (input === undefined) {
    return handleDriveServerRoute(request)
  }

  if (isDriveServerAdapterSelection(input)) {
    return handleDriveServerRouteWithAdapterSelection(request, input)
  }

  return handleDriveServerRoute(request, input)
}

function hasForbiddenPublicDriveKey(envLike: DriveServerAdapterEnvLike): boolean {
  return Object.keys(envLike).some((key) => /^VITE_(GOOGLE|DRIVE)(_|$)/u.test(key))
}

function isDriveServerAdapterSelection(input: DriveServerAdapterInput): input is DriveServerAdapterSelection {
  return 'ok' in input
}

function createAdapterSelectionRejectedResponse(): DriveBackendErrorResponse {
  const error: DriveBackendDiagnostic = {
    severity: 'warning',
    code: 'invalid_request',
    message: 'Drive adapter selection was rejected.',
  }

  return {
    ok: false,
    clientId: 'unknown-client',
    error,
    diagnostics: [error],
  }
}
