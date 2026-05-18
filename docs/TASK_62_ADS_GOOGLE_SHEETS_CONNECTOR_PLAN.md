# TASK-62 Ads Google Sheets Connector Plan

## Purpose

This document defines the planned read-only Google Sheets connector structure for the SALMAN OS Ads module.

This task is planning only.

- No Google Sheets API implementation
- No credentials
- No `.env.local` edits
- No Supabase/RLS/RPC changes
- No SQL execution
- No metrics, audit, or report generation implementation

## Connector v1 Purpose

The Ads Google Sheets connector should let SALMAN OS read client-specific Naver Ads raw report tabs that were already collected by `salman-naver-report-auto`.

The connector is not responsible for:

- logging into Naver Ads
- collecting raw Naver Ads data
- changing campaigns, bids, budgets, or keywords
- writing back to Google Sheets in v1

## Input Source Contract

Each connector target should be resolved from a client-level Ads sheet config:

- `clientId`: SALMAN OS client id
- `clientName`: display name used in Ads dashboards
- `spreadsheetId`: Google Sheets spreadsheet id for that client's Ads raw reports
- `tabs`: expected raw tab names
- `reportType`: normalized report category for each tab
- `sourceUpdatedAt`: optional timestamp from the source sheet or collector metadata

The connector should read only the configured spreadsheet and tabs for a known SALMAN OS client.

## Expected Raw Tabs

Required v1 raw tabs:

- `데일리SA_RAW`
- `데일리전환SA_RAW`
- `위클리키워드SA_RAW`

Initial report type mapping:

| Raw tab | Report type | Purpose |
| --- | --- | --- |
| `데일리SA_RAW` | `daily_sa` | Daily search ad performance summary |
| `데일리전환SA_RAW` | `daily_conversion_sa` | Daily search ad conversion performance |
| `위클리키워드SA_RAW` | `weekly_keyword_sa` | Weekly keyword-level search ad performance |

## Connector Config Source

Recommended config source order:

1. Start with documented mock/static config for local UI and adapter tests.
2. Later move client Ads sheet metadata into a reviewed operational config source.
3. Only after separate approval, connect that config to real Google Sheets reads.

Possible future config locations:

- Supabase client metadata table or related Ads config table
- checked-in non-secret fixture for local mock mode
- internal admin-maintained config document

Config must not include Google API secrets or service account private keys in frontend code.

## Read-Only Principle

v1 connector must be read-only.

Allowed:

- read spreadsheet values
- read tab metadata needed for validation
- return normalized rows and connector diagnostics

Forbidden:

- update cells
- create tabs
- delete tabs
- mutate formatting
- move budgets
- edit campaigns
- expose credentials to frontend

## Normalized Output Shape

The connector should return a client-scoped normalized object that the Ads module can consume without knowing raw sheet details.

```ts
type AdsSheetsReadResult = {
  clientId: string
  clientName: string
  spreadsheetId: string
  sourceUpdatedAt: string | null
  tabs: {
    dailySa: AdsRawTable
    dailyConversionSa: AdsRawTable
    weeklyKeywordSa: AdsRawTable
  }
  diagnostics: AdsSheetDiagnostic[]
}

type AdsRawTable = {
  reportType: 'daily_sa' | 'daily_conversion_sa' | 'weekly_keyword_sa'
  tabName: string
  columns: string[]
  rows: Array<Record<string, string | number | boolean | null>>
  rowCount: number
}

type AdsSheetDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code:
    | 'missing_sheet_id'
    | 'missing_tab'
    | 'empty_data'
    | 'column_mismatch'
    | 'permission_denied'
  message: string
}
```

Downstream Ads features should consume normalized data, not raw Google Sheets API responses.

## Error Cases

### Missing Sheet ID

Condition:

- client has no configured `spreadsheetId`

Expected behavior:

- return an error diagnostic with `missing_sheet_id`
- show a non-blocking placeholder/error state for that client

### Missing Tab

Condition:

- spreadsheet exists, but one of the required raw tabs is missing

Expected behavior:

- return `missing_tab`
- continue reporting any tabs that were read successfully

### Empty Data

Condition:

- tab exists, but has no data rows after the header row

Expected behavior:

- return `empty_data`
- keep the tab result with `rowCount: 0`

### Column Mismatch

Condition:

- required or expected columns are missing or renamed

Expected behavior:

- return `column_mismatch`
- prevent downstream metrics/audit from treating the tab as reliable

### Permission Denied

Condition:

- Google Sheets read is rejected due to permission or auth scope

Expected behavior:

- return `permission_denied`
- do not retry with broader privileges in frontend
- do not expose credential details

## Later Implementation Order

1. Config reader
2. Sheet reader
3. Normalizer
4. Mock fallback
5. UI wiring

Each step should be a separate approved task.

## Guardrails

- Keep `salman-naver-report-auto` as the Naver Ads data collection engine.
- Keep client Google Sheets as the raw data store.
- Keep SALMAN OS Ads as a read-only visualization, audit, action, and report draft layer.
- Do not mix connector implementation with metrics, audit rules, report generation, GEO, RAG, Calendar, or Supabase/RLS/RPC changes.
