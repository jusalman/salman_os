# TASK-95 Drive Backend Route Boundary Decision

## Purpose

TASK-95 decides where future Google Drive repository calls must live before any actual Google Drive API work starts.

This is a decision document only. It does not add backend routes, Google packages, credentials, OAuth, service account handling, Supabase schema changes, RAG, embeddings, vectors, or chatbot UI.

## Current TASK-94 Structure

TASK-94 introduced the current frontend mock repository path:

```text
FilesPanel
  |
useClientDriveFiles(clientId)
  |
driveFileRepository
  |
driveFileMockRepository
  |
sanitized mock Drive metadata
```

The current app remains Vite frontend-only:

- `package.json` has `dev`, `build`, `lint`, and `preview` only.
- There is no committed `api/`, `server/`, or `src/server/` route source.
- `vite.config.ts` only configures React.
- `.vercel/` exists locally, but no Vercel API route code exists in the repo.

## Candidate Review

| Option | Fit | Risk / Cost | Decision |
| --- | --- | --- | --- |
| A. Keep mock only inside Vite frontend | Good for v1 mock UI | Cannot host real Google credentials or tokens safely | Keep for v1 mock only |
| B. Local/server-only script or Node backend | Good for local experiments | Not a user-facing app route; deployment shape unclear | Defer |
| C. Vercel serverless API route | Best fit for current likely deployment and minimal backend surface | Needs route contract and auth checks before real API | Choose as future actual boundary |
| D. Supabase Edge Function | Server-side secrets possible | Adds Deno/Supabase operational coupling; file upload and Drive SDK flow are less natural | Do not choose now |
| E. Separate internal backend service | Strong long-term isolation | Too heavy for SALMAN OS v1 stage | Defer until scale requires it |
| F. Interface only, no backend yet | Safest immediately | Does not by itself decide actual runtime location | Use as next implementation step before C |

## Final Decision

The future actual Google Drive adapter must live behind a server-owned route boundary, with Vercel serverless API routes as the selected target boundary for the current SALMAN OS stage.

Target route shape:

```text
GET  /api/drive/clients/:clientId/files
GET  /api/drive/clients/:clientId/categories
GET  /api/drive/clients/:clientId/files/:fileId
POST /api/drive/clients/:clientId/sync
POST /api/drive/files/:fileId/archive
```

The frontend must call a sanitized SALMAN OS Drive API client. The frontend must not import Google SDKs, read Google env values, hold service account paths, hold OAuth tokens, or receive raw credential material.

## Why Not Frontend Google Drive API

Google Drive access cannot be placed in the Vite browser bundle because:

- `VITE_` values are browser-exposed.
- OAuth access tokens, refresh tokens, service account JSON, private keys, and local credential paths must not be available to browser JavaScript.
- Drive write operations require server-side permission checks and audit logging.
- Raw Google file IDs are not always secrets, but they should still be minimized and sanitized in responses.
- Upload/sync/archive flows need consistent error mapping and retry behavior outside the UI.

## Credential And Env Rules

Allowed later, server-only:

- deployment-platform secret storage
- server-only Google OAuth client config
- server-only service account config
- server-only refresh token storage if OAuth is selected

Forbidden:

- `VITE_GOOGLE_*`
- `VITE_DRIVE_*`
- `VITE_*CREDENTIAL*`
- `VITE_*TOKEN*`
- service account JSON in `src`, `public`, docs, or committed files
- credential paths or token paths in frontend code
- printing `.env.local` contents
- returning access tokens or credential metadata from API responses

## v1 Implementation Order

1. Keep TASK-94 `driveFileMockRepository` as the runtime default.
2. Add a shared server boundary contract and fake backend Drive client in a later task.
3. Convert `useClientDriveFiles` to call the fake backend client while preserving current UI behavior.
4. Add Vercel-style `/api/drive/*` mock routes only after the contract is stable.
5. Add auth/role checks and sanitized error model before real Drive API.
6. Add read-only actual Google Drive adapter behind the server route only after separate approval.
7. Add write actions such as upload/archive only after read-only sync is stable.

## Testing Direction

Before actual Drive API:

- unit-test request/response mappers
- test fake backend client behavior
- test that frontend receives sanitized metadata only
- test that no `VITE_` Google credential env is required
- test route error codes without real Google calls

Forbidden tests:

- tests requiring real Google Drive API
- tests requiring `.env.local`
- tests reading credential/token files
- tests executing Supabase schema or RLS changes

## Next Task

TASK-96 should add a shared Drive backend route contract and fake backend client while keeping the current mock repository as the source of sanitized metadata. It should not add actual Vercel routes, Google API packages, credentials, OAuth, Supabase Drive metadata activation, embeddings, vectors, or chatbot UI.
