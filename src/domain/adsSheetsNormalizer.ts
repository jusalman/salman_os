import type { RawAdsMetricRow } from './adsMetrics.ts'

export type AdsSheetsReportType = 'daily_sa' | 'daily_conversion_sa' | 'weekly_keyword_sa'

export type RawAdsSheetCell = string | number | null | undefined

export type RawAdsSheetRow = Record<string, RawAdsSheetCell>

export type NormalizedAdsRow = RawAdsMetricRow & {
  date: string | null
  campaignName: string | null
  adGroupName: string | null
  keyword: string | null
  spend: number | null
  impressions: number | null
  clicks: number | null
  conversions: number | null
  revenue: number | null
}

export type AdsRawTable = {
  reportType: AdsSheetsReportType
  tabName: string
  columns: string[]
  rows: NormalizedAdsRow[]
  rowCount: number
}

export type AdsSheetsNormalizerDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: 'empty_table' | 'invalid_number' | 'missing_required_column' | 'unsupported_report_type'
  field: string
  rowIndex: number | null
  message: string
}

export type NormalizeAdsSheetRowsInput = {
  reportType: string
  tabName: string
  rows: RawAdsSheetRow[]
}

export type NormalizeAdsSheetRowsResult = {
  table: AdsRawTable | null
  diagnostics: AdsSheetsNormalizerDiagnostic[]
}

const SUPPORTED_REPORT_TYPES = new Set<string>([
  'daily_sa',
  'daily_conversion_sa',
  'weekly_keyword_sa',
])

const FIELD_ALIASES = {
  date: ['date', '날짜', '일자'],
  campaignName: ['campaignName', 'campaign_name', '캠페인명', '캠페인'],
  adGroupName: ['adGroupName', 'ad_group_name', '광고그룹명', '광고그룹'],
  keyword: ['keyword', '키워드'],
  spend: ['spend', 'cost', '비용', '광고비'],
  impressions: ['impressions', '노출수', '노출'],
  clicks: ['clicks', '클릭수', '클릭'],
  conversions: ['conversions', '전환수', '전환'],
  revenue: ['revenue', '매출', '전환매출'],
} satisfies Record<keyof NormalizedAdsRow, string[]>

const REQUIRED_FIELDS: Array<keyof NormalizedAdsRow> = [
  'date',
  'campaignName',
  'adGroupName',
  'keyword',
  'spend',
  'impressions',
  'clicks',
  'conversions',
  'revenue',
]

export function normalizeAdsSheetRows(
  input: NormalizeAdsSheetRowsInput,
): NormalizeAdsSheetRowsResult {
  const diagnostics: AdsSheetsNormalizerDiagnostic[] = []

  if (!SUPPORTED_REPORT_TYPES.has(input.reportType)) {
    return {
      table: null,
      diagnostics: [
        {
          severity: 'error',
          code: 'unsupported_report_type',
          field: 'reportType',
          rowIndex: null,
          message: '지원하지 않는 광고 운영 raw report type입니다.',
        },
      ],
    }
  }

  if (input.rows.length === 0) {
    diagnostics.push({
      severity: 'warning',
      code: 'empty_table',
      field: 'rows',
      rowIndex: null,
      message: '광고 운영 raw table에 데이터 행이 없습니다.',
    })
  }

  const availableColumns = collectColumns(input.rows)
  const columnMap = buildColumnMap(availableColumns)

  for (const field of REQUIRED_FIELDS) {
    if (!columnMap[field]) {
      diagnostics.push({
        severity: 'error',
        code: 'missing_required_column',
        field,
        rowIndex: null,
        message: '광고 운영 raw table에 필수 컬럼이 없습니다.',
      })
    }
  }

  if (diagnostics.some((diagnostic) => diagnostic.code === 'missing_required_column')) {
    return {
      table: {
        reportType: input.reportType as AdsSheetsReportType,
        tabName: input.tabName,
        columns: availableColumns,
        rows: [],
        rowCount: 0,
      },
      diagnostics,
    }
  }

  const rows = input.rows.map((row, rowIndex) => normalizeRow(row, columnMap, rowIndex, diagnostics))

  return {
    table: {
      reportType: input.reportType as AdsSheetsReportType,
      tabName: input.tabName,
      columns: availableColumns,
      rows,
      rowCount: rows.length,
    },
    diagnostics,
  }
}

