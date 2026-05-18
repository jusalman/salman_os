export type AdsLocalCredentialDiagnosticLevel = 'error' | 'warning'

export type AdsLocalCredentialDiagnosticCode =
  | 'missing_credential_path'
  | 'relative_credential_path'
  | 'example_credential_path'
  | 'repo_internal_credential_path'

export type AdsLocalCredentialDiagnostic = {
  level: AdsLocalCredentialDiagnosticLevel
  code: AdsLocalCredentialDiagnosticCode
  message: string
}

export type AdsLocalCredentialPathValidationResult = {
  ok: boolean
  normalizedPath?: string
  diagnostics: AdsLocalCredentialDiagnostic[]
}

export type AdsLocalCredentialPathValidationOptions = {
  repoRoot?: string
}

export function validateLocalCredentialPath(
  input: string | null | undefined,
  options: AdsLocalCredentialPathValidationOptions = {},
): AdsLocalCredentialPathValidationResult {
  const diagnostics: AdsLocalCredentialDiagnostic[] = []
  const trimmedInput = input?.trim()

  if (!trimmedInput) {
    diagnostics.push({
      level: 'error',
      code: 'missing_credential_path',
      message: 'Google Sheets credential path가 비어 있습니다.',
    })

    return { ok: false, diagnostics }
  }

  const normalizedPath = normalizeCredentialPath(trimmedInput)

  if (!isAbsoluteCredentialPath(normalizedPath)) {
    diagnostics.push({
      level: 'error',
      code: 'relative_credential_path',
      message: 'Google Sheets credential path는 local/server 전용 절대 경로여야 합니다.',
    })
  }

  if (isExampleCredentialPath(normalizedPath)) {
    diagnostics.push({
      level: 'error',
      code: 'example_credential_path',
      message: 'example 파일은 실제 Google Sheets credential path로 사용할 수 없습니다.',
    })
  }

  const repoRoot = options.repoRoot?.trim()

  if (repoRoot && isPathInsideRepo(normalizedPath, repoRoot)) {
    diagnostics.push({
      level: 'error',
      code: 'repo_internal_credential_path',
      message: 'credential path가 repository 내부를 가리킵니다. 커밋 위험이 없는 외부 local/server 경로를 사용해야 합니다.',
    })
  }

  return {
    ok: diagnostics.every((diagnostic) => diagnostic.level !== 'error'),
    normalizedPath,
    diagnostics,
  }
}

function normalizeCredentialPath(input: string): string {
  const slashNormalized = input.replaceAll('\\', '/').replaceAll(/\/+/g, '/')

  if (isWindowsDrivePath(slashNormalized)) {
    const drive = slashNormalized.slice(0, 2)
    const rest = slashNormalized.slice(2).replace(/\/+$/u, '')

    return `${drive}${rest || '/'}`
  }

  if (slashNormalized.startsWith('//')) {
    return slashNormalized.replace(/\/+$/u, '')
  }

  if (slashNormalized.startsWith('/')) {
    return slashNormalized.replace(/\/+$/u, '') || '/'
  }

  return slashNormalized.replace(/\/+$/u, '')
}

function isAbsoluteCredentialPath(input: string): boolean {
  return isWindowsDrivePath(input) || input.startsWith('/') || input.startsWith('//')
}

function isWindowsDrivePath(input: string): boolean {
  return /^[a-zA-Z]:\//u.test(input)
}

function isExampleCredentialPath(input: string): boolean {
  const fileName = getBaseName(input).toLowerCase()

  return (
    fileName === '.env.example' ||
    fileName.endsWith('.example') ||
    fileName.includes('.example.') ||
    fileName.endsWith('-example.json') ||
    fileName.endsWith('_example.json')
  )
}

function isPathInsideRepo(candidatePath: string, repoRoot: string): boolean {
  if (!isAbsoluteCredentialPath(candidatePath)) {
    return false
  }

  const normalizedCandidate = normalizeForComparison(candidatePath)
  const normalizedRepoRoot = normalizeForComparison(normalizeCredentialPath(repoRoot))

  return (
    normalizedCandidate === normalizedRepoRoot ||
    normalizedCandidate.startsWith(`${normalizedRepoRoot}/`)
  )
}

function normalizeForComparison(input: string): string {
  const normalized = normalizeCredentialPath(input).replace(/\/+$/u, '')

  return isWindowsDrivePath(normalized) ? normalized.toLowerCase() : normalized
}

function getBaseName(input: string): string {
  const segments = input.split('/')

  return segments.at(-1) ?? input
}
