import type {
  AdsSheetsConnectorDiagnostic,
  AdsSheetsReader,
  AdsSheetsSanitizedClientReadResult,
} from './adsSheetsConnector.ts'
import {
  resolveAdsSheetsReaderMode,
  type AdsSheetsReaderActivationDiagnostic,
  type AdsSheetsReaderActivationEnv,
} from './adsSheetsReaderActivation.ts'
import type { AdsSheetsClientConfig } from './adsSheetsConfig.ts'

export type AdsSheetsReaderFactoryDeps = {
  mockReader: AdsSheetsReader
  localReaderCandidate: AdsSheetsReader
  repoRoot?: string
}

export function createAdsSheetsReaderFromEnv(
  envLike: AdsSheetsReaderActivationEnv,
  deps: AdsSheetsReaderFactoryDeps,
): AdsSheetsReader {
  const activation = resolveAdsSheetsReaderMode(envLike, { repoRoot: deps.repoRoot })

  if (activation.mode === 'mock') {
    return deps.mockReader
  }

  if (activation.mode === 'local_candidate') {
    return deps.localReaderCandidate
  }

  return createActivationErrorReader(activation.diagnostics)
}

function createActivationErrorReader(
  activationDiagnostics: readonly AdsSheetsReaderActivationDiagnostic[],
): AdsSheetsReader {
  return {
    readClientSheets(config: AdsSheetsClientConfig): AdsSheetsSanitizedClientReadResult {
      return {
        clientId: config.clientId,
        clientName: config.clientName,
        spreadsheetId: config.spreadsheetId,
        tabs: {},
        diagnostics: activationDiagnostics.map((diagnostic) => mapActivationDiagnostic(config, diagnostic)),
      }
    },
  }
}

function mapActivationDiagnostic(
  config: AdsSheetsClientConfig,
  diagnostic: AdsSheetsReaderActivationDiagnostic,
): AdsSheetsConnectorDiagnostic {
  const envSuffix = diagnostic.envName ? ` env=${diagnostic.envName}` : ''

  return {
    severity: diagnostic.level,
    code: 'permission_denied',
    clientId: config.clientId,
    clientName: config.clientName,
    tabKey: null,
    message: `Ads Sheets reader activation blocked: ${diagnostic.code}.${envSuffix}`,
  }
}
