# TASK-32 Read Adapter Plan

## Plan

TASK-32 prepares the Supabase read adapter mapping before any real data connection is wired into SALMAN OS.

Required order:

1. Plan.
2. Mapping criteria confirmation.
3. Test plan.
4. Minimum change candidates.
5. Verification order.

Current baseline:

- TASK-31 added the Supabase browser client foundation.
- `npm.cmd run lint` and `npm.cmd run build` were previously reported as passing.
- `VITE_DATA_SOURCE=mock` remains the default.
- `VITE_DATA_SOURCE=supabase` still uses placeholder repositories.
- Supabase enum values are not yet mapped into current UI read model values.
- The app remains mock-first.

## Grill-Me Before Implementation

Risks to confirm before TASK-33 implementation:

| Risk | Why it matters | Proposed decision for TASK-33 |
| --- | --- | --- |
| Lossy enum mapping | Current UI model has fewer states than DB enums. | Implement explicit mapper functions with tests and document lossy cases. |
| `todo` vs `in_progress` collapse | Both become UI `doing`. | Accept for first adapter; revisit UI model later if needed. |
| `urgent` priority collapse | UI has no urgent priority. | Map to `high`; keep data in DB unchanged. |
| Archived event behavior | UI has no schedule `archived` state. | Exclude archived events from normal schedule rows. |
| Owner source ambiguity | `clients.owner_name` and `client_members` can both identify staff. | Use primary active `client_members` when available, fallback to `clients.owner_name`. |
| Link category mismatch | DB `client_links.category` is text but UI accepts four categories. | Map unknown categories to `external` for first adapter. |
| Null DB fields | UI read model mostly expects strings. | Convert nullable display fields to empty strings at adapter boundary. |
| Summary query performance | ClientSummary needs child-table counts and existence checks. | Derive in TypeScript first; DB view/RPC only after performance evidence. |
| Real data activation | Switching repositories too early can break mock-first behavior. | Keep placeholder active until mapping tests pass and a separate TASK approves activation. |
| Portal table drift | `portal_profiles`, `portal_profile_members`, and `settings` are not in v1 schema. | Do not add or depend on them for ClientSummary. |

Implementation questions to answer before writing TASK-33 code:

1. Should `pending` clients appear as `attention` in the current UI, or should the UI type later gain a `pending` state?
2. Should archived tasks exist in Supabase v1, or is task archival represented only by done status and operation logs?
3. Should `upcomingEventCount` mean all `scheduled` events or only `scheduled` events on/after today?
4. Should unknown link categories map to `external` or should the adapter fail closed?
5. Should `client_members` be required in the first adapter query, or remain a fallback enhancement after `clients.owner_name` works?

No answer is required to complete TASK-32. These are approval questions for the next implementation task.

## Mapping Criteria Confirmation

The mapping criteria are documented in `docs/SUPABASE_READ_ADAPTER_MAPPING.md`.

Confirmed boundaries:

- Keep repository contracts unchanged.
- Keep UI components unchanged.
- Keep mock repositories as the default active data source.
- Keep Supabase placeholder repositories active until a later implementation task.
- Use Supabase only as operational data, not as a Google Drive, Google Calendar, Ads, RAG, OpenAI, or Playwright implementation.
- Map DB enums into current UI read model values inside the adapter only.
- Reuse projection functions after the adapter assembles repository read models.

Core mapping decisions:

| Area | Decision |
| --- | --- |
| Client status | `pending -> attention`, `active -> active`, `ended -> archived`. |
| Task status | `todo/in_progress -> doing`, `blocked -> blocked`, `done -> done`. |
| Task priority | `medium -> normal`, `urgent -> high`. |
| Event status | `scheduled/done/canceled` map directly; `archived` is excluded from normal schedule rows. |
| File status | Derived from `file_category='archive'` or non-null `archived_at`. |
| Money status | `normal -> checked`, `warning -> check_needed`, `low/empty -> issue`. |
| Operation log action | Convert DB `log_action_type` into existing display strings. |
| Portal/settings tables | Not part of v1 ClientSummary mapping. |

## Test Plan

TASK-33 should add focused tests around pure mapping functions before activating a real repository.

Minimum unit test candidates:

- `mapClientStatusFromDb()`
- `mapTaskStatusFromDb()`
- `mapTaskPriorityFromDb()`
- `mapEventStatusFromDb()` or event filtering helper
- `mapFileStatusFromDb()`
- `mapMoneyStatusFromDb()`
- `mapLogActionFromDb()`
- `mapClientLinkCategoryFromDb()`
- `mapClientRowToClientBase()`
- `assembleClientSummaryFromRows()`
- `assembleClientRecordFromRows()`

Repository behavior tests:

- `listClientSummaries()` returns `ClientSummary[]`, not raw rows.
- `getClientDetail(clientId)` returns `undefined` for a missing client.
- Summary counts use DB values before UI enum conversion where needed.
- Archived files appear as `archived`.
- Archived events do not appear in the normal schedule panel rows.
- Money warning is true for any non-`normal` DB money status.
- Unknown enum values produce a clear adapter error in development tests.

Manual verification for TASK-33:

- With default env, app still loads mock data.
- With invalid `VITE_DATA_SOURCE`, app still falls back to mock.
- With `VITE_DATA_SOURCE=supabase` before activation, placeholder error remains clear.
- No service role key is referenced in frontend code.
- No real Supabase URL or anon key is committed.

## Minimum Change Candidates

TASK-32 changes:

- Add `docs/SUPABASE_READ_ADAPTER_MAPPING.md`.
- Add `docs/TASK_32_READ_ADAPTER_PLAN.md`.
- Update `docs/HANDOFF.md` with TASK-32 completion state after verification.

TASK-33 implementation candidates, not part of TASK-32:

- Add pure mapper helpers under `src/data/adapters/supabase/`.
- Add read adapter repository implementation behind the existing repository interface.
- Keep `currentRepositories.ts` mock-first and do not switch Supabase active by default.
- Add tests only if the project test harness is introduced or already approved.

Do not change in TASK-32:

- `src`
- `public`
- `package.json`
- `.env.local`
- SQL files
- Supabase project data
- UI layout or panel components

## Verification Order

Run verification after documentation changes:

1. `npm.cmd run lint`
2. `npm.cmd run build`
3. `git status --short`

Expected outcome:

- Lint passes.
- Build passes.
- Changed files are documentation-only for TASK-32, while existing TASK-31 worktree changes remain untouched.

## TASK-33 Proposal

Recommended next task:

TASK-33: Implement pure Supabase read mapper helpers with tests, without activating `VITE_DATA_SOURCE=supabase` as a real app data source.

Acceptance criteria:

- Mapper helpers cover all enum conversions in `docs/SUPABASE_READ_ADAPTER_MAPPING.md`.
- ClientSummary assembly can be tested from mocked Supabase-shaped rows.
- ClientRecord assembly can be tested from mocked Supabase-shaped rows.
- Mock-first runtime behavior remains unchanged.
- No real Supabase env values are added.
- No SQL is executed.
