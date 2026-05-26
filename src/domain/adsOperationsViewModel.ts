import {
  type AdsMetricDiagnostic,
  type AdsMetricStatus,
  calculateAdsMetrics,
} from './adsMetrics.ts'
import {
  ADS_SHEETS_REQUIRED_RAW_TABS,
  type AdsSheetsClientConfigInput,
  type AdsSheetsConfigDiagnostic,
  type AdsSheetsRawTabKey,
  readMockAdsSheetsClientConfigs,
} from './adsSheetsConfig.ts'
import {
  type AdsRawTable,
  type AdsSheetsReportType,
  type AdsSheetsNormalizerDiagnostic,
  type RawAdsSheetRow,
  normalizeAdsSheetRows,
} from './adsSheetsNormalizer.ts'

export type AdsViewDiagnosticCode =
  | 'missing_config'
  | 'missing_sheet_id'
  | 'missing_tab'
  | 'empty_data'
  | 'invalid_number'
  | 'column_mismatch'
  | 'disabled_client'
  | 'unsupported_report_type'

export type AdsViewDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: AdsViewDiagnosticCode
  clientId: string
  clientName: string
  source: string
  message: string
}

export type AdsDashboardSummary = {
  totalClients: number
  normalCount: number
  warningCount: number
  riskCount: number
  missingDataCount: number
}

export type AdsClientSummary = {
  clientId: string
  clientName: string
  healthScore: number | null
  status: AdsMetricStatus
  spend: number | null
  clicks: number | null
  conversions: number | null
  cpc: number | null
  cpa: number | null
  roas: number | null
  lastUpdatedAt: string | null
  diagnostics: AdsViewDiagnostic[]
}

export type AdsOperationsMockConnectorViewModel = {
  summary: AdsDashboardSummary
  clients: AdsClientSummary[]
  auditFindings: []
  actionItems: []
  reportDrafts: []
  state: { type: 'ready' } | { type: 'empty'; message: string }
  diagnostics: AdsViewDiagnostic[]
  tablesByClientId: Record<string, Partial<Record<AdsSheetsRawTabKey, AdsRawTable>>>
}

export type MockAdsSheetsRawTablesByClient = Record<
  string,
  Partial<Record<AdsSheetsRawTabKey, RawAdsSheetRow[]>>
>

export type BuildMockAdsOperationsViewModelInput = {
  configs?: readonly AdsSheetsClientConfigInput[]
  rawSheetsByClientId?: MockAdsSheetsRawTablesByClient
}

const TAB_REPORT_TYPES: Record<AdsSheetsRawTabKey, AdsSheetsReportType> = {
  dailySa: 'daily_sa',
  dailyConversionSa: 'daily_conversion_sa',
  weeklyKeywordSa: 'weekly_keyword_sa',
}

export const MOCK_ADS_RAW_SHEETS_BY_CLIENT_ID: MockAdsSheetsRawTablesByClient = {
  'mock-client-ads-001': {
    dailySa: [
      {
        date: '2026-05-18',
        campaignName: '치과 임플란트 검색 캠페인',
        adGroupName: '핵심 진료 키워드 그룹',
        keyword: '강남 임플란트 치과',
        spend: '100,000',
        impressions: '10,000',
        clicks: '500',
        conversions: '25',
        revenue: '400,000',
      },
    ],
    dailyConversionSa: [
      {
        date: '2026-05-18',
        campaignName: '상담 전환 집중 캠페인',
        adGroupName: '예약 전환 그룹',
        keyword: '임플란트 상담 예약',
        spend: '0',
        impressions: '1,000',
        clicks: '50',
        conversions: '5',
        revenue: '80,000',
      },
    ],
    weeklyKeywordSa: [
      {
        date: '2026-05-18',
        campaignName: '주간 키워드 확장 캠페인',
        adGroupName: '지역 확장 그룹',
        keyword: '논현동 치과 추천',
        spend: '20,000',
        impressions: '2,000',
        clicks: '100',
        conversions: '5',
        revenue: '120,000',
      },
    ],
  },
}

