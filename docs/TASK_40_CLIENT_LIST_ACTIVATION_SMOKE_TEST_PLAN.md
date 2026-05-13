# TASK-40 ClientList Activation Smoke Test Plan

## Plan

TASK-40 documents the approved smoke test procedure for Supabase `ClientListRepository` activation.

This task does not activate Supabase, does not create `.env.local`, does not enter real URL/key values, does not execute SQL, and does not change runtime behavior.

The smoke test target is narrow:

- Test ClientList Supabase reads only.
- Keep ClientDetail and SmartViews in strict placeholder mode.
- Do not treat the full workspace as ready for real data.

## Files Reviewed

- `src/data/repositories/currentRepositories.ts`
- `src/data/repositories/repositorySelection.ts`
- `src/data/adapters/supabase/clientListRepository.ts`
- `src/data/adapters/supabase/notImplementedRepositories.ts`
- `.env.example`
- `src/App.tsx`

## Risk Check

| Risk | Impact | Smoke test rule |
| --- | --- | --- |
| Real env values could be committed. | Secrets or project URLs could leak. | Values are entered only in local uncommitted env after approval. Do not write values in docs. |
| service role key exposure. | Full DB access could be exposed to the browser. | Never use `SUPABASE_SERVICE_ROLE_KEY` in frontend env. Use anon key only. |
| RLS/anon read denial. | ClientList query fails even with valid env. | Confirm anon read access or approved RLS state before the smoke test. |
| Strict placeholder UX blocks full workspace. | ClientList success can be followed by SmartViews/Detail placeholder errors. | Smoke test result is limited to ClientList load behavior. |
| Silent fallback hides query failures. | Schema/RLS/data problems could be missed. | Supabase activation failure must surface in the existing error state. No silent mock fallback. |
| Partial data due to missing child rows. | Summary flags/counts may be wrong or empty. | Seed/check minimum rows before test. Missing child rows are allowed only if intentionally testing empty/default summaries. |

## Activation Gate Under Test

The activation gate is already implemented but remains off by default.

Required local env shape for an approved smoke test:

```text
VITE_DATA_SOURCE=supabase
VITE_SUPABASE_READ_ACTIVATION=client_list
VITE_SUPABASE_URL=<local uncommitted value>
VITE_SUPABASE_ANON_KEY=<local uncommitted value>
```

Rules:

- `VITE_DATA_SOURCE=supabase` alone must not activate real reads.
- `VITE_SUPABASE_READ_ACTIVATION=client_list` alone must not activate real reads.
- URL and anon key must both be present.
- ClientDetail and SmartViews remain strict placeholders.
- The default rollback value is `VITE_DATA_SOURCE=mock`.

## Pre-Smoke Checklist

Before running the smoke test, confirm:

- User explicitly approves the smoke test task.
- No real env value is written to tracked files.
- `.env.local` creation or editing is explicitly approved for that task.
- `.env.local` is ignored by git.
- Frontend env uses only:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- No `SUPABASE_SERVICE_ROLE_KEY` is used or referenced in frontend env.
- Supabase project has the 8 core tables:
  - `clients`
  - `client_members`
  - `client_tasks`
  - `client_events`
  - `client_files`
  - `client_money_items`
  - `client_links`
  - `operation_logs`
- Anon read/RLS state permits select access for the ClientList query tables.
- Local verification passes before activation:

```powershell
node --test tests\supabase\activationGate.test.ts
node --test tests\mock\clientSummaryProjection.test.ts
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts tests\supabase\clientListRepository.test.ts
npm.cmd run lint
npm.cmd run build
```

## Minimum Seed/Data Requirements

For a meaningful ClientList smoke test, the Supabase project should have at least:

