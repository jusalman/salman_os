import type {
  DriveBackendDiagnostic,
  DriveBackendErrorResponse,
  DriveBackendGetFileRequest,
  DriveBackendListCategoriesRequest,
  DriveBackendListFilesRequest,
} from '../../src/domain/driveBackendContract.ts'
import type { DriveServerAdapter } from './driveServerAdapter.ts'

export function createGoogleDriveServerAdapterSkeleton(): DriveServerAdapter {
  return {
    async listFiles(input) {
      return createUnavailableResponse(input)
    },
    async getFile(input) {
      return createUnavailableResponse(input)
    },
    async listCategories(input) {
      return createUnavailableResponse(input)
    },
  }
}

export const googleDriveServerAdapterSkeleton = createGoogleDriveServerAdapterSkeleton()

function createUnavailableResponse(
  input: DriveBackendListFilesRequest | DriveBackendGetFileRequest | DriveBackendListCategoriesRequest,
): DriveBackendErrorResponse {
  const error: DriveBackendDiagnostic = {
    severity: 'warning',
    code: 'drive_backend_unavailable',
    message: 'Actual Drive adapter is not active for this runtime.',
  }

  return {
    ok: false,
    clientId: input.clientId,
    error,
    diagnostics: [error],
  }
}