export function buildMockAdsOperationsViewModel(
  input: BuildMockAdsOperationsViewModelInput = {},
): AdsOperationsMockConnectorViewModel {
  const configResult = readMockAdsSheetsClientConfigs(input.configs)
  const rawSheetsByClientId = input.rawSheetsByClientId ?? MOCK_ADS_RAW_SHEETS_BY_CLIENT_ID
  const diagnostics = configResult.diagnostics.map(mapConfigDiagnostic)
  const clients: AdsClientSummary[] = []
  const tablesByClientId: Record<string, Partial<Record<AdsSheetsRawTabKey, AdsRawTable>>> = {}

  for (const config of configResult.configs) {
    const clientDiagnostics: AdsViewDiagnostic[] = []
    const metricDiagnostics: AdsMetricDiagnostic[] = []
    const normalizedRows = []
    const tables: Partial<Record<AdsSheetsRawTabKey, AdsRawTable>> = {}
    const rawSheets = rawSheetsByClientId[config.clientId]

    if (!rawSheets) {
      clientDiagnostics.push({
        severity: 'error',
        code: 'missing_config',
        clientId: config.clientId,
        clientName: config.clientName,
        source: 'rawSheetsByClientId',
        message: '광고 원본 시트 샘플이 없어 운영 데이터를 만들 수 없습니다.',
      })
      metricDiagnostics.push({
        severity: 'error',
        code: 'missing_sheet_id',
        message: '광고 원본 시트 샘플이 없습니다.',
      })
    }

    for (const tabKey of Object.keys(ADS_SHEETS_REQUIRED_RAW_TABS) as AdsSheetsRawTabKey[]) {
      const rawRows = rawSheets?.[tabKey]

      if (!rawRows) {
        clientDiagnostics.push({
          severity: 'error',
          code: 'missing_tab',
          clientId: config.clientId,
          clientName: config.clientName,
          source: tabKey,
          message: '필수 광고 원본 탭 샘플이 없습니다.',
        })
        metricDiagnostics.push({
          severity: 'warning',
          code: 'missing_tab',
          message: '필수 광고 원본 탭 샘플이 없습니다.',
        })
        continue
      }

      const normalized = normalizeAdsSheetRows({
        reportType: TAB_REPORT_TYPES[tabKey],
        tabName: config.rawTabs[tabKey],
        rows: rawRows,
      })

      for (const diagnostic of normalized.diagnostics) {
        clientDiagnostics.push(mapNormalizerDiagnostic(config, tabKey, diagnostic))
      }

      metricDiagnostics.push(...mapNormalizerDiagnosticsToMetricDiagnostics(normalized.diagnostics))

      if (normalized.table) {
        tables[tabKey] = normalized.table
        normalizedRows.push(...normalized.table.rows)
      }
    }

    const metrics = calculateAdsMetrics(normalizedRows, { diagnostics: metricDiagnostics })
    const allClientDiagnostics = [...clientDiagnostics, ...metrics.diagnostics.map((item) => ({
      severity: item.severity,
      code: item.code as AdsViewDiagnosticCode,
      clientId: config.clientId,
      clientName: config.clientName,
      source: 'adsMetrics',
      message: item.message,
    } satisfies AdsViewDiagnostic))]

    clients.push({
      clientId: config.clientId,
      clientName: config.clientName,
      healthScore: metrics.healthScore,
      status: metrics.status,
      spend: metrics.spend,
      clicks: metrics.clicks,
      conversions: metrics.conversions,
      cpc: metrics.cpc,
      cpa: metrics.cpa,
      roas: metrics.roas,
      lastUpdatedAt: config.lastConfiguredAt,
      diagnostics: allClientDiagnostics,
    })
    diagnostics.push(...allClientDiagnostics)
    tablesByClientId[config.clientId] = tables
  }

  return {
    summary: summarizeClients(clients),
    clients,
    auditFindings: [],
    actionItems: [],
    reportDrafts: [],
    state: clients.length > 0 ? { type: 'ready' } : { type: 'empty', message: '표시할 광고 운영 샘플 데이터가 없습니다.' },
    diagnostics,
    tablesByClientId,
  }
}

function summarizeClients(clients: AdsClientSummary[]): AdsDashboardSummary {
  return {
    totalClients: clients.length,
    normalCount: clients.filter((client) => client.status === 'normal').length,
    warningCount: clients.filter((client) => client.status === 'warning').length,
    riskCount: clients.filter((client) => client.status === 'risk').length,
    missingDataCount: clients.filter((client) => client.status === 'missing_data').length,
  }
}

function mapConfigDiagnostic(diagnostic: AdsSheetsConfigDiagnostic): AdsViewDiagnostic {
  return {
    severity: diagnostic.severity,
    code: mapConfigDiagnosticCode(diagnostic.code),
    clientId: diagnostic.clientId,
    clientName: diagnostic.clientName,
    source: diagnostic.field,
    message: diagnostic.message,
  }
}

function mapConfigDiagnosticCode(
  code: AdsSheetsConfigDiagnostic['code'],
): AdsViewDiagnosticCode {
  if (code === 'missing_raw_tab_name') {
    return 'missing_tab'
  }

  if (code === 'missing_spreadsheet_id') {
    return 'missing_sheet_id'
  }

  return code
}

function mapNormalizerDiagnostic(
  config: { clientId: string; clientName: string },
  tabKey: AdsSheetsRawTabKey,
  diagnostic: AdsSheetsNormalizerDiagnostic,
): AdsViewDiagnostic {
  return {
    severity: diagnostic.severity,
    code: mapNormalizerDiagnosticCode(diagnostic.code),
    clientId: config.clientId,
    clientName: config.clientName,
    source: `${tabKey}.${diagnostic.field}`,
    message: diagnostic.message,
  }
}

function mapNormalizerDiagnosticsToMetricDiagnostics(
  diagnostics: AdsSheetsNormalizerDiagnostic[],
): AdsMetricDiagnostic[] {
  const metricDiagnostics: AdsMetricDiagnostic[] = []

  for (const diagnostic of diagnostics) {
    if (diagnostic.code === 'empty_table') {
      metricDiagnostics.push({
        severity: diagnostic.severity,
        code: 'empty_data',
        message: diagnostic.message,
      })
    }

    if (diagnostic.code === 'missing_required_column') {
      metricDiagnostics.push({
        severity: diagnostic.severity,
        code: 'column_mismatch',
        message: diagnostic.message,
      })
    }
  }

  return metricDiagnostics
}

function mapNormalizerDiagnosticCode(
  code: AdsSheetsNormalizerDiagnostic['code'],
): AdsViewDiagnosticCode {
  if (code === 'empty_table') {
    return 'empty_data'
  }

  if (code === 'missing_required_column') {
    return 'column_mismatch'
  }

  return code
}
