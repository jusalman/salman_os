import {
  createGoogleDriveClientFactory,
  type GoogleDriveClientFactoryDeps,
} from './googleDriveClientFactory.ts'
import {
  evaluateGoogleDriveLocalSmokeGate,
  formatGoogleDriveLocalSmokeGateReport,
  type GoogleDriveLocalSmokeGateEnvLike,
} from './googleDriveLocalSmokeGate.ts'
import {
  readGoogleDriveServerAdapterConfigFromEnvLike,
  validateGoogleDriveServerAdapterConfig,
} from './googleDriveServerAdapter.ts'

export type GoogleDriveListSmokeResult = Readonly<{
  ok: boolean
  reason: 'gate_not_ready' | 'config_not_ready' | 'api_failed' | 'ok'
  lines: readonly string[]
}>

type GoogleDriveListSmokeFileList = Readonly<{
  files?: readonly unknown[]
  nextPageToken?: string | null
}>

export async function runGoogleDriveListSmoke(
  envLike: GoogleDriveLocalSmokeGateEnvLike,
  deps?: GoogleDriveClientFactoryDeps,
): Promise<GoogleDriveListSmokeResult> {
  const gateReport = evaluateGoogleDriveLocalSmokeGate(envLike)

  if (!gateReport.ok) {
    return {
      ok: false,
      reason: 'gate_not_ready',
      lines: formatGoogleDriveLocalSmokeGateReport(gateReport),
    }
  }

  const configLike = readGoogleDriveServerAdapterConfigFromEnvLike(envLike)
  const validation = validateGoogleDriveServerAdapterConfig(configLike)

  if (!validation.ok) {
    return {
      ok: false,
      reason: 'config_not_ready',
      lines: ['Drive list smoke config is not ready. Only setting names are reported.'],
    }
  }

  const factoryResult =
    deps === undefined
      ? createGoogleDriveClientFactory(configLike)
      : createGoogleDriveClientFactory(configLike, deps)

  if (!factoryResult.ok) {
    return {
      ok: false,
      reason: 'config_not_ready',
      lines: ['Drive list smoke client factory is not ready. Only setting names are reported.'],
    }
  }

  try {
    const response = await factoryResult.client.files.list({
      q: `'${validation.config.allowedRootFolderId}' in parents and trashed = false`,
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })

    return {
      ok: true,
      reason: 'ok',
      lines: createSafeSmokeSuccessLines(response.data),
    }
  } catch {
    return {
      ok: false,
      reason: 'api_failed',
      lines: ['Drive list smoke failed. Check folder sharing and server-only settings.'],
    }
  }
}

function createSafeSmokeSuccessLines(fileList: GoogleDriveListSmokeFileList): string[] {
  const fileCount = fileList.files?.length ?? 0
  const hasMore = fileList.nextPageToken !== undefined && fileList.nextPageToken.length > 0

  return [
    'Drive list smoke succeeded. Sanitized summary only.',
    'Drive API reached: yes',
    `Returned file count: ${fileCount}`,
    `Additional pages present: ${hasMore ? 'yes' : 'no'}`,
  ]
}
