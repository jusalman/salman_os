import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { GoogleDriveLocalSmokeGateEnvLike } from './googleDriveLocalSmokeGate.ts'

export const GOOGLE_DRIVE_LOCAL_SMOKE_ENV_FILE = '.env.drive.local'

type GoogleDriveLocalSmokeEnvLoaderOptions = Readonly<{
  cwd?: string
  fileName?: string
  fileExists?(path: string): boolean
  readFile?(path: string): string
}>

export type GoogleDriveLocalSmokeEnvLoadResult = Readonly<{
  ok: boolean
  env: GoogleDriveLocalSmokeGateEnvLike
  loaded: boolean
  sourceName: string
  invalidLineNumbers: readonly number[]
}>

export function loadGoogleDriveLocalSmokeEnv(
  baseEnv: GoogleDriveLocalSmokeGateEnvLike,
  options: GoogleDriveLocalSmokeEnvLoaderOptions = {},
): GoogleDriveLocalSmokeEnvLoadResult {
  const sourceName = options.fileName ?? GOOGLE_DRIVE_LOCAL_SMOKE_ENV_FILE
  const sourcePath = resolve(options.cwd ?? process.cwd(), sourceName)
  const fileExists = options.fileExists ?? existsSync

  if (!fileExists(sourcePath)) {
    return {
      ok: true,
      env: { ...baseEnv },
      loaded: false,
      sourceName,
      invalidLineNumbers: [],
    }
  }

  const readFile = options.readFile ?? ((path: string) => readFileSync(path, 'utf8'))
  const parsed = parseGoogleDriveLocalSmokeEnv(readFile(sourcePath))

  return {
    ok: parsed.invalidLineNumbers.length === 0,
    env: {
      ...parsed.values,
      ...baseEnv,
    },
    loaded: true,
    sourceName,
    invalidLineNumbers: parsed.invalidLineNumbers,
  }
}

export function formatGoogleDriveLocalSmokeEnvLoadReport(
  result: GoogleDriveLocalSmokeEnvLoadResult,
): string[] {
  if (result.ok) {
    return []
  }

  return [
    `${result.sourceName} has invalid lines. Only line numbers are reported.`,
    `Invalid lines: ${result.invalidLineNumbers.join(', ')}`,
  ]
}

function parseGoogleDriveLocalSmokeEnv(source: string): {
  values: Record<string, string>
  invalidLineNumbers: number[]
} {
  const values: Record<string, string> = {}
  const invalidLineNumbers: number[] = []
  const lines = source.split(/\r?\n/u)

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()

    if (line.length === 0 || line.startsWith('#')) {
      return
    }

    const assignment = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/u.exec(line)

    if (assignment === null) {
      invalidLineNumbers.push(index + 1)
      return
    }

    const [, key, rawValue] = assignment

    values[key] = parseEnvValue(rawValue)
  })

  return {
    values,
    invalidLineNumbers,
  }
}

function parseEnvValue(rawValue: string): string {
  const trimmedValue = rawValue.trim()
  const quote = trimmedValue[0]

  if (
    (quote === '"' || quote === "'") &&
    trimmedValue.length >= 2 &&
    trimmedValue[trimmedValue.length - 1] === quote
  ) {
    return trimmedValue.slice(1, -1)
  }

  return trimmedValue.replace(/\s+#.*$/u, '').trim()
}
