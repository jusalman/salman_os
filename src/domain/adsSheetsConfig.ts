export type AdsSheetsRawTabKey = 'dailySa' | 'dailyConversionSa' | 'weeklyKeywordSa'

export type AdsSheetsRawTabs = Record<AdsSheetsRawTabKey, string>

export type AdsSheetsClientConfig = {
  clientId: string
  clientName: string
  spreadsheetId: string
  rawTabs: AdsSheetsRawTabs
  enabled: boolean
  lastConfiguredAt: string
}

export type AdsSheetsClientConfigInput = Omit<AdsSheetsClientConfig, 'rawTabs' | 'spreadsheetId'> & {
  spreadsheetId?: string | null
  rawTabs?: Partial<Record<AdsSheetsRawTabKey, string | null | undefined>>
}

export type AdsSheetsConfigDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: 'disabled_client' | 'missing_spreadsheet_id' | 'missing_raw_tab_name'
  clientId: string
  clientName: string
  field: string
  message: string
}

export type AdsSheetsConfigReadResult = {
  configs: AdsSheetsClientConfig[]
  diagnostics: AdsSheetsConfigDiagnostic[]
}

export const ADS_SHEETS_REQUIRED_RAW_TABS: AdsSheetsRawTabs = {
  dailySa: '데일리SA_RAW',
  dailyConversionSa: '데일리전환SA_RAW',
  weeklyKeywordSa: '위클리키워드SA_RAW',
}

const REQUIRED_RAW_TAB_KEYS: AdsSheetsRawTabKey[] = [
  'dailySa',
  'dailyConversionSa',
  'weeklyKeywordSa',
]

export const MOCK_ADS_SHEETS_CLIENT_CONFIGS: AdsSheetsClientConfigInput[] = [
  {
    clientId: 'mock-client-ads-001',
    clientName: '더하임치과',
    spreadsheetId: 'mock-spreadsheet-id-001',
    rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
    enabled: true,
    lastConfiguredAt: '2026-05-18T00:00:00.000Z',
  },
  {
    clientId: 'mock-client-ads-002',
    clientName: '바른약속의원',
    spreadsheetId: 'mock-spreadsheet-id-002',
    rawTabs: ADS_SHEETS_REQUIRED_RAW_TABS,
    enabled: false,
    lastConfiguredAt: '2026-05-18T00:00:00.000Z',
  },
]

export function readMockAdsSheetsClientConfigs(
  sourceConfigs: readonly AdsSheetsClientConfigInput[] = MOCK_ADS_SHEETS_CLIENT_CONFIGS,
): AdsSheetsConfigReadResult {
  const diagnostics: AdsSheetsConfigDiagnostic[] = []
  const configs: AdsSheetsClientConfig[] = []

  for (const sourceConfig of sourceConfigs) {
    if (!sourceConfig.enabled) {
      diagnostics.push({
        severity: 'info',
        code: 'disabled_client',
        clientId: sourceConfig.clientId,
        clientName: sourceConfig.clientName,
        field: 'enabled',
        message: '광고 운영 Sheets 설정이 비활성화되어 읽기 대상에서 제외되었습니다.',
      })
      continue
    }

    const spreadsheetId = normalizeText(sourceConfig.spreadsheetId)

    if (spreadsheetId === null) {
      diagnostics.push({
        severity: 'error',
        code: 'missing_spreadsheet_id',
        clientId: sourceConfig.clientId,
        clientName: sourceConfig.clientName,
        field: 'spreadsheetId',
        message: '광고 운영 Sheets spreadsheetId가 없어 읽기 대상에서 제외되었습니다.',
      })
      continue
    }

    const rawTabs = buildRawTabs(sourceConfig)

    for (const tabKey of REQUIRED_RAW_TAB_KEYS) {
      if (rawTabs[tabKey] === null) {
        diagnostics.push({
          severity: 'error',
          code: 'missing_raw_tab_name',
          clientId: sourceConfig.clientId,
          clientName: sourceConfig.clientName,
          field: `rawTabs.${tabKey}`,
          message: '광고 운영 Sheets 필수 raw tab 이름이 없어 읽기 대상에서 제외되었습니다.',
        })
      }
    }

    if (Object.values(rawTabs).some((tabName) => tabName === null)) {
      continue
    }

    configs.push({
      clientId: sourceConfig.clientId,
      clientName: sourceConfig.clientName,
      spreadsheetId,
      rawTabs: rawTabs as AdsSheetsRawTabs,
      enabled: true,
      lastConfiguredAt: sourceConfig.lastConfiguredAt,
    })
  }

  return { configs, diagnostics }
}

function buildRawTabs(
  sourceConfig: AdsSheetsClientConfigInput,
): Record<AdsSheetsRawTabKey, string | null> {
  return {
    dailySa: normalizeText(sourceConfig.rawTabs?.dailySa),
    dailyConversionSa: normalizeText(sourceConfig.rawTabs?.dailyConversionSa),
    weeklyKeywordSa: normalizeText(sourceConfig.rawTabs?.weeklyKeywordSa),
  }
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized ? normalized : null
}
