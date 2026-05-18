import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeAdsSheetRows } from '../../src/domain/adsSheetsNormalizer.ts'

test('normalizes raw ads sheet rows', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'daily_sa',
    tabName: '데일리SA_RAW',
    rows: [
      {
        date: '2026-05-18',
        campaignName: '브랜드 캠페인',
        adGroupName: '핵심 그룹',
        keyword: '살만 병원',
        spend: 100000,
        impressions: 10000,
        clicks: 500,
        conversions: 25,
        revenue: 400000,
      },
    ],
  })

  assert.equal(result.table?.rowCount, 1)
  assert.deepEqual(result.table?.rows[0], {
    date: '2026-05-18',
    campaignName: '브랜드 캠페인',
    adGroupName: '핵심 그룹',
    keyword: '살만 병원',
    spend: 100000,
    impressions: 10000,
    clicks: 500,
    conversions: 25,
    revenue: 400000,
  })
  assert.equal(result.diagnostics.length, 0)
})

test('returns empty table diagnostic for empty rows', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'daily_sa',
    tabName: '데일리SA_RAW',
    rows: [],
  })

  assert.equal(result.table?.rowCount, 0)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.code === 'empty_table'))
})

test('returns missing column diagnostics', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'daily_sa',
    tabName: '데일리SA_RAW',
    rows: [
      {
        date: '2026-05-18',
        campaignName: '브랜드 캠페인',
        spend: 100000,
      },
    ],
  })

  assert.equal(result.table?.rowCount, 0)
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.field === 'adGroupName'))
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.field === 'keyword'))
  assert.ok(result.diagnostics.some((diagnostic) => diagnostic.field === 'impressions'))
})

test('returns invalid number diagnostics and keeps row with null value', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'daily_sa',
    tabName: '데일리SA_RAW',
    rows: [
      {
        date: '2026-05-18',
        campaignName: '브랜드 캠페인',
        adGroupName: '핵심 그룹',
        keyword: '살만 병원',
        spend: '숫자아님',
        impressions: '1,000',
        clicks: '10',
        conversions: '1',
        revenue: '20,000',
      },
    ],
  })

  assert.equal(result.table?.rows[0]?.spend, null)
  assert.equal(result.table?.rows[0]?.impressions, 1000)
  assert.equal(result.table?.rows[0]?.revenue, 20000)
  assert.equal(result.diagnostics.length, 1)
  assert.equal(result.diagnostics[0]?.code, 'invalid_number')
  assert.equal(result.diagnostics[0]?.field, 'spend')
})

test('parses comma numbers and Korean column aliases', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'weekly_keyword_sa',
    tabName: '위클리키워드SA_RAW',
    rows: [
      {
        날짜: '2026-05-18',
        캠페인명: '검색 캠페인',
        광고그룹명: '지역 그룹',
        키워드: '강남 병원',
        비용: '123,456',
        노출수: '12,345',
        클릭수: '678',
        전환수: '9',
        매출: '987,654',
      },
    ],
  })

  assert.equal(result.table?.rows[0]?.spend, 123456)
  assert.equal(result.table?.rows[0]?.impressions, 12345)
  assert.equal(result.table?.rows[0]?.clicks, 678)
  assert.equal(result.table?.rows[0]?.conversions, 9)
  assert.equal(result.table?.rows[0]?.revenue, 987654)
  assert.equal(result.diagnostics.length, 0)
})

test('returns unsupported report type diagnostic', () => {
  const result = normalizeAdsSheetRows({
    reportType: 'unknown_report',
    tabName: 'UNKNOWN_RAW',
    rows: [],
  })

  assert.equal(result.table, null)
  assert.equal(result.diagnostics.length, 1)
  assert.equal(result.diagnostics[0]?.code, 'unsupported_report_type')
})
