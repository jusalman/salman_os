# TASK-38 Supabase Activation Gate Plan

## Plan

TASK-38 defines the safe activation gate for the Supabase `ClientListRepository`.

This task is documentation only. It does not activate Supabase in runtime, does not modify `currentRepositories.ts`, does not create real env values, does not execute SQL, and does not change UI behavior.

Current state:

- The app remains mock-first.
- `VITE_DATA_SOURCE=mock` uses mock repositories.
- `VITE_DATA_SOURCE=supabase` still uses placeholder repositories.
- The fake-tested Supabase `ClientListRepository` exists behind the placeholder boundary.
- Detail and Smart Operation Views Supabase repositories are still placeholders.

## Files Reviewed

- `src/data/repositories/currentRepositories.ts`
- `src/data/adapters/supabase/notImplementedRepositories.ts`
- `src/data/adapters/supabase/clientListRepository.ts`
- `src/data/adapters/supabase/clientRowsReader.ts`
- `src/data/adapters/supabase/supabaseClient.ts`
- `src/hooks/useClients.ts`

## Risk Check

| Risk | Why it matters | Gate decision |
| --- | --- | --- |
| `VITE_DATA_SOURCE=supabase` currently means all repositories use Supabase placeholders. | Turning this on directly would still break detail and Smart Views. | Do not use `VITE_DATA_SOURCE=supabase` alone as the activation signal. |
| ClientList can work before ClientDetail and SmartViews. | Partial activation can show list data while detail panels still need mock or placeholders. | First activation must be ClientList-only and explicitly gated. |
| Missing frontend Supabase config throws. | `requireSupabaseClient()` fails if URL or anon key are empty. | Gate must require `hasSupabaseBrowserConfig() === true` before selecting real ClientList. |
| Accidental production-like real data use. | v1 is internal and still read-first. | Gate should be explicit, named as experimental/read-only, and default off. |
| Query failure could leave users without mock data. | Network or RLS errors can happen during first activation. | Prefer fail-closed with visible error for true Supabase opt-in; optional manual mock fallback can be a separate mode. |
| service_role exposure. | Frontend must never contain service role keys. | Activation uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; never document or reference service role in frontend env. |

## Activation Gate Design

Recommended gate variables for a later activation task:

| Env value | Allowed values | Meaning |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `mock`, `supabase` | Existing broad data source selector. Default remains `mock`. |
| `VITE_SUPABASE_READ_ACTIVATION` | `off`, `client_list` | New explicit read activation gate. Default `off`. |
| `VITE_SUPABASE_URL` | non-empty URL | Required only when `VITE_SUPABASE_READ_ACTIVATION=client_list`. |
| `VITE_SUPABASE_ANON_KEY` | non-empty anon key | Required only when `VITE_SUPABASE_READ_ACTIVATION=client_list`. |

Recommended selection rules:

1. Missing or invalid `VITE_DATA_SOURCE` falls back to mock.
2. `VITE_DATA_SOURCE=mock` always uses mock repositories.
3. `VITE_DATA_SOURCE=supabase` with `VITE_SUPABASE_READ_ACTIVATION=off` keeps the current placeholder repositories.
4. `VITE_DATA_SOURCE=supabase` with `VITE_SUPABASE_READ_ACTIVATION=client_list` and valid browser config selects:
   - `clientListRepository`: Supabase read repository.
   - `clientDetailRepository`: placeholder or mock, to be explicitly decided before activation.
   - `smartOperationViewsRepository`: placeholder or mock, to be explicitly decided before activation.
5. `VITE_SUPABASE_READ_ACTIVATION=client_list` without valid browser config should fail the ClientList load with the existing missing config error, not silently use partial real data.

Recommended first runtime strategy:

- Do not switch the entire app to Supabase.
- Either:
  - ClientList Supabase + Detail/SmartViews mock for a controlled hybrid read test, or
  - ClientList Supabase + Detail/SmartViews placeholders for a strict activation smoke test.

The hybrid option is more usable for internal review, but it can show a real list with mock detail data. If used, the UI should clearly remain an internal test mode in a later task.

## Fallback Strategy

Default fallback:

