import type {
  DriveBackendClient,
  DriveBackendErrorResponse,
} from '../../../domain/driveBackendContract'
import {
  checkDriveBackendResponseSafety,
  validateDriveBackendGetFileRequest,
  validateDriveBackendListCategoriesRequest,
  validateDriveBackendListFilesRequest,
  type DriveBackendRouteResponse,
} from '../../../domain/driveRouteValidation.ts'
import { driveBackendFakeClient } from './driveBackendFakeClient.ts'

export type DriveRouteHarnessOperation = 'list_files' | 'get_file' | 'list_categories'

export type DriveRouteHandlerHarnessRequest = {
  operation: unknown
  body: unknown
}

export async function handleDriveRouteHarness(
  request: DriveRouteHandlerHarnessRequest,
  client: DriveBackendClient = driveBackendFakeClient,
): Promise<DriveBackendRouteResponse> {
  const response = await handleValidatedDriveRouteHarness(request, client)
  const safetyCheck = checkDriveBackendResponseSafety(response)

  return safetyCheck.ok ? response : safetyCheck.response
}

async function handleValidatedDriveRouteHarness(
  request: DriveRouteHandlerHarnessRequest,
  client: DriveBackendClient,
): Promise<DriveBackendRouteResponse> {
  if (request.operation === 'list_files') {
    const validated = validateDriveBackendListFilesRequest(request.body)
    return validated.ok ? client.listFiles(validated.value) : validated.response
  }

  if (request.operation === 'get_file') {
    const validated = validateDriveBackendGetFileRequest(request.body)
    return validated.ok ? client.getFile(validated.value) : validated.response
  }

  if (request.operation === 'list_categories') {
    const validated = validateDriveBackendListCategoriesRequest(request.body)
    return validated.ok ? client.listCategories(validated.value) : validated.response
  }

  return createInvalidOperationResponse()
}

function createInvalidOperationResponse(): DriveBackendErrorResponse {
  const error = {
    severity: 'warning',
    code: 'invalid_request',
    message: 'Drive backend route harness operation is not supported.',
  } as const

  return {
    ok: false,
    clientId: 'unknown-client',
    error,
    diagnostics: [error],
  }
}
