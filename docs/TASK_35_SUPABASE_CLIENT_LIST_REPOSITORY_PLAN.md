# TASK-35 Supabase ClientListRepository Plan

## Plan

TASK-35 plans the first Supabase-backed `ClientListRepository` adapter for SALMAN OS.

This task is planning only. It does not connect the app to real Supabase data, does not activate `VITE_DATA_SOURCE=supabase`, does not create real env values, does not execute SQL, and does not change UI behavior.

The current runtime remains mock-first:

- `VITE_DATA_SOURCE=mock` uses mock repositories.
- `VITE_DATA_SOURCE=supabase` still resolves to placeholder repositories.
- Invalid or missing data source values fall back to mock.

## Files Reviewed

- `src/data/repositories/clientListRepository.ts`
- `src/data/repositories/currentRepositories.ts`
- `src/data/adapters/mock/clientListMockRepository.ts`
- `src/data/projections/clientSummary.ts`
- `src/hooks/useClients.ts`
- `src/data/adapters/supabase/notImplementedRepositories.ts`
- `src/data/adapters/supabase/clientRowsReadAdapter.ts`
- `src/data/adapters/supabase/supabaseClient.ts`
- `src/data/adapters/supabase/clientSummaryAssembler.ts`
- `tests/supabase/clientSummaryAssembler.test.ts`
- `docs/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md`
- `docs/SUPABASE_READ_ADAPTER_MAPPING.md`

## Risk Check

Implementation risks before TASK-36:

| Risk | Impact | Decision |
| --- | --- | --- |
| Real data activation too early | `VITE_DATA_SOURCE=supabase` could start making live queries and break local/mock-first use. | Keep `currentRepositories.ts` pointed at placeholder repositories until a separate activation task. |
| Missing Supabase env values | `requireSupabaseClient()` throws when URL/anon key are absent. | Repository implementation can exist, but should not be selected by default. Tests should mock row readers, not real env. |
| Over-fetching child rows | ClientSummary requires rows from 8 tables. | First adapter can fetch child rows for returned client IDs and assemble in TypeScript; DB view/RPC can wait. |
| `upcomingEventCount` mismatch | Mock projection counts all scheduled events; Supabase assembler counts today/future scheduled events. | Recommend aligning mock projection later to today/future scheduled, with explicit snapshot/test review. Do not change in TASK-35. |
| Date source ambiguity | Summary assembly needs a reference date. | Inject `referenceDate` into repository factory or helper; do not call time directly inside row assembly. |
| Owner source ambiguity | Owner can come from `client_members` or `clients.owner_name`. | Use primary active member when available; fallback to `clients.owner_name`. |
| Multi-query partial failure | One child table query failure could produce misleading partial summaries. | Fail the repository call clearly; do not return partial ClientSummary rows. |

Confirmation questions for implementation:

1. Should TASK-36 expose the real Supabase repository only as an exported object, or add a second internal repository set that is not selected yet?
2. Should mock `upcomingEventCount` be aligned in TASK-36, or kept as-is until a dedicated mock parity task?
3. Should TASK-36 use separate table queries first, or introduce a Supabase view/RPC plan before coding?

## Repository Boundary Design

Existing contract:

```ts
export type ClientListRepository = {
  listClientSummaries: () => Promise<ClientSummary[]>
}
```

The first Supabase adapter should implement the same contract:

```ts
export const clientListSupabaseReadRepository: ClientListRepository = {
  async listClientSummaries() {
    // Fetch Supabase-shaped rows.
    // Group child rows by client_id.
    // Call assembleClientSummaryFromRows() per client.
    // Return ClientSummary[].
  },
}
```

Boundary rules:

- UI and hooks continue to depend only on `ClientListRepository`.
- The adapter returns `ClientSummary[]`, never raw DB rows.
- `clientSummaryAssembler.ts` remains the pure row-to-read-model boundary.
- Supabase query functions stay in adapter files, not in hooks or components.
- `currentRepositories.ts` should keep using `clientListSupabasePlaceholderRepository` in TASK-36 unless the user explicitly asks for activation.
- If a real repository is exported in TASK-36, it should be unused by runtime selection until a later activation task.

Recommended TASK-36 file shape:

