# TASK-96 Drive Backend Contract and Fake Client

## Purpose

TASK-96 adds a shared Drive backend route contract and a fake backend client before any real `/api/drive/*` route or Google Drive API integration exists.

This keeps SALMAN OS v1 on the TASK-94 mock Drive repository while defining the shape that a future server-owned Drive route can satisfy.

## TASK-95 Boundary Summary

TASK-95 decided that the future actual Drive adapter must sit behind server-owned Vercel-style `/api/drive/*` routes.

The frontend bundle must not contain Google Drive credentials, OAuth tokens, service account paths, local credential paths, or direct Google Drive API clients.

## Shared Contract Structure

Added `src/domain/driveBackendContract.ts`.

The contract defines:

- `DriveBackendClient`
- `DriveBackendListFilesRequest`
- `DriveBackendListFilesResponse`
- `DriveBackendGetFileRequest`
- `DriveBackendGetFileResponse`
- `DriveBackendListCategoriesRequest`
- `DriveBackendListCategoriesResponse`
- `DriveBackendFileSummary`
- `DriveBackendDiagnostic`
- `DriveBackendErrorCode`

The response model includes sanitized metadata only:

- `fileId`
- `clientId`
- `displayName`
- `category`
- `section`
- `folderName`
- `folderPath`
- `fileType`
- `status`
- `sensitivity`
- `owner`
- `updatedAt`
- optional `sourceUrl`
- optional `openUrl`

The contract does not include credential path, token path, service account path, raw env values, or raw Google API responses.

## Fake Backend Client

Added `src/data/adapters/mock/driveBackendFakeClient.ts`.

The fake client:

- implements `DriveBackendClient`
- reuses the TASK-94 `driveFileMockRepository`
- maps `DriveFileSummary` into `DriveBackendFileSummary`
- returns `mock_backend_client_used` diagnostics
- keeps archived files excluded by default
- keeps excluded files blocked from the default list
- does not call `fetch`
- does not create or call any real `/api/drive/*` route

The current file hub UI still uses:

```text
FilesPanel -> useClientDriveFiles(clientId) -> driveFileRepository -> driveFileMockRepository
```

TASK-96 does not change the current UI runtime path.

## Actual Route/API Status

Not implemented:

- real `/api/drive/*` route files
- Google Drive API calls
- `googleapis` dependency
- OAuth flow
- service account flow
- token handling
- credential path handling
- Supabase Drive metadata activation
- embedding/vector/RAG answer flow
- chatbot UI

## Security Boundary

TASK-96 keeps the same security boundary as TASK-95:

- no Google credential in frontend code
- no `VITE_` Google credential env
- no `.env.local` read or output
- no service role key usage
- no raw token, secret, or credential path in contract responses
- no real Drive URL in fake metadata

## Test Scope

Added tests for:

- contract response shape
- active-only default fake backend list
- archived file inclusion only with explicit opt-in
- excluded file blocking
- safe error diagnostics
- no credential/env/token text in serialized responses
- fake backend client not calling `fetch`

## Next TASK

TASK-97 should decide whether to add a server route request/response validator and route handler test harness without implementing the real Google Drive API adapter.
