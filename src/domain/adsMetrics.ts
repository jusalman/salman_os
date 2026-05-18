export type AdsMetricStatus = 'normal' | 'warning' | 'risk' | 'missing_data'

export type AdsMetricDiagnosticCode =
  | 'missing_sheet_id'
  | 'missing_tab'
  | 'empty_data'
  | 'column_mismatch'
  | 'permission_denied'
  | 'stale_data'

export type AdsMetricDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code: AdsMetricDiagnosticCode
  message: string
}

export type RawAdsMetricRow = {
  spend?: number | null
  impressions?: number | null
  clicks?: number | null
  conversions?: number | null
  revenue?: number | null
}

export type AdsMetricBaseline = {
  spend?: number | null
  conversions?: number | null
  cpc?: number | null
  roas?: number | null
}

export type CalculateAdsMetricsOptions = {
  diagnostics?: AdsMetricDiagnostic[]
  isStale?: boolean
  highCostNoConversionThreshold?: number
  baseline?: AdsMetricBaseline
}

export type CalculatedAdsMetrics = {
  spend: number | null
  impressions: number | null
  clicks: number | null
  ctr: number | null
  cpc: number | null
  conversions: number | null
  cpa: number | null
  revenue: number | null
  roas: number | null
  healthScore: number | null
  status: AdsMetricStatus
  riskSignals: string[]
  diagnostics: AdsMetricDiagnostic[]
}

const DEFAULT_HIGH_COST_NO_CONVERSION_THRESHOLD = 100_000

const missingDataCodes = new Set<AdsMetricDiagnosticCode>([
  'missing_sheet_id',
  'empty_data',
  'column_mismatch',
  'permission_denied',
])

export function calculateAdsMetrics(
  rows: RawAdsMetricRow[],
  options: CalculateAdsMetricsOptions = {},
): CalculatedAdsMetrics {
  const diagnostics = normalizeDiagnostics(options.diagnostics ?? [], options.isStale)
  const hasMissingData = rows.length === 0 || diagnostics.some((item) => missingDataCodes.has(item.code))
  const spend = sumMetric(rows, 'spend')
  const impressions = sumMetric(rows, 'impressions')
  const clicks = sumMetric(rows, 'clicks')
  const conversions = sumMetric(rows, 'conversions')
  const revenue = sumMetric(rows, 'revenue')
  const ctr = safeDivide(clicks, impressions)
  const cpc = safeDivide(spend, clicks)
  const cpa = safeDivide(spend, conversions)
  const roas = safeDivide(revenue, spend)
  const riskSignals = collectRiskSignals({
    spend,
    conversions,
    cpc,
    roas,
    diagnostics,
    baseline: options.baseline,
    highCostNoConversionThreshold:
      options.highCostNoConversionThreshold ?? DEFAULT_HIGH_COST_NO_CONVERSION_THRESHOLD,
  })
  const healthScore = hasMissingData
    ? null
    : calculateHealthScore({
        diagnostics,
        spend,
        conversions,
        cpc,
        roas,
        riskSignals,
      })
  const status = mapAdsMetricStatus({ healthScore, diagnostics, riskSignals })

  return {
    spend,
    impressions,
    clicks,
    ctr,
    cpc,
    conversions,
    cpa,
    revenue,
    roas,
    healthScore,
    status,
    riskSignals,
    diagnostics,
  }
}

export function safeDivide(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) {
    return null
  }

  return numerator / denominator
}

function sumMetric(rows: RawAdsMetricRow[], key: keyof RawAdsMetricRow): number | null {
  let hasValue = false
  let total = 0

  for (const row of rows) {
    const value = row[key]

    if (typeof value === 'number' && Number.isFinite(value)) {
      hasValue = true
      total += value
    }
  }

  return hasValue ? total : null
}

function normalizeDiagnostics(
  diagnostics: AdsMetricDiagnostic[],
  isStale?: boolean,
): AdsMetricDiagnostic[] {
  if (!isStale || diagnostics.some((item) => item.code === 'stale_data')) {
    return diagnostics
  }

  return [
    ...diagnostics,
    {
      severity: 'warning',
      code: 'stale_data',
      message: 'source data is stale',
    },
  ]
}

