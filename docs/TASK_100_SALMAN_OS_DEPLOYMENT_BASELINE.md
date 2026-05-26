# TASK-100 SALMAN OS Deployment Baseline

## Purpose

TASK-100 decides whether SALMAN OS needs a deployment baseline document before any server route or Google Drive API work starts.

Decision: create a dedicated deployment baseline document now. At TASK-100 time, the repo still stayed Vite frontend-only, and no deployment settings, route files, Google Drive API code, credentials, Supabase schema, or UI behavior were changed.

TASK-105 update: the repo later added minimal mock `api/drive/*` route boundary adapters. They are not Google Drive API integrations, do not read credentials or env secrets, and are not wired into the default frontend runtime.

TASK-107 update: actual Google Drive adapter work is blocked behind the readiness checklist and env/secret review gate in this document. This update does not add Google Drive API code, `googleapis`, OAuth, service account handling, env reads, `.env.example` Google entries, Supabase schema changes, or frontend runtime activation.

## Current Deployment Structure

Current committed structure:

- App type: Vite React frontend
- Build command: `npm.cmd run build`
- Build output: `dist`
- Local dev command: `npm.cmd run dev`
- Preview command: `npm.cmd run preview`
- Test command: `node --test`
- Lint command: `npm.cmd run lint`
- `vite.config.ts`: React plugin only
- `vercel.json`: not present
- `api/`: present only for mock Drive route boundary adapters added in TASK-105
- `server/`: not present
- `src/api/`: not present
- `src/server/`: not present

The app currently uses browser-side Vite env rules and mock-first runtime behavior.

## Local, Preview, And Production Baseline

### Local Development

Use local development for UI and mock repository work:

```text
npm.cmd run dev
```

Current local Drive behavior:

```text
FilesPanel -> useClientDriveFiles(clientId) -> driveFileRepository -> driveFileMockRepository
```

Do not require `.env.local` for default local mock runtime.

### Preview Build

Use the production build before preview:

```text
npm.cmd run build
npm.cmd run preview
```

Preview must not depend on Google credentials, service account JSON, OAuth tokens, or Drive API connectivity.

### Production Deployment

For the current frontend-only baseline, production deployment should use:

```text
Build command: npm.cmd run build
Output directory: dist
Install command: npm install
```

No actual Google Drive API route or server secret dependency is part of the current production baseline.

## Required Verification Before Deployment

Run these before marking a deployment-ready change:

```text
node --test
npm.cmd run lint
npm.cmd run build
git status --short
```

The working tree should be clean after the deployment-ready commit.

## Vercel Deployment Baseline

Vercel is the preferred future deployment target for server-owned Drive routes, but the current repo does not yet commit `vercel.json` or any real Google Drive API route implementation.

Current Vercel baseline:

- deploy as a Vite static frontend
- build output is `dist`
- mock `api/drive/*` route boundary adapters may exist but must call only the fake handler until a separate actual API task
- do not wire frontend `fetch('/api/drive/*')` until a separate runtime activation task

Future server routes must not be introduced in the same task as a real Google Drive adapter.

## Allowed Frontend Env

Allowed Vite frontend env values:

