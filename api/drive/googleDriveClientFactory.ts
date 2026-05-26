import { google, type drive_v3 } from 'googleapis'

import type { DriveBackendDiagnostic } from '../../src/domain/driveBackendContract.ts'
import {
  validateGoogleDriveServerAdapterConfig,
  type GoogleDriveServerAdapterConfigLike,
} from './googleDriveServerAdapter.ts'

export const GOOGLE_DRIVE_READONLY_SCOPE = 'https://www.googleapis.com/auth/drive.readonly'

export type GoogleDriveServiceAccountAuthInput = Readonly<{
  credentialPath: string
  scopes: readonly string[]
}>

export type GoogleDriveClientFactoryDeps = Readonly<{
  createServiceAccountAuth(input: GoogleDriveServiceAccountAuthInput): unknown
  createDriveClient(input: { version: 'v3'; auth: unknown }): drive_v3.Drive
}>

export type GoogleDriveClientFactoryResult =
  | {
      ok: true
      client: drive_v3.Drive
      authMode: 'service_account'
      scopes: readonly string[]
    }
  | {
      ok: false
      diagnostic: DriveBackendDiagnostic
    }

export function createGoogleDriveClientFactory(
  configLike: GoogleDriveServerAdapterConfigLike,
  deps: GoogleDriveClientFactoryDeps = defaultGoogleDriveClientFactoryDeps,
): GoogleDriveClientFactoryResult {
  const validation = validateGoogleDriveServerAdapterConfig(configLike)

  if (!validation.ok) {
    return {
      ok: false,
      diagnostic: validation.diagnostic,
    }
  }

  const scopes = [GOOGLE_DRIVE_READONLY_SCOPE] as const
  const auth = deps.createServiceAccountAuth({
    credentialPath: validation.config.credentialPath,
    scopes,
  })
  const client = deps.createDriveClient({
    version: 'v3',
    auth,
  })

  return {
    ok: true,
    client,
    authMode: validation.config.authMode,
    scopes,
  }
}

const defaultGoogleDriveClientFactoryDeps: GoogleDriveClientFactoryDeps = {
  createServiceAccountAuth(input) {
    return new google.auth.GoogleAuth({
      keyFile: input.credentialPath,
      scopes: [...input.scopes],
    })
  },
  createDriveClient(input) {
    return google.drive({
      version: input.version,
      auth: input.auth as ConstructorParameters<typeof google.auth.GoogleAuth>[0],
    })
  },
}