function collectColumns(rows: RawAdsSheetRow[]): string[] {
  const columns = new Set<string>()

  for (const row of rows) {
    for (const column of Object.keys(row)) {
      columns.add(column)
    }
  }

  return [...columns]
}

function buildColumnMap(columns: string[]): Record<keyof NormalizedAdsRow, string | null> {
  return Object.fromEntries(
    REQUIRED_FIELDS.map((field) => [field, findColumn(columns, FIELD_ALIASES[field])]),
  ) as Record<keyof NormalizedAdsRow, string | null>
}

function findColumn(columns: string[], aliases: string[]): string | null {
  const normalizedColumns = columns.map((column) => ({
    original: column,
    normalized: normalizeColumnName(column),
  }))

  for (const alias of aliases) {
    const normalizedAlias = normalizeColumnName(alias)
    const match = normalizedColumns.find((column) => column.normalized === normalizedAlias)

    if (match) {
      return match.original
    }
  }

  return null
}

function normalizeRow(
  row: RawAdsSheetRow,
  columnMap: Record<keyof NormalizedAdsRow, string | null>,
  rowIndex: number,
  diagnostics: AdsSheetsNormalizerDiagnostic[],
): NormalizedAdsRow {
  return {
    date: readText(row, columnMap.date),
    campaignName: readText(row, columnMap.campaignName),
    adGroupName: readText(row, columnMap.adGroupName),
    keyword: readText(row, columnMap.keyword),
    spend: readNumber(row, columnMap.spend, 'spend', rowIndex, diagnostics),
    impressions: readNumber(row, columnMap.impressions, 'impressions', rowIndex, diagnostics),
    clicks: readNumber(row, columnMap.clicks, 'clicks', rowIndex, diagnostics),
    conversions: readNumber(row, columnMap.conversions, 'conversions', rowIndex, diagnostics),
    revenue: readNumber(row, columnMap.revenue, 'revenue', rowIndex, diagnostics),
  }
}

function readText(row: RawAdsSheetRow, column: string | null): string | null {
  if (column === null) {
    return null
  }

  const value = row[column]

  if (typeof value === 'number') {
    return String(value)
  }

  const normalized = value?.trim()

  return normalized ? normalized : null
}

function readNumber(
  row: RawAdsSheetRow,
  column: string | null,
  field: keyof NormalizedAdsRow,
  rowIndex: number,
  diagnostics: AdsSheetsNormalizerDiagnostic[],
): number | null {
  if (column === null) {
    return null
  }

  const value = row[column]

  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : pushInvalidNumber(field, rowIndex, diagnostics)
  }

  const normalized = value.trim()

  if (normalized === '') {
    return null
  }

  const parsed = Number(normalized.replaceAll(',', ''))

  if (!Number.isFinite(parsed)) {
    return pushInvalidNumber(field, rowIndex, diagnostics)
  }

  return parsed
}

function pushInvalidNumber(
  field: keyof NormalizedAdsRow,
  rowIndex: number,
  diagnostics: AdsSheetsNormalizerDiagnostic[],
): null {
  diagnostics.push({
    severity: 'warning',
    code: 'invalid_number',
    field,
    rowIndex,
    message: '광고 운영 raw row의 숫자 값을 해석할 수 없습니다.',
  })

  return null
}

function normalizeColumnName(value: string): string {
  return value.trim().toLowerCase().replaceAll(' ', '').replaceAll('_', '')
}
