# TASK-63 Ads View Model Contract

## Purpose

This document defines the planned mock view model and data contract between the SALMAN OS Ads UI and the future Google Sheets connector.

This task is planning only.

- No Google Sheets API implementation
- No credentials
- No UI data wiring
- No Supabase/RLS/RPC changes
- No metrics, audit, or report generation implementation

## Source Boundary

Input from TASK-62 connector:

- client-scoped `AdsSheetsReadResult`
- `AdsRawTable`
- connector diagnostics

Output to Ads UI:

- `AdsOperationsViewModel`

The UI should depend on the view model, not on raw Google Sheets API responses or raw tab rows.

## Ads v1 View Model

```ts
type AdsOperationsViewModel = {
  summary: AdsDashboardSummary
  clients: AdsClientSummary[]
  auditFindings: AdsAuditFinding[]
  actionItems: AdsActionItem[]
  reportDrafts: AdsReportDraft[]
  state: AdsViewState
}
```

## Dashboard Summary Fields

```ts
type AdsDashboardSummary = {
  totalClients: number
  normalCount: number
  warningCount: number
  riskCount: number
  missingDataCount: number
}
```

Field meaning:

- `totalClients`: clients included in Ads module scope
- `normalCount`: clients with no current warning or risk status
- `warningCount`: clients requiring staff review
- `riskCount`: clients with serious performance, data, or account risk signal
- `missingDataCount`: clients whose sheet config or raw data is incomplete

## Client-Level Ad Summary

```ts
type AdsClientSummary = {
  clientId: string
  clientName: string
  healthScore: number | null
  status: 'normal' | 'warning' | 'risk' | 'missing_data'
  spend: number | null
  clicks: number | null
  conversions: number | null
  cpc: number | null
  cpa: number | null
  roas: number | null
  lastUpdatedAt: string | null
  diagnostics: AdsViewDiagnostic[]
}
```

Rules:

- `healthScore` is `null` until the scoring rule is separately approved.
- Money and performance fields may be `null` when raw data is missing or unreliable.
- `diagnostics` should preserve connector problems in UI-safe language.
- `status` should be derived from diagnostics and later audit/risk rules, not from raw rows directly.

## Diagnostics Contract

```ts
type AdsViewDiagnostic = {
  severity: 'info' | 'warning' | 'error'
  code:
    | 'missing_sheet_id'
    | 'missing_tab'
    | 'empty_data'
    | 'column_mismatch'
    | 'permission_denied'
    | 'stale_data'
  message: string
}
```

## Tab-Specific Data Needs

### 전체 광고 현황

Needs:

- `summary`
- `clients`
- key diagnostics grouped by severity

Purpose:

- cross-client health overview
- missing data and risk queue visibility

### 고객사별 광고 상세

Needs:

- selected `AdsClientSummary`
- normalized table references from the connector
- latest update and diagnostics

Purpose:

- per-client Ads status review
- future campaign/ad group/keyword detail display

### AI 광고 감사

Needs:

- `auditFindings`
- related `clientId`
- severity and reason text

Purpose:

- show audit findings and risk signals
- remain review-only until separate AI/RAG approval

```ts
type AdsAuditFinding = {
  id: string
  clientId: string
  clientName: string
  severity: 'info' | 'warning' | 'risk'
  title: string
  reason: string
  source: 'rule_placeholder' | 'future_audit_engine'
}
```

### 담당자 액션리스트

Needs:

- `actionItems`
- client identity
- owner placeholder
- status placeholder

Purpose:

- convert future audit/data issues into staff-owned work

```ts
type AdsActionItem = {
  id: string
  clientId: string
  clientName: string
  title: string
  ownerName: string | null
  status: 'todo' | 'in_progress' | 'done'
  dueDate: string | null
  sourceFindingId: string | null
}
```

### 고객사 리포트 초안

Needs:

- `reportDrafts`
- client summary
- reviewed status

Purpose:

- prepare staff-reviewed customer-facing report drafts
- no automatic customer send in v1

```ts
type AdsReportDraft = {
  id: string
  clientId: string
  clientName: string
  title: string
  body: string
  status: 'draft_placeholder' | 'ready_for_review' | 'reviewed'
  updatedAt: string | null
}
```

## Mock Data Contract For First UI Wiring

First UI wiring should use static mock data that satisfies `AdsOperationsViewModel`.

Mock data should include:

- one `normal` client
- one `warning` client
- one `risk` client
- one `missing_data` client
- connector-style diagnostics for missing sheet, missing tab, column mismatch, permission denied, and stale data
- placeholder audit findings
- placeholder action items
- placeholder report drafts

Mock data should not include:

- real spreadsheet ids
- real customer secrets
- Google API credentials
- real Naver Ads credentials
- real bid, campaign, or budget mutation data

## No-Real-Data Placeholder States

```ts
type AdsViewState =
  | { type: 'loading'; message: string }
  | { type: 'ready' }
  | { type: 'empty'; message: string }
  | { type: 'permission_denied'; message: string }
  | { type: 'column_mismatch'; message: string }
  | { type: 'stale_data'; message: string; lastUpdatedAt: string | null }
```

State usage:

- `loading`: connector or mock adapter is preparing data
- `empty`: no clients or no Ads rows are available
- `permission_denied`: sheet access is blocked
- `column_mismatch`: raw tab columns do not match expected contract
- `stale_data`: data exists but is older than the approved freshness threshold

## Transformation Boundary

Future flow:

```text
AdsSheetsReadResult[]
  -> Ads normalizer
  -> AdsOperationsViewModel
  -> Ads UI tabs
```

The UI should not calculate raw metrics directly from Google Sheets rows. Metrics, status, audit findings, action items, and report drafts should be prepared before rendering.

## Guardrails

- Keep this contract read-only.
- Keep mock data separate from real connector data.
- Do not connect Google Sheets in the first view model task.
- Do not add metrics, audit rules, or report generation until separately approved.
- Do not touch ClientList RPC, Supabase RLS, GEO, RAG, or Calendar.
