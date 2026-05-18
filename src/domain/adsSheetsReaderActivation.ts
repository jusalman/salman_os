import {
  validateLocalCredentialPath,
  type AdsLocalCredentialDiagnostic,
} from './adsLocalCredentialValidation.ts'

export type AdsSheetsReaderActivationMode = 'mock' | 'local_candidate' | 'error'

export type AdsSheetsReaderActivationDiagnosticCode =
  | 'invalid_reader_mode'
  | 'vite_credential_env_exposed'
  | 'missing_local_credential_path'
  | AdsLocalCredentialDiagnostic['code']

export type AdsSheetsReaderActivationDiagnostic = {
  level: 'error' | 'warning'
  code: AdsSheetsReaderActivationDiagnosticCode
  envName?: string
  message: string
}

export type AdsSheetsReaderActivationEnv = Record<string, string | null | undefined>

export type AdsSheetsReaderActivationOptions = {
  repoRoot?: string
}

export type AdsSheetsReaderActivationResult = {
  mode: AdsSheetsReaderActivationMode
  normalizedCredentialPath?: string
  credentialEnvName?: string
  diagnostics: AdsSheetsReaderActivationDiagnostic[]
}

const READER_MODE_ENV = 'ADS_SHEETS_READER_MODE'

const LOCAL_CREDENTIAL_PATH_ENVS = [
  'ADS_GOOGLE_CREDENTIAL_PATH',
  'ADS_GOOGLE_SERVICE_ACCOUNT_PATH',
  'ADS_GOOGLE_TOKEN_PATH',
] as const

const VITE_CREDENTIAL_ENV_PATTERN =
  /^VITE_.*(GOOGLE|SHEETS|ADS).*?(CREDENTIAL|TOKEN|SERVICE_ACCOUNT|SERVICEACCOUNT|SECRET|PRIVATE_KEY|KEY|JSON|PATH)/iu

export function resolveAdsSheetsReaderMode(
  envLike: AdsSheetsReaderActivationEnv = {},
  options: AdsSheetsReaderActivationOptions = {},
): AdsSheetsReaderActivationResult {
  const diagnostics: AdsSheetsReaderActivationDiagnostic[] = [
    ...findViteCredentialEnvDiagnostics(envLike),
  ]
  const rawMode = normalizeReaderMode(envLike[READER_MODE_ENV])

  if (rawMode === null || rawMode === 'mock') {
    return buildResult('mock', diagnostics)
  }

  if (rawMode !== 'local') {
    diagnostics.push({
      level: 'error',
      code: 'invalid_reader_mode',
      envName: READER_MODE_ENV,
      message: 'ADS_SHEETS_READER_MODE must be either mock or local.',
    })

    return buildResult('error', diagnostics)
  }

  const credentialPath = resolveCredentialPathEnv(envLike)

  if (credentialPath === null) {
    diagnostics.push({
      level: 'error',
      code: 'missing_local_credential_path',
      message: 'Local Ads Sheets reader mode requires a server/local-only credential path env.',
    })

    return buildResult('error', diagnostics)
  }

  const validation = validateLocalCredentialPath(credentialPath.value, {
    repoRoot: options.repoRoot,
  })

  diagnostics.push(
    ...validation.diagnostics.map((diagnostic) => ({
      level: diagnostic.level,
      code: diagnostic.code,
      envName: credentialPath.envName,
      message: diagnostic.message,
    })),
  )

  return {
    mode: hasError(diagnostics) ? 'error' : 'local_candidate',
    normalizedCredentialPath: validation.normalizedPath,
    credentialEnvName: credentialPath.envName,
    diagnostics,
  }
}

function buildResult(
  requestedMode: Exclude<AdsSheetsReaderActivationMode, 'local_candidate'>,
  diagnostics: AdsSheetsReaderActivationDiagnostic[],
): AdsSheetsReaderActivationResult {
  return {
    mode: hasError(diagnostics) ? 'error' : requestedMode,
    diagnostics,
  }
}

function findViteCredentialEnvDiagnostics(
  envLike: AdsSheetsReaderActivationEnv,
): AdsSheetsReaderActivationDiagnostic[] {
  return Object.keys(envLike)
    .filter((envName) => VITE_CREDENTIAL_ENV_PATTERN.test(envName))
    .map((envName) => ({
      level: 'error' as const,
      code: 'vite_credential_env_exposed' as const,
      envName,
      message: 'Credential, token, service account, key, or secret env must not use the VITE_ prefix.',
    }))
}

function resolveCredentialPathEnv(
  envLike: AdsSheetsReaderActivationEnv,
): { envName: string; value: string } | null {
  for (const envName of LOCAL_CREDENTIAL_PATH_ENVS) {
    const value = normalizeCredentialEnvValue(envLike[envName])

    if (value !== null) {
      return { envName, value }
    }
  }

  return null
}

function normalizeReaderMode(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase()

  return normalized ? normalized : null
}

function normalizeCredentialEnvValue(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function hasError(diagnostics: AdsSheetsReaderActivationDiagnostic[]): boolean {
  return diagnostics.some((diagnostic) => diagnostic.level === 'error')
}
