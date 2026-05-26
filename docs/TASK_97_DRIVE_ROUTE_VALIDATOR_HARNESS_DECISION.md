# TASK-97 Drive Route Validator Harness Decision

## Purpose

TASK-97 decides whether SALMAN OS should add request/response validation and a route handler test harness before implementing any actual Google Drive API route.

Decision: add a lightweight pure validator and fake route handler harness now, but do not create real `/api/drive/*` route files.

## TASK-96 Contract Summary

TASK-96 added:

- `src/domain/driveBackendContract.ts`
- `src/data/adapters/mock/driveBackendFakeClient.ts`

The current runtime remains:

```text
FilesPanel -> useClientDriveFiles(clientId) -> driveFileRepository -> driveFileMockRepository
```

The fake backend client exists only as a future server route contract target. It does not call `fetch` and does not create an actual API route.

## Validator Need

Request/response validation is needed before real routes because the future server boundary will become the first place where untrusted route input meets Drive metadata access.

The validator should protect:

- invalid `clientId`
- invalid `fileId`
- invalid category/status/sensitivity filters
- non-boolean `includeArchived`
- credential-shaped request keys
- unsafe response content such as raw credential, token, `.env`, OAuth, service account, or real Drive URL strings
- excluded file metadata accidentally returned by a future route

## Dependency Decision

No validation dependency was added.

`zod` or a similar schema library is not necessary yet because the current Drive route contract is small, stable, and easy to validate with pure TypeScript helpers. A dependency can be reconsidered only when several route contracts become complex enough to justify it.

## Placement Decision

Validator placement:

- `src/domain/driveRouteValidation.ts`

Reason:

- pure domain-level validation is testable without route files
- it does not depend on Vercel, Express, browser APIs, `fetch`, or Google SDKs
- a future `/api/drive/*` route can import these helpers without moving the contract

Fake handler harness placement:

- `src/data/adapters/mock/driveRouteFakeHandler.ts`

Reason:

- it models handler input/output using the fake backend client
- it does not create an actual route
- it gives tests a stable place to verify validation plus client response safety

## Implemented Minimum Scope

Added pure validation helpers:

- `validateDriveBackendListFilesRequest`
- `validateDriveBackendGetFileRequest`
- `validateDriveBackendListCategoriesRequest`
- `checkDriveBackendResponseSafety`

Added pure fake handler harness:

- `handleDriveRouteHarness`

The harness accepts:

- `operation: 'list_files' | 'get_file' | 'list_categories'`
- `body: unknown`

It validates the request, calls the fake backend client, checks response safety, and returns the shared contract response shape.

## Not Implemented

TASK-97 does not add:

- real `/api/drive/*` route files
- `fetch('/api/drive/*')` frontend wiring
- Google Drive API calls
- `googleapis`
- OAuth
- service account handling
- token handling
- credential/env reading
- Supabase Drive metadata schema activation
- embedding/vector/RAG answer flow
- chatbot UI

## Test Scope

Added tests for:

- valid list request validation
- invalid filter rejection with safe diagnostics
- credential-shaped request key rejection
- list categories request validation
- unsafe response detection
- fake route harness list file handling
- fake route harness invalid request response
- fake route harness not calling `fetch`

## Next TASK

TASK-98 should decide whether to add real Vercel-style `/api/drive/*` mock route files that use this validator and fake backend client, still without Google Drive API, credentials, OAuth, or Supabase Drive metadata activation.
