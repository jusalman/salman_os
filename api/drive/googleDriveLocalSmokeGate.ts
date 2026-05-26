import { DRIVE_SERVER_ADAPTER_MODE_KEY } from './driveServerAdapter.ts'
import {
  GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_ENV_KEY,
  GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
  GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY,
} from './googleDriveServerAdapter.ts'

export const GOOGLE_DRIVE_LOCAL_SMOKE_REQUIRED_ENV_NAMES = [
  DRIVE_SERVER_ADAPTER_MODE_KEY,
  GOOGLE_DRIVE_AUTH_MODE_ENV_KEY,
  GOOGLE_DRIVE_CREDENTIAL_PATH_ENV_KEY,
  GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID_ENV_KEY,
] as const

export const GOOGLE_DRIVE_LOCAL_SMOKE_EXPECTED_VALUES = {
  [DRIVE_SERVER_ADAPTER_MODE_KEY]: 'google_skeleton',
  [GOOGLE_DRIVE_AUTH_MODE_ENV_KEY]: GOOGLE_DRIVE_AUTH_MODE_SERVICE_ACCOUNT,
} as const

export type GoogleDriveLocalSmokeGateEnvLike = Readonly<Record<string, string | undefined>>

export type GoogleDriveLocalSmokeGateReport = Readonly<{
  ok: boolean
  requiredEnvNames: readonly string[]
  missingEnvNames: readonly string[]
  invalidEnvNames: readonly string[]
  forbiddenPublicEnvNames: readonly string[]
  message: string
}>

export function evaluateGoogleDriveLocalSmokeGate(
  envLike: GoogleDriveLocalSmokeGateEnvLike,
): GoogleDriveLocalSmokeGateReport {
  const missingEnvNames = GOOGLE_DRIVE_LOCAL_SMOKE_REQUIRED_ENV_NAMES.filter(
    (name) => !isPresent(envLike[name]),
  )
  const invalidEnvNames = Object.entries(GOOGLE_DRIVE_LOCAL_SMOKE_EXPECTED_VALUES)
    .filter(([name, expectedValue]) => isPresent(envLike[name]) && envLike[name] !== expectedValue)
    .map(([name]) => name)
  const forbiddenPublicEnvNames = Object.keys(envLike).filter((name) =>
    /^VITE_(GOOGLE|DRIVE)(_|$)/u.test(name),
  )
  const ok =
    missingEnvNames.length === 0 &&
    invalidEnvNames.length === 0 &&
    forbiddenPublicEnvNames.length === 0

  return {
    ok,
    requiredEnvNames: GOOGLE_DRIVE_LOCAL_SMOKE_REQUIRED_ENV_NAMES,
    missingEnvNames,
    invalidEnvNames,
    forbiddenPublicEnvNames,
    message: ok
      ? 'Drive local smoke prerequisites are present. Run the smoke only after explicit approval.'
      : 'Drive local smoke prerequisites are not ready. Only setting names are reported.',
  }
}

export function formatGoogleDriveLocalSmokeGateReport(
  report: GoogleDriveLocalSmokeGateReport,
): string[] {
  const lines = [
    report.message,
    `Required settings: ${report.requiredEnvNames.join(', ')}`,
  ]

  if (report.missingEnvNames.length > 0) {
    lines.push(`Missing settings: ${report.missingEnvNames.join(', ')}`)
  }

  if (report.invalidEnvNames.length > 0) {
    lines.push(`Invalid settings: ${report.invalidEnvNames.join(', ')}`)
  }

  if (report.forbiddenPublicEnvNames.length > 0) {
    lines.push(`Forbidden public settings: ${report.forbiddenPublicEnvNames.join(', ')}`)
  }

  return lines
}

function isPresent(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