- `VITE_DATA_SOURCE`
- `VITE_SUPABASE_READ_ACTIVATION`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_ENV`

Rules:

- `VITE_SUPABASE_ANON_KEY` may be used only as a public anon key.
- `VITE_SUPABASE_URL` may be used only as the public Supabase project URL.
- Invalid or missing runtime data source values must keep the mock-first fallback behavior unless a separate activation task says otherwise.

## Forbidden Env And Secret Values

Never put these in Vite frontend env:

- `VITE_GOOGLE_*`
- `VITE_DRIVE_*`
- `VITE_*CREDENTIAL*`
- `VITE_*TOKEN*`
- `VITE_*SECRET*`
- `VITE_*SERVICE_ACCOUNT*`
- `VITE_*PRIVATE_KEY*`
- Supabase service role key
- Google service account JSON
- OAuth refresh token
- local credential path
- private key material

Never commit or print:

- `.env.local`
- credential files
- token files
- service account JSON
- private keys
- deployment secret values

## Secret And Credential Boundary

Current frontend-only baseline:

- no server secrets are required
- no Google Drive credentials are allowed
- no service role key is allowed
- no Google Drive SDK is allowed in the browser bundle

Future server route baseline:

- server-only secrets may be used only after explicit approval
- server routes must not return credential paths, raw env values, tokens, service account metadata, or raw Google API responses
- route responses must satisfy the shared Drive backend contract and safety checks

## Future Actual `/api` Route Add Conditions

Do not replace or extend the mock `api/drive/*` boundary with actual Google Drive API behavior until:

- deployment target is confirmed as Vercel for SALMAN OS
- route folder convention remains approved for the target deployment
- route handler tests are defined
- request validators and response safety checks are required by convention
- server-only env names are reviewed
- default UI runtime remains on mock repository or a separate activation gate is approved
- actual Google Drive API integration is kept in a later, separate task

## Actual Drive Adapter Readiness Checklist

Do not add an actual Google Drive adapter until all of these are true:

- the adapter is implemented only behind `DriveServerAdapter`
- `api/drive/*` route files continue to call `handleDriveServerRoute()`
- request validation runs before any adapter call
- response safety checks run after every adapter response
- the default adapter remains `driveBackendFakeClient` until a separate activation task
- frontend UI still does not call `fetch('/api/drive/*')` by default
- `googleapis` package addition is reviewed in the same task that needs it, not before
- the chosen auth mode is reviewed before implementation
- local development and Vercel deployment secret handling are documented for that auth mode
- route tests cover adapter injection, invalid request blocking, unsafe response blocking, archived default exclusion, and no frontend secret exposure
- raw Google Drive API responses are mapped into the shared Drive backend contract before returning
- returned `sourceUrl` or `openUrl` values are either omitted, sanitized placeholders, or explicitly approved safe open links
- no `excluded` file metadata is returned
- no credential path, token metadata, service account metadata, raw env value, private key material, or Drive SDK response object is returned

## Env And Secret Review Gate

Current decision:

- do not choose service account or OAuth yet
- do not add Google Drive env names to `.env.example` yet
- do not read `.env.local` or any credential file during readiness work
- do not add `VITE_GOOGLE_*`, `VITE_DRIVE_*`, or any Vite credential/token/secret env
- keep all future Google Drive secrets server-only and deployment-platform owned

Auth modes to review later:

- service account: likely simpler for organization-owned shared Drive folders, but must prove folder access, least privilege, key rotation, and no private key exposure
- OAuth refresh token: may match user-owned Drive data better, but must prove consent ownership, refresh token storage, revocation, and rotation

Server-only env name candidates for a later approved implementation task:

- `GOOGLE_DRIVE_AUTH_MODE`
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_DRIVE_CLIENT_ID`
- `GOOGLE_DRIVE_CLIENT_SECRET`
- `GOOGLE_DRIVE_REFRESH_TOKEN`

These names are candidates only. They must not be added to `.env.example`, Vite env, docs with real values, tests with real values, or committed files before the actual adapter task is approved.

## Rollback Baseline

Rollback should be used when:

- `node --test`, `npm.cmd run lint`, or `npm.cmd run build` fails after a deployment change
- a frontend bundle requires a forbidden env value
- a route change returns unsafe Drive metadata
- a deployment needs `.env.local` or local credential files to work
- the mock-first default runtime is broken

Rollback target:

- revert to the last commit that passed `node --test`, `npm.cmd run lint`, and `npm.cmd run build`
- keep `.env.local` and credentials out of rollback notes and logs

## Next TASK

TASK-101 should decide whether to replace the default Vite README deployment text with a SALMAN OS-specific README section, without adding routes, Google Drive API integration, credential handling, or UI changes.
