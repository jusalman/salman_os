import type {
  DriveFileCategory,
  DriveFileCategorySummary,
  DriveFileRepositoryResult,
  DriveFileSensitivity,
  DriveFileStatus,
  DriveFileSummary,
} from '../../domain/driveFiles'

export type ListDriveFilesInput = {
  clientId: string
  category?: DriveFileCategory
  status?: DriveFileStatus
  sensitivity?: DriveFileSensitivity
  includeArchived?: boolean
}

export type GetDriveFileByIdInput = {
  clientId: string
  fileId: string
  includeArchived?: boolean
}

export type ListDriveFileCategoriesInput = {
  clientId: string
  includeArchived?: boolean
}

export type DriveFileRepository = {
  listDriveFiles(input: ListDriveFilesInput): Promise<DriveFileRepositoryResult>
  getDriveFileById(input: GetDriveFileByIdInput): Promise<DriveFileSummary | undefined>
  listDriveFileCategories(
    input: ListDriveFileCategoriesInput,
  ): Promise<DriveFileCategorySummary[]>
}
