import assert from 'node:assert/strict'
import test from 'node:test'

import { calculateAdsMetrics, safeDivide } from '../../src/domain/adsMetrics.ts'

test('calculates safe ad metrics for normal data', () => {
  const result = calculateAdsMetrics([
    {
      spend: 100_000,
      impressions: 10_000,
      clicks: 500,
      conversions: 25,
      revenue: 400_000,
    },
  ])

  assert.equal(result.ctr, 0.05)
  assert.equal(result.cpc, 200)
  assert.equal(result.cpa, 4_000)
  assert.equal(result.roas, 4)
  assert.equal(result.healthScore, 100)
  assert.equal(result.status, 'normal')
})

test('returns null cpc when clicks are zero', () => {
  const result = calculateAdsMetrics([
    {
      spend: 100_000,
      impressions: 10_000,
      clicks: 0,
      conversions: 10,
      revenue: 300_000,
    },
  ])

  assert.equal(result.cpc, null)
  assert.equal(result.ctr, 0)
  assert.equal(result.status, 'warning')
})

test('returns null cpa when conversions are zero', () => {
  const result = calculateAdsMetrics([
    {
      spend: 50_000,
      impressions: 5_000,
      clicks: 200,
      conversions: 0,
      revenue: 0,
    },
  ])

  assert.equal(result.cpa, null)
  assert.equal(result.conversions, 0)
  assert.equal(result.status, 'warning')
})

test('returns null roas when spend is zero', () => {
  const result = calculateAdsMetrics([
    {
      spend: 0,
      impressions: 1_000,
      clicks: 20,
      conversions: 2,
      revenue: 30_000,
    },
  ])

  assert.equal(result.roas, null)
  assert.equal(result.cpc, 0)
  assert.equal(result.cpa, 0)
})

test('marks missing data when rows are empty', () => {
  const result = calculateAdsMetrics([])

  assert.equal(result.healthScore, null)
  assert.equal(result.status, 'missing_data')
  assert.equal(result.spend, null)
})

test('marks stale data as warning and keeps calculable metrics', () => {
  const result = calculateAdsMetrics(
    [
      {
        spend: 100_000,
        impressions: 10_000,
        clicks: 500,
        conversions: 25,
        revenue: 400_000,
      },
    ],
    { isStale: true },
  )

  assert.equal(result.status, 'warning')
  assert.equal(result.healthScore, 85)
  assert.ok(result.riskSignals.includes('stale_data'))
})

test('marks high cost with no conversions as risk', () => {
  const result = calculateAdsMetrics(
    [
      {
        spend: 200_000,
        impressions: 12_000,
        clicks: 700,
        conversions: 0,
        revenue: 0,
      },
    ],
    { highCostNoConversionThreshold: 100_000 },
  )

  assert.equal(result.status, 'risk')
  assert.ok(result.riskSignals.includes('high_cost_no_conversion'))
})

test('safeDivide avoids invalid ratio output', () => {
  assert.equal(safeDivide(null, 1), null)
  assert.equal(safeDivide(1, null), null)
  assert.equal(safeDivide(1, 0), null)
  assert.equal(safeDivide(4, 2), 2)
})
