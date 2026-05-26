import type {
  DriveBackendDiagnostic,
  DriveBackendErrorResponse,
  DriveBackendGetFileRequest,
  DriveBackendListCategoriesRequest,
  DriveBackendListFilesRequest,
} from '../../src/domain/driveBackendContract.ts'
import type { DriveServerAdapter } from './driveServerAdapter.ts'

export const GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT = 'service_account'
export const GOOGLE_DRIVE_AUTH_MODE_ENV_KEY = 'GOOGLE_DRIVE_AUTH_MODE'
export const GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY = 'GOOGLE_DRIVE_CREDENTIAL_PATH'
export const GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY = 'GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID'

export type GoogleDriveAuthMode = typeof GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT

export type GoogleDriveServerAdapterConfigLike = Readonly<{
  authMode?: string
  credentialPath?: string
  allowedRootFolderId?: string
}>

export type GoogleDriveServerAdapterConfig = Readonly<{
  authMode: GoogleDriveAuthMode
  credentialPath: string
  allowedRootFolderId: string
}>

export type GoogleDriveServerAdapterEnvLike = Readonly<Record<string, string | undefined>>

export type GoogleDriveServerAdapterConfigValidation =
  | {
      ok: true
      config: GoogleDriveServerAdapterConfig
    }
  | {
      ok: false
      diagnostic: DriveBackendDiagnostic
    }

export function createGoogleDriveServerAdapterSkeleton(): DriveServerAdapter {
  return createUnavailableGoogleDriveServerAdapter()
}

export function createGoogleDriveServerAdapterFromConfig(
  configLike: GoogleDriveServerAdapterConfigLike,
): DriveServerAdapter {
  return createUnavailableGoogleDriveServerAdapter(configLike)
}

export function readGoogleDriveServerAdapterConfigFromEnvLike(
  envLike: GoogleDriveServerAdapterEnvLike,
): GoogleDriveServerAdapterConfigLike {
  return {
    authMode: envLike[GOOGLE_DRIVE_AUTH_MODE_ENV_KEY],
    credentialPath: envLike[GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY],
    allowedRootFolderId: envLike[GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY],
  }
}

export function validateGoogleDriveServerAdapterConfig(
  configLike: GoogleDriveServerAdapterConfigLike,
): GoogleDriveServerAdapterConfigValidation {
  if (configLike.authMode !== GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT) {
    return invalidGoogleDriveServerAdapterConfig()
  }

  if (!isSafeNonEmptyConfigValue(configLike.credentialPath)) {
    return invalidGoogleDriveServerAdapterConfig()
  }

  if (!isSafeGoogleDriveId(configLike.allowedRootFolderId)) {
    return invalidGoogleDriveServerAdapterConfig()
  }

  return {
    ok: true,
    config: {
      authMode: configLike.authMode,
      credentialPath: configLike.credentialPath,
      allowedRootFolderId: configLike.allowedRootFolderId,
    },
  }
}

export const googleDriveServerAdapterSkeleton = createGoogleDriveServerAdapterSkeleton()

function createUnavailableGoogleDriveServerAdapter(
  configLike?: GoogleDriveServerAdapterConfigLike,
): DriveServerAdapter {
  return {
    async listFiles(input) {
      return createUnavailableResponse(input, configLike)
    },
    async getFile(input) {
      return createUnavailableResponse(input, configLike)
    },
    async listCategories(input) {
      return createUnavailableResponse(input, configLike)
    },
  }
}

function createUnavailableResponse(
  input: DriveBackendListFilesRequest | DriveBackendGetFileRequest | DriveBackendListCategoriesRequest,
  configLike?: GoogleDriveServerAdapterConfigLike,
): DriveBackendErrorResponse {
  if (configLike !== undefined) {
    const validation = validateGoogleDriveServerAdapterConfig(configLike)

    if (!validation.ok) {
      return {
        ok: false,
        clientId: input.clientId,
        error: validation.diagnostic,
        diagnostics: [validation.diagnostic],
      }
    }
  }

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

function invalidGoogleDriveServerAdapterConfig(): GoogleDriveServerAdapterConfigValidation {
  return {
    ok: false,
    diagnostic: {
      severity: 'warning',
      code: 'drive_backend_unavailable',
      message: 'Actual Drive adapter config is not ready for this runtime.',
    },
  }
}

function isSafeNonEmptyConfigValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !/[\r\n]/u.test(value)
}

function isSafeGoogleDriveId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{10,200}$/u.test(value)
}