| File | Responsibility |
| --- | --- |
| `src/data/adapters/supabase/clientListSupabaseRepository.ts` | Implements `ClientListRepository` using row readers plus assembler. |
| `src/data/adapters/supabase/clientSummaryRowReaders.ts` | Optional row reader helpers for each table. |
| `tests/supabase/clientListSupabaseRepository.test.ts` | Tests repository behavior with fake row readers, not real Supabase. |

Keep existing files stable:

- `src/data/repositories/currentRepositories.ts` remains placeholder-selected for `supabase`.
- `src/data/adapters/supabase/notImplementedRepositories.ts` remains the runtime placeholder boundary.

## Data Flow

Planned data flow:

1. Read client rows from `clients`, ordered by `updated_at desc`.
2. Extract client IDs.
3. Read child rows filtered by client IDs:
   - `client_members`
   - `client_tasks`
   - `client_events`
   - `client_files`
   - `client_money_items`
   - `client_links`
   - `operation_logs`
4. Group child rows by `client_id`.
5. For each client row, call `assembleClientSummaryFromRows()`.
6. Return `ClientSummary[]`.

Reference date:

- The repository should receive or derive a `referenceDate` once per call.
- For tests, inject it explicitly.
- For runtime later, use a SALMAN OS date helper or constant, not direct time calls inside the assembler.

## Required Supabase Row Shapes

Client rows:

```sql
select id, name, status, owner_name, drive_root_url, memo, updated_at
from clients
order by updated_at desc;
```

Member rows:

```sql
select client_id, staff_name, is_primary, is_active
from client_members
where client_id in (...);
```

Task rows:

```sql
select client_id, status
from client_tasks
where client_id in (...);
```

Event rows:

```sql
select client_id, status, event_date
from client_events
where client_id in (...);
```

File rows:

```sql
select client_id, file_category, drive_folder_path, archived_at
from client_files
where client_id in (...);
```

Money rows:

```sql
select client_id, status
from client_money_items
where client_id in (...);
```

Link rows:

```sql
select client_id, title, url
from client_links
where client_id in (...);
```

Log rows:

```sql
select client_id, created_at
from operation_logs
where client_id in (...);
```

No SQL should be executed as part of TASK-35 or TASK-36 without explicit approval. These are query-shape references only.

## Mock Projection Alignment

Current mock projection:

- `projectClientSummary()` counts every event where UI `status === 'scheduled'`.

TASK-34 Supabase assembly:

- Counts only DB `status='scheduled'` rows whose `event_date >= referenceDate`.
- Excludes past scheduled events.
- Excludes archived events.

Recommendation:

- Align mock projection to the same today-or-future scheduled rule before any visual comparison between mock and Supabase summaries.
- This is likely a small change but can alter demo counts, so it should be done with focused tests and an explicit reference date strategy.
- Do not change it in TASK-35 because this task is repository planning only.

## Test Plan

TASK-36 should test without real Supabase:

- Fake row readers return client and child rows.
- Repository calls row readers in the expected order.
- Empty client rows return `[]` and do not query child tables unnecessarily.
- Child rows are grouped by `client_id`.
- `assembleClientSummaryFromRows()` receives the injected `referenceDate`.
- Returned value is `ClientSummary[]`.
- Missing optional child rows still produce valid zero/false/null summary fields.
- Any row reader error rejects the repository call; no partial summary is returned.
- Placeholder repository remains selected by `currentRepositories.ts` unless activation is explicitly requested.

Existing tests to keep running:

```powershell
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts
npm.cmd run lint
npm.cmd run build
```

## Minimum Change Candidate

TASK-35 changes:

- Add this plan document.
- Update `docs/HANDOFF.md`.

TASK-36 candidate changes:

- Add fake-reader tested Supabase `ClientListRepository` implementation.
- Export the implementation from the Supabase adapter index if useful.
- Keep runtime selection pointed at placeholder repositories.
- Optionally add mock projection parity only if explicitly included in TASK-36 scope.

## Verification Order

For TASK-35:

1. `npm.cmd run lint`
2. `npm.cmd run build`
3. `git status --short`

For TASK-36:

1. Supabase repository unit tests with fake row readers.
2. Existing mapper/assembler tests.
3. `npm.cmd run lint`
4. `npm.cmd run build`
5. `git status --short`

## Next Task

TASK-36: Implement fake-reader-tested Supabase `ClientListRepository` behind the placeholder boundary, without activating it as the app data source.
