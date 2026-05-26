import type {
  DriveBackendClient,
  DriveBackendDiagnostic,
  DriveBackendDiagnosticCode,
  DriveBackendFileSummary,
  DriveBackendListCategoriesResponse,
  DriveBackendListFilesResponse,
} from '../../../domain/driveBackendContract'
import type {
  DriveFileDiagnostic,
  DriveFileDiagnosticCode,
  DriveFileSummary,
} from '../../../domain/driveFiles'
import type { DriveFileRepository } from '../../repositories/driveFileRepository'
import { driveFileMockRepository } from './driveFileMockRepository.ts'

export function createDriveBackendFakeClient(
  repository: DriveFileRepository = driveFileMockRepository,
): DriveBackendClient {
  return {
    async listFiles(input) {
      const result = await repository.listDriveFiles(input)

      return {
        ok: true,
        clientId: result.clientId,
        categories: result.categories,
        files: result.files.map(mapDriveFileSummary),
        diagnostics: mapDiagnostics(result.diagnostics),
      } satisfies DriveBackendListFilesResponse
    },

    async getFile(input) {
      const file = await repository.getDriveFileById(input)

      if (!file) {
        const error = createSafeDiagnostic(
          'warning',
          'file_not_found',
          'Drive file was not found in fake backend metadata.',
        )

        return {
          ok: false,
          clientId: input.clientId,
          error,
          diagnostics: [
            createSafeDiagnostic(
              'info',
              'mock_backend_client_used',
              'Fake Drive backend client returned sanitized local metadata only.',
            ),
            error,
          ],
        }
      }

      return {
        ok: true,
        clientId: input.clientId,
        file: mapDriveFileSummary(file),
        diagnostics: [
          createSafeDiagnostic(
            'info',
            'mock_backend_client_used',
            'Fake Drive backend client returned sanitized local metadata only.',
          ),
        ],
      }
    },

    async listCategories(input) {
      const categories = await repository.listDriveFileCategories(input)

      return {
        ok: true,
        clientId: input.clientId,
        categories,
        diagnostics: [
          createSafeDiagnostic(
            'info',
            'mock_backend_client_used',
            'Fake Drive backend client returned sanitized local metadata only.',
          ),
        ],
      } satisfies DriveBackendListCategoriesResponse
    },
  }
}

export const driveBackendFakeClient = createDriveBackendFakeClient()

function mapDriveFileSummary(file: DriveFileSummary): DriveBackendFileSummary {
  return {
    fileId: file.id,
    clientId: file.clientId,
    displayName: file.name,
    category: file.category,
    section: file.category,
    folderName: file.folderName,
    folderPath: file.folderPath,
    fileType: file.fileType,
    status: file.status,
    sensitivity: file.sensitivity,
    owner: file.uploadedBy,
    updatedAt: file.uploadedAt,
    source: 'fake_backend_client',
    sourceUrl: file.sourceUrl || undefined,
    openUrl: file.sourceUrl || undefined,
  }
}

function mapDiagnostics(diagnostics: DriveFileDiagnostic[]): DriveBackendDiagnostic[] {
  return diagnostics.map((diagnostic) =>
    createSafeDiagnostic(
      diagnostic.severity,
      mapDiagnosticCode(diagnostic.code),
      diagnostic.code === 'mock_repository_used'
        ? 'Fake Drive backend client returned sanitized local metadata only.'
        : diagnostic.message,
    ),
  )
}

function mapDiagnosticCode(code: DriveFileDiagnosticCode): DriveBackendDiagnosticCode {
  if (code === 'mock_repository_used') {
    return 'mock_backend_client_used'
  }

  return code
}

function createSafeDiagnostic(
  severity: DriveBackendDiagnostic['severity'],
  code: DriveBackendDiagnosticCode,
  message: string,
): DriveBackendDiagnostic {
  return {
    severity,
    code,
    message,
  }
}
