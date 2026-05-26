import type {
  DriveFileCategory,
  DriveFileCategorySummary,
  DriveFileDiagnostic,
  DriveFileRepositoryResult,
  DriveFileSensitivity,
  DriveFileStatus,
  DriveFileSummary,
} from '../../../domain/driveFiles'
import type {
  DriveFileRepository,
  ListDriveFileCategoriesInput,
  ListDriveFilesInput,
} from '../../repositories/driveFileRepository'

const DRIVE_FILE_CATEGORIES: Omit<DriveFileCategorySummary, 'fileCount'>[] = [
  {
    id: 'client_operations',
    name: '01_Client_Operations',
    description: 'Client operations source files',
  },
  {
    id: 'sa_operations',
    name: '04_SA_Operations',
    description: 'Search ads operations files',
  },
  {
    id: 'creative_assets',
    name: '06_Creative_Assets',
    description: 'Creative and production files',
  },
  {
    id: 'reports_insights',
    name: '08_Reports_Insights',
    description: 'Reports and insights files',
  },
  {
    id: 'admin_finance_legal',
    name: '12_Admin_Finance_Legal',
    description: 'Admin, finance, and legal files',
  },
  {
    id: 'archive',
    name: '99_Archive',
    description: 'Archived files kept instead of deleted',
  },
]

const MOCK_DRIVE_FILES: DriveFileSummary[] = [
  createMockDriveFile({
    id: 'mock-drive-file-c1-001',
    clientId: 'c1',
    name: '2026-05 Operations Brief.pdf',
    category: 'client_operations',
    fileType: 'PDF',
    uploadedBy: 'Operations',
    uploadedAt: '2026-05-22 09:10',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c1-002',
    clientId: 'c1',
    name: 'SA Keyword Review.xlsx',
    category: 'sa_operations',
    fileType: 'Sheet',
    uploadedBy: 'Ads',
    uploadedAt: '2026-05-22 10:30',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c1-003',
    clientId: 'c1',
    name: 'Creative Rotation Set.png',
    category: 'creative_assets',
    fileType: 'Image',
    uploadedBy: 'Creative',
    uploadedAt: '2026-05-21 16:20',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c1-004',
    clientId: 'c1',
    name: 'Previous Budget Draft.xlsx',
    category: 'archive',
    fileType: 'Sheet',
    status: 'archived',
    uploadedBy: 'Operations',
    uploadedAt: '2026-05-14 18:00',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c1-005',
    clientId: 'c1',
    name: 'Do Not Index Working Notes.docx',
    category: 'client_operations',
    fileType: 'Doc',
    status: 'excluded',
    sensitivity: 'restricted',
    uploadedBy: 'Operations',
    uploadedAt: '2026-05-13 11:00',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c2-001',
    clientId: 'c2',
    name: 'Billing Follow Up Checklist.docx',
    category: 'client_operations',
    fileType: 'Doc',
    uploadedBy: 'Operations',
    uploadedAt: '2026-05-22 08:15',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c2-002',
    clientId: 'c2',
    name: 'DA Asset QA Notes.pdf',
    category: 'creative_assets',
    fileType: 'PDF',
    uploadedBy: 'Creative',
    uploadedAt: '2026-05-21 13:40',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c2-003',
    clientId: 'c2',
    name: 'Weekly Performance Summary.pdf',
    category: 'reports_insights',
    fileType: 'PDF',
    uploadedBy: 'Reports',
    uploadedAt: '2026-05-20 17:30',
  }),
  createMockDriveFile({
    id: 'mock-drive-file-c3-001',
    clientId: 'c3',
    name: 'Closeout Reference Pack.zip',
    category: 'archive',
    fileType: 'Archive',
    status: 'archived',
    uploadedBy: 'Operations',
    uploadedAt: '2026-05-20 15:30',
  }),
]