- Mock remains the default and safest fallback.
- Invalid `VITE_DATA_SOURCE` values continue to resolve to mock.
- `VITE_SUPABASE_READ_ACTIVATION=off` keeps Supabase placeholder behavior.

Runtime error handling:

- If ClientList Supabase is explicitly activated and a query fails, `useClients()` already surfaces the error through the existing loading/error state.
- Do not silently fall back to mock after a Supabase query error in the first activation task. Silent fallback can hide schema, RLS, or data quality issues.
- If manual fallback is needed, the operator should change env back to `VITE_DATA_SOURCE=mock` or turn the activation gate off.

Optional future fallback mode:

- A later task may add `VITE_SUPABASE_FALLBACK=mock_on_error`.
- That should require explicit approval because it can mask real data failures.

## Loading, Error, And Empty State Rules

Existing state handling should remain:

| State | Current owner | Activation rule |
| --- | --- | --- |
| Loading | `useClients()` and `App.tsx` | Keep unchanged. Supabase reads use the same hook path. |
| Error | `useClients()` and `getLoadErrorMessage()` | Keep unchanged. Surface Supabase or missing config errors clearly. |
| Empty | `App.tsx` client list empty state | Keep unchanged. Empty Supabase client rows should show `No clients found`. |
| Detail missing | `useSelectedClient()` and `App.tsx` | Do not activate real detail reads until a separate task. |
| Smart Views missing | `useSmartViews()` and `App.tsx` | Do not activate real Smart Views reads until a separate task. |

## Pre-Activation Checklist

Before any task changes runtime selection:

- Confirm `currentRepositories.ts` activation design in review before editing.
- Confirm whether Detail and SmartViews remain mock or placeholder during ClientList-only activation.
- Confirm `.env.example` documents only placeholder names, not real values.
- Confirm real `.env.local` values are entered manually by the user only after approval and are not committed.
- Confirm only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used in frontend.
- Confirm no `SUPABASE_SERVICE_ROLE_KEY` is referenced in frontend code.
- Confirm Supabase anon/RLS policy allows read access to required tables, or confirm RLS is intentionally off for the approved test project.
- Confirm the 8 tables exist:
  - `clients`
  - `client_members`
  - `client_tasks`
  - `client_events`
  - `client_files`
  - `client_money_items`
  - `client_links`
  - `operation_logs`
- Confirm row reader tests, assembler tests, mapper tests, lint, and build pass.
- Confirm manual rollback path: set `VITE_DATA_SOURCE=mock` or `VITE_SUPABASE_READ_ACTIVATION=off`.

## Test Plan For Activation Task

Unit tests:

- `resolveDataSource()` behavior remains mock-first.
- Invalid data source falls back to mock.
- `VITE_DATA_SOURCE=supabase` plus activation `off` selects placeholders.
- `VITE_DATA_SOURCE=supabase` plus activation `client_list` selects the real ClientList repository only when config is valid.
- Missing config with activation `client_list` fails clearly.
- Detail and SmartViews selection matches the approved hybrid/strict strategy.

Existing tests to keep running:

```powershell
node --test tests\mock\clientSummaryProjection.test.ts
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts tests\supabase\clientListRepository.test.ts
npm.cmd run lint
npm.cmd run build
```

Manual smoke checks for a later approved activation task:

- Default env loads mock data.
- Invalid `VITE_DATA_SOURCE` loads mock data.
- `VITE_DATA_SOURCE=supabase` with activation off shows the existing placeholder behavior.
- Approved ClientList activation with valid config loads the client list.
- Removing config returns a clear missing config error.
- Switching back to mock restores mock list behavior.

## Out Of Scope

- Real Supabase URL or key entry.
- `.env.local` creation.
- SQL execution.
- DB schema changes.
- Activating Supabase in runtime.
- Detail or SmartViews real Supabase repositories.
- Google Drive, Calendar, Ads, RAG, OpenAI, Playwright, or customer portal features.

## Next Task

TASK-39 should either:

1. Implement the activation gate in `currentRepositories.ts` with tests but keep default behavior mock-first, or
2. Plan the ClientDetail Supabase read adapter before any runtime activation.

Recommended next step: implement the activation gate with tests, still defaulting to mock and requiring explicit opt-in.
