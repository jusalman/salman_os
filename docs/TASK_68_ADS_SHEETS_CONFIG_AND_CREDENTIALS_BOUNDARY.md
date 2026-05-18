# TASK-68 Ads Sheets Config And Credentials Boundary

## Purpose

This document fixes the configuration source and credential boundary before implementing the SALMAN OS Ads Google Sheets connector.

This task is planning only.

- No Google Sheets API implementation
- No credentials
- No `.env.local` edits
- No Supabase/RLS/RPC changes
- No SQL execution
- No real audit or report generation

## Spreadsheet ID Source Decision

The client spreadsheet id should come from an Ads connector config record, not from UI code.

v1 source order:

1. Start with a checked-in mock/docs config that uses fake spreadsheet ids only.
2. Use that config for parser, normalizer, and UI wiring tests.
3. Later move the real client spreadsheet id to an approved server-side or Supabase-backed client Ads config field.

`spreadsheetId` is operational configuration, not an API secret, but real customer sheet ids should not be hardcoded into frontend source by default. Real values require a separate approved task and should be loaded through a controlled config boundary.

## Required Config Fields

```ts
type AdsSheetsClientConfig = {
  clientId: string
  clientName: string
  spreadsheetId: string
  rawTabs: {
    dailySa: '데일리SA_RAW'
    dailyConversionSa: '데일리전환SA_RAW'
    weeklyKeywordSa: '위클리키워드SA_RAW'
  }
  enabled: boolean
  lastConfiguredAt: string
}
```

Rules:

- `clientId` must match the SALMAN OS client identity used by the Ads view model.
- `clientName` is display-only and should not be used as the stable key.
- `spreadsheetId` must be present only for enabled clients that should be read.
- `rawTabs` must keep the v1 raw tab contract from TASK-62.
- `enabled: false` clients should be skipped and surfaced as intentionally not configured.
- `lastConfiguredAt` records config freshness, not Google Sheets data freshness.

## Config Source Boundary

Initial mock config:

- May live under docs/config or an equivalent non-runtime fixture in a later task.
- Must use fake spreadsheet ids such as `mock-spreadsheet-id`.
- Must not include Google credentials, Naver credentials, service keys, or customer secrets.

Later production config:

- Preferred direction is a reviewed Supabase client field or related Ads config table.
- Any Supabase schema/RLS change must be a separate approved task.
- The browser should receive only the minimum read model needed for UI rendering.

## Google Sheets Credential Boundary

Credentials must stay outside frontend code.

Allowed later:

- server-only environment variables
- local uncommitted env for development
- managed secret storage in the deployment platform
- a backend, edge function, or server connector that reads Google Sheets and returns sanitized data

Forbidden:

- committing service account JSON
- putting Google API keys, private keys, or service account email/private key material in `VITE_` variables
- reading private Sheets directly from the browser with a secret
- printing credential values in logs
- storing service account JSON in docs, source, tests, or fixtures

If OAuth is needed later, it must be planned as a separate task. It is not part of Ads connector v1 planning.

## v1 Implementation Approach

Implementation should proceed in this order:

1. Mock config reader with fake spreadsheet ids.
2. Pure parser and normalizer tests based on representative raw tab shapes.
3. Mock connector result generation for UI wiring.
4. Real Google Sheets API connector behind a server-only credential boundary.
5. Production config source migration after schema/RLS approval if Supabase is used.

The first implementation must keep Google Sheets disconnected and must not require credentials.

## Forbidden Mistakes

- Do not put service account JSON in the repo.
- Do not expose API keys, service keys, or private keys through Vite frontend env.
- Do not read Google Sheets from the browser using a secret.
- Do not mix connector credentials work with metrics, audit rules, report generation, GEO, RAG, Calendar, or Supabase/RLS/RPC changes.
- Do not treat spreadsheet config as authorization. Google Sheets access must still be enforced by the server-side credential boundary.

## Decision

SALMAN OS Ads should first use a non-secret mock config contract. Real spreadsheet ids and Google credentials stay outside frontend source, with credentials limited to server-only or local-only secret storage in a later approved connector task.
