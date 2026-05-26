export type DriveFileCategory =
  | 'client_operations'
  | 'sa_operations'
  | 'creative_assets'
  | 'reports_insights'
  | 'admin_finance_legal'
  | 'archive'

export type DriveFileSource = 'mock_drive_backend'
export type DriveFileSensitivity = 'approved' | 'internal' | 'restricted'
export type DriveFileStatus = 'active' | 'archived' | 'excluded'

export type DriveFileDiagnosticSeverity = 'info' | 'warning' | 'error'

export type DriveFileDiagnosticCode =
  | 'mock_repository_used'
  | 'archived_file_excluded'
  | 'excluded_file_blocked'
  | 'client_not_found'
  | 'file_not_found'

export type DriveFileDiagnostic = {
  severity: DriveFileDiagnosticSeverity
  code: DriveFileDiagnosticCode
  message: string
}

export type DriveFileCategorySummary = {
  id: DriveFileCategory
  name: string
  description: string
  fileCount: number
}

export type DriveFileSummary = {
  id: string
  clientId: string
  name: string
  folderId: DriveFileCategory
  folderName: string
  folderPath: string
  fileType: string
  status: DriveFileStatus
  category: DriveFileCategory
  source: DriveFileSource
  sourceUrl: string
  sensitivity: DriveFileSensitivity
  uploadedBy: string
  uploadedAt: string
}

export type DriveFileRepositoryResult = {
  clientId: string
  categories: DriveFileCategorySummary[]
  files: DriveFileSummary[]
  diagnostics: DriveFileDiagnostic[]
}
