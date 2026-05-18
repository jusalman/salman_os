import type {
  AdsSheetsClientConfig,
  AdsSheetsRawTabKey,
} from './adsSheetsConfig.ts'
import type { RawAdsSheetRow } from './adsSheetsNormalizer.ts'

export type AdsSheetsConnectorDiagnosticCode =
  | 'missing_tab'
  | 'empty_data'
  | 'permission_denied'
  | 'column_mismatch'

export type AdsSheetsConnectorDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: AdsSheetsConnectorDiagnosticCode
  clientId: string
  clientName: string
  tabKey: AdsSheetsRawTabKey | null
  message: string
}

export type AdsSheetsSanitizedClientReadResult = {
  clientId: string
  clientName: string
  spreadsheetId: string
  tabs: Partial<Record<AdsSheetsRawTabKey, RawAdsSheetRow[]>>
  diagnostics: AdsSheetsConnectorDiagnostic[]
}

export type AdsSheetsSanitizedReadResult = {
  rawSheetsByClientId: Record<string, Partial<Record<AdsSheetsRawTabKey, RawAdsSheetRow[]>>>
  diagnostics: AdsSheetsConnectorDiagnostic[]
}

export type AdsSheetsReader = {
  readClientSheets(
    config: AdsSheetsClientConfig,
  ): AdsSheetsSanitizedClientReadResult | Promise<AdsSheetsSanitizedClientReadResult>
}

export async function readAdsSheetsWithReader(
  configs: readonly AdsSheetsClientConfig[],
  reader: AdsSheetsReader,
): Promise<AdsSheetsSanitizedReadResult> {
  const rawSheetsByClientId: AdsSheetsSanitizedReadResult['rawSheetsByClientId'] = {}
  const diagnostics: AdsSheetsConnectorDiagnostic[] = []

  for (const config of configs) {
    const result = await reader.readClientSheets(config)

    rawSheetsByClientId[result.clientId] = result.tabs
    diagnostics.push(...result.diagnostics)
  }

  return {
    rawSheetsByClientId,
    diagnostics,
  }
}
