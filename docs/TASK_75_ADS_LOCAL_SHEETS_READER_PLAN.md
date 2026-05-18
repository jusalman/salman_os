# TASK-75 Ads Local Sheets Reader Plan

## Purpose

This document defines the implementation plan for a future local-only Google Sheets reader for the SALMAN OS Ads module.

This task is planning only.

- No Google Sheets API implementation
- No credentials
- No `.env.local` edits
- No Supabase/RLS/RPC changes
- No real sheet reading
- No UI runtime wiring

## Local-Only Reader Scope

The local-only reader should implement the existing `AdsSheetsReader` interface from `src/domain/adsSheetsConnector.ts`.

It should:

- run only in a server/local Node context
- read configured client spreadsheets and raw tabs
- return sanitized `RawAdsSheetRow[]` values and connector diagnostics
- keep the frontend on mock mode until a separate activation gate task
- never import Google SDKs into React components or browser runtime code

It should not:

- write to Google Sheets
- update Naver Ads
- generate audit/report output
- change Supabase/RLS/RPC
- expose credentials to Vite frontend env

## Credential Boundary

Allowed credential locations:

- local environment variable pointing to a service account JSON path
- local/server-only environment variables injected outside git
- future production secret manager or managed server env

Forbidden credential locations:

- repo source files
- docs
- tests
- committed env files
- Vite frontend env variables
- browser local storage/session storage

Service account JSON files and token files must never be committed.

## Placeholder Env Names

Placeholder names only:

```text
ADS_SHEETS_CONNECTOR_MODE=mock
ADS_GOOGLE_APPLICATION_CREDENTIALS=/absolute/local/path/service-account.json
ADS_GOOGLE_SERVICE_ACCOUNT_EMAIL=placeholder@example.iam.gserviceaccount.com
ADS_GOOGLE_PRIVATE_KEY=placeholder-only
ADS_GOOGLE_TOKEN_CACHE_PATH=/absolute/local/path/token-cache.json
```

Rules:

- Do not commit real values.
- Do not add these to `.env.local` in this task.
- Do not prefix these with `VITE_`.
- Prefer `ADS_GOOGLE_APPLICATION_CREDENTIALS` path-based local loading first.

## `.gitignore` Requirements

Current `.gitignore` already ignores `*.local`, which protects `.env.local`.

Before implementing a real local reader, add explicit credential patterns in a separate approved task:

```text
*.service-account.json
*token*.json
*credentials*.json
```

This TASK does not edit `.gitignore`; it only records the requirement.

## Input/Output Contract

Input:

- `AdsSheetsClientConfig`
- `spreadsheetId`
- `rawTabs.dailySa`
- `rawTabs.dailyConversionSa`
- `rawTabs.weeklyKeywordSa`

Output:

- `AdsSheetsSanitizedClientReadResult`
- `tabs: Partial<Record<AdsSheetsRawTabKey, RawAdsSheetRow[]>>`
- `diagnostics: AdsSheetsConnectorDiagnostic[]`

The local reader should return only sanitized cell values and diagnostics. It should not return credential state, Google API response objects, request headers, token details, or stack traces containing secret paths.

## Safe Error Handling

Permission denied:

- return `permission_denied`
- do not expose service account email/private key details
- do not retry with broader browser privileges

Missing spreadsheet:

- return a sanitized error diagnostic
- do not reveal full Google API error payload
- keep the client result non-fatal for other clients

Missing tab:

- return `missing_tab`
- continue reading other configured tabs when possible

Quota or rate limit:

- return a connector diagnostic using a later-added safe code
- do not loop/retry aggressively
- record only sanitized reason text

Malformed rows:

- return raw rows if readable
- let `adsSheetsNormalizer` report `column_mismatch` or invalid number diagnostics

## Implementation Order

1. Check dependency decision for Google Sheets access library.
2. Document env placeholders without real values.
3. Add `.gitignore` credential patterns in a separate approved task if needed.
4. Implement local-only reader behind `AdsSheetsReader`.
5. Keep fake-reader tests as the default regression suite.
6. Add local reader tests with mocked Google client only.
7. Add optional manual smoke script later.
8. Add UI activation gate only after local reader smoke is explicitly approved.

## Verification Criteria

Before any real local read is considered usable:

- fake reader tests still pass
- local reader tests do not require real credentials
- lint passes
- build passes
- no `.env.local` or credential file appears in `git status --short`
- no Google credential value is printed in logs
- UI remains on mock path unless explicitly activated

## Decision

The first real Sheets implementation must be a local/server-only `AdsSheetsReader` implementation. Credentials remain outside git and outside Vite frontend, while existing config, normalizer, metrics, connector interface, and view-model pipeline remain reusable.
