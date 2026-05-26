import type {
  DriveBackendErrorResponse,
  DriveBackendGetFileRequest,
  DriveBackendGetFileResponse,
  DriveBackendListCategoriesRequest,
  DriveBackendListCategoriesResponse,
  DriveBackendListFilesRequest,
  DriveBackendListFilesResponse,
} from './driveBackendContract'

const DRIVE_FILE_CATEGORIES = [
  'client_operations',
  'sa_operations',
  'creative_assets',
  'reports_insights',
  'admin_finance_legal',
  'archive',
] as const

const DRIVE_FILE_STATUSES = ['active', 'archived', 'excluded'] as const
const DRIVE_FILE_SENSITIVITIES = ['approved', 'internal', 'restricted'] as const
const FORBIDDEN_KEY_FRAGMENTS = [
  'credential',
  'token',
  'serviceaccount',
  'service_account',
  'privatekey',
  'private_key',
  'secret',
  'env',
] as const
const FORBIDDEN_RESPONSE_FRAGMENTS = [
  'credential',
  'token',
  'service_account',
  'service account',
  'private_key',
  'private key',
  '.env',
  'drive.google.com',
  'oauth',
  'secret',
] as const
const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/

export type DriveBackendRouteResponse =
  | DriveBackendListFilesResponse
  | DriveBackendGetFileResponse
  | DriveBackendListCategoriesResponse

export type DriveRouteValidationResult<T> =
  | {
      ok: true
      value: T
    }
  | DriveRouteValidationError

type DriveRouteValidationError = {
  ok: false
  response: DriveBackendErrorResponse
}

export type DriveRouteSafetyCheckResult =
  | {
      ok: true
    }
  | {
      ok: false
      response: DriveBackendErrorResponse
    }

type DriveBaseRequestValidationResult =
  | {
      ok: true
      value: DriveBackendListCategoriesRequest
      record: Record<string, unknown>
    }
  | {
      ok: false
      response: DriveBackendErrorResponse
    }

export function validateDriveBackendListFilesRequest(
  input: unknown,
): DriveRouteValidationResult<DriveBackendListFilesRequest> {
  const base = validateBaseRequest(input)

  if (!base.ok) {
    return base
  }

  const category = base.record.category
  const status = base.record.status
  const sensitivity = base.record.sensitivity
  const includeArchived = base.record.includeArchived

  if (category !== undefined && !isAllowedString(category, DRIVE_FILE_CATEGORIES)) {
    return invalidRequest(base.value.clientId)
  }

  if (status !== undefined && !isAllowedString(status, DRIVE_FILE_STATUSES)) {
    return invalidRequest(base.value.clientId)
  }

  if (sensitivity !== undefined && !isAllowedString(sensitivity, DRIVE_FILE_SENSITIVITIES)) {
    return invalidRequest(base.value.clientId)
  }

  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
    return invalidRequest(base.value.clientId)
  }

  return {
    ok: true,
    value: {
      ...base.value,
      category: category,
      status: status,
      sensitivity: sensitivity,
      includeArchived: includeArchived,
    },
  }
}

export function validateDriveBackendGetFileRequest(
  input: unknown,
): DriveRouteValidationResult<DriveBackendGetFileRequest> {
  const base = validateBaseRequest(input)

  if (!base.ok) {
    return base
  }

  const fileId = base.record.fileId
  const includeArchived = base.record.includeArchived

  if (!isSafeId(fileId)) {
    return invalidRequest(base.value.clientId)
  }

  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
    return invalidRequest(base.value.clientId)
  }

  return {
    ok: true,
    value: {
      ...base.value,
      fileId: fileId,
      includeArchived: includeArchived,
    },
  }
}

export function validateDriveBackendListCategoriesRequest(
  input: unknown,
): DriveRouteValidationResult<DriveBackendListCategoriesRequest> {
  const base = validateBaseRequest(input)

  if (!base.ok) {
    return base
  }

  const includeArchived = base.record.includeArchived

  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
    return invalidRequest(base.value.clientId)
  }

  return {
    ok: true,
    value: {
      ...base.value,
      includeArchived: includeArchived,
    },
  }
}

export function checkDriveBackendResponseSafety(
  response: DriveBackendRouteResponse,
): DriveRouteSafetyCheckResult {
  const serializedResponse = JSON.stringify(response).toLowerCase()
  const clientId = readResponseClientId(response)

  if (FORBIDDEN_RESPONSE_FRAGMENTS.some((fragment) => serializedResponse.includes(fragment))) {
    return unsafeResponse(clientId)
  }

  if ('files' in response && response.ok && response.files.some((file) => file.status === 'excluded')) {
    return unsafeResponse(clientId)
  }

  if ('file' in response && response.ok && response.file.status === 'excluded') {
    return unsafeResponse(clientId)
  }

  return { ok: true }
}

function validateBaseRequest(input: unknown): DriveBaseRequestValidationResult {
  if (!isRecord(input) || hasForbiddenRequestKeys(input)) {
    return invalidRequest(readSafeClientId(input))
  }

  if (!isSafeId(input.clientId)) {
    return invalidRequest(readSafeClientId(input))
  }

  return {
    ok: true,
    value: {
      clientId: input.clientId,
    },
    record: input,
  }
}

function invalidRequest(clientId = 'unknown-client'): DriveRouteValidationError {
  const error = {
    severity: 'warning',
    code: 'invalid_request',
    message: 'Drive backend request did not match the expected safe contract.',
  } as const

  return {
    ok: false,
    response: {
      ok: false,
      clientId,
      error,
      diagnostics: [error],
    },
  }
}

function unsafeResponse(clientId: string): DriveRouteSafetyCheckResult {
  const error = {
    severity: 'error',
    code: 'unknown_error',
    message: 'Drive backend response failed sanitized metadata safety checks.',
  } as const

  return {
    ok: false,
    response: {
      ok: false,
      clientId,
      error,
      diagnostics: [error],
    },
  }
}

function readResponseClientId(response: DriveBackendRouteResponse): string {
  return isSafeId(response.clientId) ? response.clientId : 'unknown-client'
}

function readSafeClientId(input: unknown): string | undefined {
  if (!isRecord(input) || !isSafeId(input.clientId)) {
    return undefined
  }

  return input.clientId
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSafeId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_ID_PATTERN.test(value)
}

function isAllowedString<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === 'string' && allowed.includes(value)
}

function hasForbiddenRequestKeys(record: Record<string, unknown>): boolean {
  return Object.keys(record).some((key) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9_]/gu, '')
    return FORBIDDEN_KEY_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))
  })
}
