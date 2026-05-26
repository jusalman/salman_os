# TASK-99 Vercel Route Baseline and Test Convention

## Purpose

TASK-99 decides the deployment baseline and future API route test convention before SALMAN OS adds any real Drive API route files.

Decision: document the Vercel route baseline first and defer real Google Drive API-backed `/api/drive/*` route files. At TASK-99 time, the current boundary remained the TASK-96 shared contract, TASK-96 fake backend client, and TASK-97 pure validator plus fake route handler harness.

TASK-105 update: minimal mock `api/drive/*` route boundary files were later added after the validator, response safety checker, and route import tests were in place. They still call only the fake handler harness and do not introduce Google Drive API calls, credentials, `googleapis`, frontend fetch wiring, or runtime activation.

## Current Repo Deployment Structure

The repo is currently a Vite frontend app:

- `package.json` scripts are `dev`, `build`, `lint`, and `preview`.
- `vite.config.ts` only configures React.
- There is no committed `vercel.json`.
- TASK-105 added mock-only `api/drive/*` route boundary adapters.
- There is no committed `server/`, `src/api/`, or `src/server/` route source.
- `.vercel/` exists locally, but local Vercel metadata is not a committed deployment baseline.
- `README.md` is still the default React + TypeScript + Vite template text.

Current Drive runtime remains:

```text
FilesPanel -> useClientDriveFiles(clientId) -> driveFileRepository -> driveFileMockRepository
```

Future-route preparation remains:

```text
Drive backend contract -> fake backend client -> pure validator -> fake route handler harness
```

## Vite Frontend vs Future Vercel API Boundary

Vite frontend:

- builds the browser bundle
- may use public `VITE_` values only
- must not contain Google credentials, tokens, service account JSON, private keys, raw credential paths, or Google Drive SDK calls
- must not call `/api/drive/*` by default until a separate activation task

Future Vercel API route:

- runs server-side
- may read server-owned deployment secrets only after a separate approved task
- must use the shared Drive backend contract
- must run request validation and response safety checks
- must not return raw Google responses, credentials, token metadata, service account metadata, or raw env values

## Why Real Google Drive Route Files Were Not Added At TASK-99

Real Google Drive API-backed route files were deferred because:

- Vite local dev/build does not execute root `api/` files by itself
- TASK-97 already gives testable handler behavior without adding deployment-specific files
- the Drive file hub UI must remain on the mock repository path until explicit runtime activation

TASK-105 resolved only the mock route boundary step. Actual Google Drive route behavior, server secret usage, and frontend fetch wiring are still deferred.

## Future `/api/drive/*` Route Add Conditions

Do not add real Google Drive API-backed route files until all of these are true:

- deployment target is explicitly confirmed as Vercel for SALMAN OS
- route folder convention is approved as committed repo structure
- route handler test convention is in place
- route response contract is already covered by tests
- request validator and response safety checker are used by the route
- default frontend runtime remains unchanged or a separate activation gate is approved
- no real Google API adapter is introduced in the same task

Likely future route placement:

```text
api/drive/clients/[clientId]/files.ts
api/drive/clients/[clientId]/categories.ts
api/drive/clients/[clientId]/files/[fileId].ts
```

Keep `serverless/functions/*` and a separate backend repo deferred unless the deployment target changes.

## Route Handler Test Convention

Before actual Google Drive API-backed route files exist:

- keep Drive route behavior tests in `tests/drive`
- test pure functions only
- use `handleDriveRouteHarness` for handler-style input/output
- do not require Vercel runtime packages
- do not require `.env.local`
- do not call `fetch('/api/drive/*')`
- do not call Google Drive APIs

When mock route boundary files are introduced:

- keep contract, validator, and fake handler tests in `tests/drive`
- add route adapter tests in `tests/api` only if route handler functions can be imported without starting a server
- keep deployment-specific smoke tests separate from unit tests
- route tests must assert that unsafe response content is rejected or sanitized
- route tests must not read credential files or env secret contents

When actual Google Drive API-backed route files are introduced, keep that work separate from mock route boundary files and frontend runtime activation.

## Env and Secret Boundary

Allowed later, server-only:

- `GOOGLE_DRIVE_CLIENT_ID`
- `GOOGLE_DRIVE_CLIENT_SECRET`
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_DRIVE_REFRESH_TOKEN`
- deployment-platform secret values

Forbidden:

- `VITE_GOOGLE_*`
- `VITE_DRIVE_*`
- `VITE_*CREDENTIAL*`
- `VITE_*TOKEN*`
- `VITE_*SECRET*`
- service account JSON in `src`, `public`, docs, or committed files
- printing `.env.local`
- returning secret, token, credential path, or service account metadata from route responses

## Local Dev and Test Baseline

Current local development:

- use `npm.cmd run dev` for the Vite app
- Drive UI uses mock repository data
- Drive route behavior is tested through pure Node tests

Future actual route local testing should be decided before Google Drive API-backed route behavior is added:

- either Vercel local dev is adopted and documented
- or route handlers remain importable pure functions with Node tests

Until that decision, the committed route files must stay mock-only.

## Next TASK

TASK-100 should decide whether to write a deployment baseline document for SALMAN OS itself, replacing the default Vite README deployment ambiguity, without adding API routes or Google Drive integration.
