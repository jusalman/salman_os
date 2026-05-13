# TASK-34 ClientSummary Assembly Plan

## Plan

TASK-34 defines how Supabase-shaped rows become the current SALMAN OS `ClientSummary` read model.

This task does not connect to Supabase, does not activate `VITE_DATA_SOURCE=supabase`, does not enter real env values, does not execute SQL, and does not change UI behavior.

Implementation remains mock-first. The new assembly work is pure TypeScript only.

## Grill-Me Before Adapter Work

Risks and decisions before a real read repository is connected:

| Risk | Decision |
| --- | --- |
| `upcomingEventCount` can drift if it uses the runtime clock directly. | Require an injected `referenceDate` string in tests and assembler code. |
| Mock projection still counts all scheduled events. | Keep mock behavior unchanged for now; Supabase ClientSummary assembly uses the new today-or-future rule. |
| Timezone conversion can alter date boundaries. | Compare `YYYY-MM-DD` date keys only. No timezone transformation in this task. |
| Summary query could over-fetch child rows. | First adapter may fetch child rows by returned client IDs and assemble in TypeScript; DB view/RPC can wait. |
| Owner can come from `client_members` or `clients.owner_name`. | Use primary active `client_members.staff_name` when provided, fallback to `clients.owner_name`. |

Confirmation questions for TASK-35:

1. Should the mock projection be updated later to match Supabase `upcomingEventCount`, or should mock remain demo-oriented?
2. Should the first Supabase read repository fetch all child rows for returned clients, or start with a DB view/RPC for summaries?
3. Should latest log sorting assume ISO timestamps from Supabase, or should the adapter normalize timestamps before assembly?

## Criteria

Final `upcomingEventCount` basis:

- Count only `client_events` rows where `status='scheduled'`.
- Include events whose `event_date` is equal to or after the injected reference date.
- Exclude past events.
- Exclude `event_status='archived'`.
- Do not use the process clock inside the assembler; pass `referenceDate` as a parameter.

Reference date format:

- Use `YYYY-MM-DD`.
- Supabase `date` values should already be returned as date strings.
- If a timestamp-like value is ever passed, the first 10 characters are used as the date key.

## Row Inputs

Minimum row shapes for ClientSummary assembly:

| Row shape | Required fields |
| --- | --- |
| `ClientSummaryClientRow` | `id`, `name`, `status`, `owner_name`, `drive_root_url`, `memo`, `updated_at` |
| `ClientSummaryMemberRow` | `client_id`, `staff_name`, `is_primary`, `is_active` |
| `ClientSummaryTaskRow` | `client_id`, `status` |
| `ClientSummaryEventRow` | `client_id`, `status`, `event_date` |
| `ClientSummaryFileRow` | `client_id`, `file_category`, `drive_folder_path`, `archived_at` |
| `ClientSummaryMoneyRow` | `client_id`, `status` |
| `ClientSummaryLinkRow` | `client_id`, `title`, `url` |
| `ClientSummaryLogRow` | `client_id`, `created_at` |

## Assembly Rules

| `ClientSummary` field | Assembly rule |
| --- | --- |
| `id` | `clients.id` |
| `name` | `clients.name` |
| `status` | `mapClientStatusFromDb(clients.status)` |
| `owner` | Primary active member name, fallback `clients.owner_name` |
| `driveRootUrl` | `clients.drive_root_url ?? ''` |
| `memo` | `clients.memo ?? ''` |
| `updatedAt` | `clients.updated_at` |
| `openTaskCount` | Count `todo`, `in_progress`, `blocked` task rows |
| `upcomingEventCount` | Count `scheduled` events with `event_date >= referenceDate` |
| `hasBizMoneyWarning` | True if any money row status is not `normal` |
| `latestLogAt` | Latest `operation_logs.created_at`, or `null` |
| `hasDriveFolder` | Non-empty client root URL or any non-empty `drive_folder_path` |
| `hasLookerLink` | Link title contains `looker` or URL contains `lookerstudio.google.com` |
| `hasSheetLink` | Link title contains `sheet` or URL contains `docs.google.com/spreadsheets` |

## Test Plan

Tests added in this task:

- Client base field assembly, nullable string handling, and primary owner resolution.
- Open task count from DB task status rows.
- Upcoming event count with injected `referenceDate`, including today/future scheduled events and excluding past/done/archived events.
- Money warning, Drive folder, Looker link, Sheet link, and latest log summary flags.
- Mapper-level upcoming scheduled helper coverage.

## Minimum Implementation Candidate

Implemented pure helper files:

- `src/data/adapters/supabase/clientSummaryAssembler.ts`
- `tests/supabase/clientSummaryAssembler.test.ts`

No repository activation is included. `currentRepositories.ts` and the placeholder Supabase repositories remain unchanged.

## Verification Order

Run:

1. `node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts`
2. `npm.cmd run lint`
3. `npm.cmd run build`
4. `git status --short`

## Next Task

TASK-35 should plan or implement the first Supabase `ClientListRepository` read adapter behind the existing placeholder boundary, still without making Supabase the default app data source.
