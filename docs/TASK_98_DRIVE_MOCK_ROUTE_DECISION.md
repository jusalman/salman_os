# TASK-98 Drive Mock Route Decision

## Purpose

TASK-98 decides whether SALMAN OS should introduce Vercel-style `/api/drive/*` mock route files before implementing any actual Google Drive API adapter.

Decision: do not add real `/api/drive/*` route files yet. Keep the TASK-97 pure validator and fake route handler harness as the current route safety boundary.

## Current Structure Summary

The current app is still Vite frontend-only:

- `package.json` has `dev`, `build`, `lint`, and `preview` scripts only.
- `vite.config.ts` only configures React.
- There is no committed `api/`, `server/`, `src/api/`, or `src/server/` route source.
- `.vercel/` exists locally, but it is not a committed route implementation boundary.
- Drive file hub runtime remains on the TASK-94 repository path.

Current runtime path:

```text
FilesPanel -> useClientDriveFiles(clientId) -> driveFileRepository -> driveFileMockRepository
```

Current future-route preparation:

```text
Drive backend contract -> fake backend client -> pure validator -> fake route handler harness
```

## Mock Route Decision

Vercel-style `/api/drive/*` mock route files are deferred.

Reasons:

- The project does not currently have a committed Vercel API route structure.
- Vite dev/build does not make root `api/` route files meaningful by itself.
- Adding route files now would look more operational than they actually are.
- Route files could create confusion about whether `/api/drive/*` is already deployable or connected.
- TASK-97 already provides the useful part at this stage: pure request validation, response safety checks, and fake handler behavior tests.
- The default UI/runtime must remain on the mock repository path until a separate route activation task.

## If Routes Are Added Later

When deployment structure is confirmed, the likely route placement should be:

```text
api/drive/clients/[clientId]/files.ts
api/drive/clients/[clientId]/categories.ts
api/drive/clients/[clientId]/files/[fileId].ts
```

Those route files should:

- import the TASK-97 validators
- call a server-side Drive backend client
- run `checkDriveBackendResponseSafety`
- return the TASK-96 shared contract shape
- avoid raw Google responses
- avoid credential, token, service account, or env metadata in responses

The first route implementation should still use `driveBackendFakeClient`. The actual Google Drive adapter should remain a separate later task.

## Not Implemented

TASK-98 does not add:

- real `/api/drive/*` route files
- Vercel route handler code
- frontend `fetch('/api/drive/*')` wiring
- Google Drive API calls
- `googleapis`
- OAuth
- service account handling
- token handling
- credential/env reading
- Supabase Drive metadata schema activation
- embedding/vector/RAG answer flow
- chatbot UI

## Security Boundary

The active boundary remains:

- no Google credential in frontend code
- no `VITE_` Google credential env
- no `.env.local` read or output
- no service role key usage
- no raw token, secret, credential path, or env value in contract responses
- no real Drive URL in fake metadata
- no excluded file metadata in route-safe responses

## Next TASK

TASK-99 should decide the route activation prerequisites: whether SALMAN OS should first add a documented Vercel deployment baseline and route test convention before adding any real `api/drive/*` mock route files.
