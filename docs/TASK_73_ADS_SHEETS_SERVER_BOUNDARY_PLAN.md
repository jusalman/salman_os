# TASK-73 Ads Sheets Server Boundary Plan

## Purpose

This document defines the frontend, server, and local connector boundary before SALMAN OS connects the Ads module to real Google Sheets data.

This task is planning only.

- No Google Sheets API implementation
- No credentials
- No `.env.local` edits
- No Supabase/RLS/RPC changes
- No SQL execution
- No real sheet reading

## Why Credentials Cannot Live In Vite Frontend

Vite frontend environment variables are bundled into browser-delivered code when they use the `VITE_` prefix.

Therefore Google Sheets credentials must not be placed in the Vite frontend because:

- browser users can inspect bundled JavaScript and network payloads
- service account private keys cannot be safely hidden in client code
- Google refresh tokens or token cache files would become extractable if shipped to the browser
- frontend code cannot enforce the server-side least-privilege boundary required for private client sheets

The frontend may hold public UI state and sanitized read results only. It must not hold Google private keys, service account JSON, refresh tokens, or server-side API secrets.

## Approved Connector Boundary

Approved v1 boundary:

1. Frontend UI calls a safe internal read layer.
2. The safe read layer returns sanitized Ads view-model data or normalized connector diagnostics.
3. Server/local-only connector holds Google credentials and reads Sheets.
4. Domain normalizer and metrics modules remain pure and reusable.

Current reusable pure modules:

- `src/domain/adsSheetsConfig.ts`
- `src/domain/adsSheetsNormalizer.ts`
- `src/domain/adsMetrics.ts`
- `src/domain/adsOperationsViewModel.ts`

The domain modules should not import Google SDKs, read env vars, open files, or perform network requests. They should accept plain inputs and return plain outputs.

## v1 Local/Dev Approach

Recommended local/dev sequence:

1. Keep UI on the current mock pipeline by default.
2. Add a server/local connector interface in a later task.
3. Test the connector interface with fake readers first.
4. Add a local-only Sheets reader that loads credentials from uncommitted local/server env.
5. Add an explicit UI activation gate only after connector tests pass.

Local credentials may exist only outside git-tracked files.

Allowed placeholder env names:

```text
ADS_SHEETS_CONNECTOR_MODE=mock
ADS_GOOGLE_APPLICATION_CREDENTIALS=/absolute/local/path/service-account.json
ADS_GOOGLE_SERVICE_ACCOUNT_EMAIL=placeholder@example.iam.gserviceaccount.com
ADS_GOOGLE_PRIVATE_KEY=placeholder-only
ADS_GOOGLE_TOKEN_CACHE_PATH=/absolute/local/path/token-cache.json
```

Rules:

- These names are placeholders only.
- Do not add real values to docs, source, tests, or committed env files.
- Do not expose these names through `VITE_` variables.
- Prefer a local path or secret manager injection over committing JSON.

## Later Production Approach

Recommended production boundary:

1. Frontend calls an internal server endpoint, edge function, or backend read service.
2. The server endpoint validates the requested client scope.
3. The server connector reads configured client Google Sheets with server-held credentials.
4. The connector returns normalized rows and diagnostics.
5. Pure normalizer, metrics, and view-model builders transform data for the UI.

Production secrets should live in managed server secrets, not in git and not in the browser.

If Supabase is used later for Ads config, any schema, RLS, RPC, or secret-storage decision must be a separate approved task.

## Files That Must Never Be Committed

Never commit:

- `.env.local`
- service account JSON files
- OAuth token files
- refresh token cache files
- downloaded Google credential exports
- any file containing `private_key`, `client_secret`, refresh token, or service role key

Recommended local-only patterns:

```text
*.service-account.json
*token*.json
*credentials*.json
```

Adding or changing `.gitignore` for these patterns should be a separate approved implementation task if needed.

## Implementation Order

1. Define server/local connector interface.
2. Add fake reader tests for success and diagnostics.
3. Add local-only Sheets reader behind that interface.
4. Keep mock fallback as the default path.
5. Add explicit UI activation gate.
6. Only then consider production connector deployment.

Each step should be a separate task.

## Forbidden Mistakes

- Do not place Google service account JSON in the repo.
- Do not put Google private keys, token cache values, or service account data into `VITE_` env vars.
- Do not read private Sheets directly from the browser with a secret.
- Do not mix connector work with Supabase/RLS/RPC, GEO, RAG, Calendar, real audit, or report generation.
- Do not treat spreadsheet ids as authorization. Access control must be enforced at the safe internal read layer.

## Decision

SALMAN OS Ads must keep the browser as a sanitized consumer only. Real Google Sheets credentials belong exclusively to a server/local connector boundary, while the existing config reader, normalizer, metrics calculator, and view-model pipeline remain pure and reusable.