function collectRiskSignals({
  spend,
  conversions,
  cpc,
  roas,
  diagnostics,
  baseline,
  highCostNoConversionThreshold,
}: {
  spend: number | null
  conversions: number | null
  cpc: number | null
  roas: number | null
  diagnostics: AdsMetricDiagnostic[]
  baseline?: AdsMetricBaseline
  highCostNoConversionThreshold: number
}): string[] {
  const signals: string[] = []

  if (diagnostics.some((item) => missingDataCodes.has(item.code))) {
    signals.push('missing_data')
  }

  if (diagnostics.some((item) => item.code === 'stale_data')) {
    signals.push('stale_data')
  }

  if (hasIncreasedBy(spend, baseline?.spend, 1.5)) {
    signals.push('spend_spike')
  }

  if (hasDroppedBelow(conversions, baseline?.conversions, 0.5)) {
    signals.push('conversion_drop')
  }

  if (hasIncreasedBy(cpc, baseline?.cpc, 1.3)) {
    signals.push('cpc_rise')
  }

  if (hasDroppedBelow(roas, baseline?.roas, 0.7)) {
    signals.push('roas_drop')
  }

  if (spend !== null && spend >= highCostNoConversionThreshold && conversions === 0) {
    signals.push('high_cost_no_conversion')
  }

  if (spend !== null && spend > 0 && conversions === 0) {
    signals.push('no_conversions')
  }

  if (
    (spend !== null && cpc === null) ||
    (spend !== null && conversions !== null && conversions === 0) ||
    (spend !== null && roas === null)
  ) {
    signals.push('unavailable_ratio')
  }

  return signals
}

function calculateHealthScore({
  diagnostics,
  spend,
  conversions,
  cpc,
  roas,
  riskSignals,
}: {
  diagnostics: AdsMetricDiagnostic[]
  spend: number | null
  conversions: number | null
  cpc: number | null
  roas: number | null
  riskSignals: string[]
}): number {
  let score = 100

  if (diagnostics.some((item) => item.code === 'missing_tab')) {
    score -= 20
  }

  if (diagnostics.some((item) => item.code === 'stale_data')) {
    score -= 15
  }

  if (riskSignals.includes('spend_spike')) {
    score -= 15
  }

  if (riskSignals.includes('conversion_drop')) {
    score -= 20
  }

  if (riskSignals.includes('cpc_rise')) {
    score -= 15
  }

  if (riskSignals.includes('roas_drop')) {
    score -= 15
  }

  if (riskSignals.includes('high_cost_no_conversion')) {
    score -= 20
  }

  if (riskSignals.includes('no_conversions')) {
    score -= 10
  }

  if (spend === null || conversions === null || cpc === null || roas === null) {
    score -= 10
  }

  return clampScore(score)
}

function mapAdsMetricStatus({
  healthScore,
  diagnostics,
  riskSignals,
}: {
  healthScore: number | null
  diagnostics: AdsMetricDiagnostic[]
  riskSignals: string[]
}): AdsMetricStatus {
  if (healthScore === null || diagnostics.some((item) => missingDataCodes.has(item.code))) {
    return 'missing_data'
  }

  if (
    healthScore <= 49 ||
    riskSignals.includes('high_cost_no_conversion') ||
    riskSignals.includes('roas_drop')
  ) {
    return 'risk'
  }

  if (
    healthScore <= 74 ||
    riskSignals.includes('no_conversions') ||
    riskSignals.includes('unavailable_ratio') ||
    diagnostics.some((item) => item.severity === 'warning')
  ) {
    return 'warning'
  }

  return 'normal'
}

function hasIncreasedBy(value: number | null, baseline: number | null | undefined, multiplier: number) {
  return value !== null && typeof baseline === 'number' && baseline > 0 && value > baseline * multiplier
}

function hasDroppedBelow(value: number | null, baseline: number | null | undefined, multiplier: number) {
  return value !== null && typeof baseline === 'number' && baseline > 0 && value < baseline * multiplier
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score))
}
