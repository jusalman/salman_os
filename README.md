# SALMAN OS

SALMAN OS is an internal staff operations center for connecting client files, tasks, schedules, business money, links, and logs in one workspace.

It does not replace Google Sheets, Google Drive, or Google Calendar. v1 keeps Google Drive as the original file storage and uses SALMAN OS as the operating context layer.

## Current Scope

Included in the current v1 baseline:

- internal staff login flow
- client operations dashboard
- mock-first client workspace data
- Supabase browser client foundation
- Drive-style file hub using sanitized mock metadata
- shared Drive backend contract, fake backend client, pure validator, and fake handler harness
- minimal mock `/api/drive/*` route boundary backed by the existing fake handler
- server-owned Drive adapter interface with a fake adapter default
- inactive service-account-first Drive adapter config boundary for future server-only work
- server-only `googleapis` client factory and local smoke gate command

Not implemented:

- actual Google Drive API integration
- frontend runtime `fetch('/api/drive/*')` wiring
- embedding/vector/RAG answer flow
- chatbot UI
- Google Calendar integration
- Playwright automation

## Local Development

```text
npm.cmd run dev
```

Default local runtime should work with mock data and should not require `.env.local`.

## Verification

Run these before handing off or deploying:

```text
node --test
npm.cmd run lint
npm.cmd run build
git status --short
```

The expected production build output is `dist`.

## Drive Local Smoke Gate

`googleapis` is installed only for server-owned Drive work. The smoke gate checks required setting names without running a Drive API request:

```text
npm.cmd run drive:smoke:gate
```

After explicit approval, the local-only list smoke command is:

```text
npm.cmd run drive:smoke:list
```

Do not run the list smoke without approval. It must print only a sanitized summary and must not print credential paths, token values, private keys, file IDs, file names, or `.env.local` contents.

## Environment Boundary

Allowed frontend `VITE_` values:

- `VITE_DATA_SOURCE`
- `VITE_SUPABASE_READ_ACTIVATION`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_ENV`

Forbidden in frontend env or committed files:

- `VITE_GOOGLE_*`
- `VITE_DRIVE_*`
- credential, token, secret, service account, or private key values
- Supabase service role key
- Google service account JSON
- local credential paths
- `.env.local` contents

Do not print credential, token, secret, or `.env.local` contents in logs, docs, tests, or commit messages.

## Deployment Baseline

Current deployment baseline:

- app type: Vite frontend-only
- build command: `npm.cmd run build`
- output directory: `dist`
- no committed `vercel.json`
- committed `api/drive/*` files are mock-only route boundary adapters
- no committed `server/`, `src/api/`, or `src/server` route source

The current mock `/api/drive/*` files use only the shared Drive contract, request validator, response safety checker, and fake handler. A server-only Google Drive client factory exists, but actual Google Drive API routes and frontend runtime activation still require separate approved tasks.

Actual Google Drive adapter work is service-account-first but still inactive. It remains blocked by the readiness checklist, package gate, and env/secret review gate in [TASK-100 deployment baseline](docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md).

## Reference Docs

- [Handoff](docs/HANDOFF.md)
- [TASK-100 deployment baseline](docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md)
- [TASK-99 route baseline and test convention](docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md)
- [TASK-98 Drive mock route decision](docs/TASK_98_DRIVE_MOCK_ROUTE_DECISION.md)
