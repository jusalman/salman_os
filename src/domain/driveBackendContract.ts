import type {
  DriveFileCategory,
  DriveFileCategorySummary,
  DriveFileSensitivity,
  DriveFileStatus,
} from './driveFiles'

export type DriveBackendFileSource = 'fake_backend_client' | 'server_drive_route'

export type DriveBackendErrorCode =
  | 'client_not_found'
  | 'file_not_found'
  | 'invalid_request'
  | 'permission_denied'
  | 'drive_backend_unavailable'
  | 'unknown_error'

export type DriveBackendDiagnosticCode =
  | 'mock_backend_client_used'
  | 'archived_file_excluded'
  | 'excluded_file_blocked'
  | DriveBackendErrorCode

export type DriveBackendDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: DriveBackendDiagnosticCode
  message: string
}

export type DriveBackendFileSummary = {
  fileId: string
  clientId: string
  displayName: string
  category: DriveFileCategory
  section: DriveFileCategory
  folderName: string
  folderPath: string
  fileType: string
  status: DriveFileStatus
  sensitivity: DriveFileSensitivity
  owner: string
  updatedAt: string
  source: DriveBackendFileSource
  sourceUrl?: string
  openUrl?: string
}

export type DriveBackendListFilesRequest = {
  clientId: string
  category?: DriveFileCategory
  status?: DriveFileStatus
  sensitivity?: DriveFileSensitivity
  includeArchived?: boolean
}

export type DriveBackendGetFileRequest = {
  clientId: string
  fileId: string
  includeArchived?: boolean
}

export type DriveBackendListCategoriesRequest = {
  clientId: string
  includeArchived?: boolean
}

export type DriveBackendListFilesResponse =
  | {
      ok: true
      clientId: string
      categories: DriveFileCategorySummary[]
      files: DriveBackendFileSummary[]
      diagnostics: DriveBackendDiagnostic[]
    }
  | DriveBackendErrorResponse

export type DriveBackendGetFileResponse =
  | {
      ok: true
      clientId: string
      file: DriveBackendFileSummary
      diagnostics: DriveBackendDiagnostic[]
    }
  | DriveBackendErrorResponse

export type DriveBackendListCategoriesResponse =
  | {
      ok: true
      clientId: string
      categories: DriveFileCategorySummary[]
      diagnostics: DriveBackendDiagnostic[]
    }
  | DriveBackendErrorResponse

export type DriveBackendErrorResponse = {
  ok: false
  clientId: string
  error: DriveBackendDiagnostic
  diagnostics: DriveBackendDiagnostic[]
}

export type DriveBackendClient = {
  listFiles(input: DriveBackendListFilesRequest): Promise<DriveBackendListFilesResponse>
  getFile(input: DriveBackendGetFileRequest): Promise<DriveBackendGetFileResponse>
  listCategories(
    input: DriveBackendListCategoriesRequest,
  ): Promise<DriveBackendListCategoriesResponse>
}