| Table | Minimum rows | Notes |
| --- | --- | --- |
| `clients` | 1 | Required. Include `id`, `name`, `status`, `owner_name`, `updated_at`. |
| `client_members` | 0 or 1 | Optional. Primary active member overrides `owner_name` if present. |
| `client_tasks` | 0 or more | Used for `openTaskCount`. |
| `client_events` | 0 or more | Used for `upcomingEventCount`; scheduled events before reference date are excluded. |
| `client_files` | 0 or more | Used for Drive folder flag. |
| `client_money_items` | 0 or more | Used for Biz Money warning flag. |
| `client_links` | 0 or more | Used for Looker/Sheet flags. |
| `operation_logs` | 0 or more | Used for `latestLogAt`. |

No SQL should be executed by Codex in this smoke test plan. If data setup is needed, it must be separately approved and performed by the user or a later explicit task.

## Smoke Test Procedure

After explicit approval only:

1. Confirm current working tree status.
2. Confirm `.env.local` is untracked and ignored.
3. Add local-only values:
   - `VITE_DATA_SOURCE=supabase`
   - `VITE_SUPABASE_READ_ACTIVATION=client_list`
   - `VITE_SUPABASE_URL=<approved local value>`
   - `VITE_SUPABASE_ANON_KEY=<approved local value>`
4. Start the dev server.
5. Log in with the v1 internal login flow.
6. Observe the first ClientList load.
7. Expected ClientList success:
   - No mock fallback occurs.
   - Client list loads from Supabase rows.
   - Empty Supabase `clients` table shows the existing `No clients found` state.
8. Expected strict placeholder behavior after ClientList:
   - SmartViews may show the placeholder error because SmartViews is not activated.
   - Selected client detail may show the placeholder error because ClientDetail is not activated.
   - This is expected for TASK-40 smoke scope and is not a full app readiness failure.
9. If ClientList query fails:
   - Existing `Client data unavailable` error state should show the Supabase/missing config/query error.
   - Do not silently switch to mock in the same run.
10. Stop the dev server.
11. Roll back env to mock or gate off.
12. Re-run basic verification.

## Strict Placeholder UX

Strict mode means:

- ClientList is the only real Supabase read candidate.
- ClientDetail remains `clientDetailSupabasePlaceholderRepository`.
- SmartViews remains `smartOperationViewsSupabasePlaceholderRepository`.
- Placeholder errors are expected if the app proceeds past list load and tries those repositories.
- The smoke test should record which state appears first:
  - ClientList error,
  - SmartViews placeholder error,
  - Selected client placeholder error,
  - or empty client list.

This smoke test validates the ClientList activation path, not the full workspace.

## Rollback Procedure

Preferred rollback:

```text
VITE_DATA_SOURCE=mock
VITE_SUPABASE_READ_ACTIVATION=off
```

Alternative rollback:

```text
VITE_DATA_SOURCE=supabase
VITE_SUPABASE_READ_ACTIVATION=off
```

Expected rollback behavior:

- `VITE_DATA_SOURCE=mock` restores the mock-first app.
- `VITE_DATA_SOURCE=supabase` with activation off restores placeholder behavior.
- No code changes are required for rollback.
- No committed file should contain real URL/key values.

## Post-Smoke Checklist

After a later approved smoke test:

- Confirm `git status --short` has no real env file tracked.
- Record whether ClientList loaded, errored, or returned empty.
- Record whether strict placeholder UX appeared after ClientList.
- Record any Supabase error message without copying secrets.
- Re-run:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Out Of Scope

- Creating `.env.local` in this task.
- Entering real Supabase URL or anon key.
- Using service role key.
- SQL execution or schema changes.
- Activating ClientDetail or SmartViews.
- Full real data app conversion.
- Ads, RAG, Drive API, Calendar API, OpenAI, Playwright, or customer portal features.

## Next Task

TASK-41 should be one of:

1. Approved ClientList activation smoke test execution, or
2. Plan/implement Supabase ClientDetail read adapter before any smoke test.

Recommended next step: run the approved ClientList smoke test only after the user confirms env handling and Supabase anon read access.