export const driveFileMockRepository: DriveFileRepository = {
  async listDriveFiles(input) {
    return listMockDriveFiles(input)
  },

  async getDriveFileById(input) {
    const result = listMockDriveFiles({
      clientId: input.clientId,
      includeArchived: input.includeArchived,
    })

    return result.files.find((file) => file.id === input.fileId)
  },

  async listDriveFileCategories(input) {
    return buildCategories(input.clientId, input.includeArchived)
  },
}

function listMockDriveFiles({
  clientId,
  category,
  status,
  sensitivity,
  includeArchived = false,
}: ListDriveFilesInput): DriveFileRepositoryResult {
  const clientFiles = MOCK_DRIVE_FILES.filter((file) => file.clientId === clientId)
  const diagnostics = createBaseDiagnostics(clientFiles, includeArchived)
  let files = clientFiles.filter((file) => shouldIncludeFile(file, includeArchived))

  if (category) {
    files = files.filter((file) => file.category === category)
  }

  if (status) {
    files = files.filter((file) => file.status === status)
  }

  if (sensitivity) {
    files = files.filter((file) => file.sensitivity === sensitivity)
  }

  return {
    clientId,
    categories: buildCategories(clientId, includeArchived),
    files,
    diagnostics,
  }
}

function createMockDriveFile({
  id,
  clientId,
  name,
  category,
  fileType,
  uploadedBy,
  uploadedAt,
  status = 'active',
  sensitivity = 'internal',
}: {
  id: string
  clientId: string
  name: string
  category: DriveFileCategory
  fileType: string
  uploadedBy: string
  uploadedAt: string
  status?: DriveFileStatus
  sensitivity?: DriveFileSensitivity
}): DriveFileSummary {
  const folderName = getFolderName(category)

  return {
    id,
    clientId,
    name,
    folderId: category,
    folderName,
    folderPath: `${folderName}/Mock_Client`,
    fileType,
    status,
    category,
    source: 'mock_drive_backend',
    sourceUrl: '',
    sensitivity,
    uploadedBy,
    uploadedAt,
  }
}

function buildCategories(
  clientId: ListDriveFileCategoriesInput['clientId'],
  includeArchived = false,
): DriveFileCategorySummary[] {
  const files = MOCK_DRIVE_FILES.filter(
    (file) => file.clientId === clientId && shouldIncludeFile(file, includeArchived),
  )

  return DRIVE_FILE_CATEGORIES.map((category) => ({
    ...category,
    fileCount: files.filter((file) => file.category === category.id).length,
  }))
}

function createBaseDiagnostics(
  clientFiles: DriveFileSummary[],
  includeArchived: boolean,
): DriveFileDiagnostic[] {
  const diagnostics: DriveFileDiagnostic[] = [
    {
      severity: 'info',
      code: 'mock_repository_used',
      message: 'Mock Drive repository returned sanitized local metadata only.',
    },
  ]

  if (clientFiles.length === 0) {
    diagnostics.push({
      severity: 'warning',
      code: 'client_not_found',
      message: 'No mock Drive files are configured for this client.',
    })
  }

  if (!includeArchived && clientFiles.some((file) => file.status === 'archived')) {
    diagnostics.push({
      severity: 'info',
      code: 'archived_file_excluded',
      message: 'Archived files are hidden from the default Drive file list.',
    })
  }

  if (clientFiles.some((file) => file.status === 'excluded')) {
    diagnostics.push({
      severity: 'info',
      code: 'excluded_file_blocked',
      message: 'Restricted do-not-index files are blocked from the file hub list.',
    })
  }

  return diagnostics
}

function shouldIncludeFile(file: DriveFileSummary, includeArchived: boolean): boolean {
  if (file.status === 'excluded') {
    return false
  }

  return includeArchived || file.status !== 'archived'
}

function getFolderName(category: DriveFileCategory): string {
  return DRIVE_FILE_CATEGORIES.find((item) => item.id === category)?.name ?? '01_Client_Operations'
}
