# SALMAN OS Supabase Read Adapter Mapping

## Purpose

This document defines the read adapter mapping that must be approved before SALMAN OS connects real Supabase reads to the app.

TASK-32 is a mapping plan only. It does not switch the app to real data, does not enter Supabase URL or key values, does not create `.env.local`, does not execute SQL, and does not implement Ads, RAG, Google Drive API, Google Calendar API, Playwright, OpenAI API, or customer portal features.

The runtime must remain mock-first. `VITE_DATA_SOURCE=mock` stays the default, and `VITE_DATA_SOURCE=supabase` must remain placeholder-only until a later approved implementation task.

## Source Files Reviewed

- `src/domain/types.ts`
- `src/domain/labels.ts`
- `src/data/repositories/clientListRepository.ts`
- `src/data/repositories/clientDetailRepository.ts`
- `src/data/repositories/smartOperationViewsRepository.ts`
- `src/data/repositories/currentRepositories.ts`
- `src/data/adapters/mock/clientRecordReadStore.ts`
- `src/data/adapters/mock/clientListMockRepository.ts`
- `src/data/adapters/mock/clientDetailMockRepository.ts`
- `src/data/adapters/mock/smartOperationViewsMockRepository.ts`
- `src/data/adapters/supabase/README.md`
- `src/data/adapters/supabase/supabaseClient.ts`
- `src/data/adapters/supabase/clientRowsReadAdapter.ts`
- `src/data/adapters/supabase/notImplementedRepositories.ts`
- `src/data/projections/clientSummary.ts`
- `src/data/projections/clientDetailHeader.ts`
- `src/data/projections/clientDetailPanels.ts`
- `src/data/projections/clientListItem.ts`
- `src/data/projections/clientListView.ts`
- `src/data/projections/selectedClientDetailView.ts`
- `src/hooks/useClients.ts`
- `src/hooks/useSelectedClient.ts`
- `src/hooks/useSmartViews.ts`
- `src/App.tsx`
- `SUPABASE_NAMING_CONVENTIONS.md`
- `SUPABASE_READ_MAPPING.md`
- `docs/SUPABASE_SCHEMA_DRAFT.sql`
- `docs/migrations/2026-05-13_initial_schema_candidate.sql`
- `docs/HANDOFF.md`

## Mapping Rules

The adapter boundary is the only place where DB rows may be translated into UI read models.

- Repository contracts stay unchanged:
  - `ClientListRepository.listClientSummaries(): Promise<ClientSummary[]>`
  - `ClientDetailRepository.getClientDetail(clientId): Promise<ClientRecord | undefined>`
  - `SmartOperationViewsRepository.getSmartOperationViews(): Promise<SmartViews>`
- UI components must never receive raw Supabase rows.
- Existing projection functions should be reused where possible after the adapter assembles `ClientRecord` or `ClientSummary`-compatible values.
- Nullable DB strings should map to empty strings only where the current UI type requires a string.
- Date/time values should remain display-safe strings in this adapter phase; no timezone transformation should be introduced in TASK-33 unless separately approved.
- Unknown enum values should fail closed with a clear adapter error during development rather than silently showing misleading UI state.
- Archived records should follow the existing `99_Archive` policy and must not imply physical deletion.

## Table Coverage

The SQL candidate and handoff confirm these 8 core tables:

| Table | Client summary role | Detail role |
| --- | --- | --- |
| `clients` | Base client row, status, owner fallback, Drive root, memo, updated time. | Header base fields. |
| `client_members` | Optional owner resolution through active primary member. | Future staff assignment context. |
| `client_tasks` | Open task counts. | Task panel rows. |
| `client_events` | Upcoming internal schedule counts. | Internal schedule panel rows. |
| `client_files` | Drive folder presence and archive signal. | File panel rows. |
| `client_money_items` | Biz Money warning signal. | Business Money panel rows. |
| `client_links` | Looker, Sheets, Drive/admin/report link signals. | Links panel rows. |
| `operation_logs` | Latest log timestamp. | Operation log panel rows. |

Checked but not selected for v1 ClientSummary:

| Candidate | Decision |
| --- | --- |
| `portal_profiles` | Not present in the confirmed v1 schema and external customer portal is out of v1 scope. Do not add. |
| `portal_profile_members` | Not present in the confirmed v1 schema and portal membership is out of v1 scope. Do not add. |
| `settings` | Not present in the confirmed v1 schema. Not required for ClientSummary mapping. Do not add unless a later settings-specific TASK approves it. |

## DB Enum To UI Model Mapping

| DB enum | DB value | UI read model value | Decision |
| --- | --- | --- | --- |
| `client_status` | `pending` | `attention` | Pending setup needs staff attention in current UI. |
| `client_status` | `active` | `active` | Direct match. |
| `client_status` | `ended` | `archived` | Ended client is shown as retained/archive-style in v1. |
| `task_status` | `todo` | `doing` | Current UI has no todo state; counts as open work. |
| `task_status` | `in_progress` | `doing` | Current UI working state. |
| `task_status` | `blocked` | `blocked` | Direct match. |
| `task_status` | `done` | `done` | Direct match. |
| `task_priority` | `low` | `low` | Direct match. |
| `task_priority` | `medium` | `normal` | Current UI uses normal. |
| `task_priority` | `high` | `high` | Direct match. |
| `task_priority` | `urgent` | `high` | Current UI has no urgent state; preserve attention behavior through high. |
| `event_status` | `scheduled` | `scheduled` | Direct match. |
| `event_status` | `done` | `done` | Direct match. |
| `event_status` | `canceled` | `canceled` | Direct match. |
| `event_status` | `archived` | Exclude from normal schedule rows | Avoid falsely rendering archived schedule items as canceled. |
| `file_category` plus `archived_at` | `archive` or non-null `archived_at` | `archived` | `99_Archive` display state. |
| `file_category` plus `archived_at` | any non-archive category and null `archived_at` | `active` | Normal visible file state. |
| `money_status` | `normal` | `checked` | Clear manual Biz Money state. |
| `money_status` | `warning` | `check_needed` | Staff should manually review. |
| `money_status` | `low` | `issue` | Stronger warning than review-needed. |
| `money_status` | `empty` | `issue` | Empty balance is an issue in the current UI model. |
| `log_action_type` | `create` | `created` | Display string. |
| `log_action_type` | `update` | `updated` | Display string. |
| `log_action_type` | `archive` | `archived` | Display string. |
| `log_action_type` | `restore` | `restored` | Display string. |
| `log_action_type` | `view` | `viewed` | Display string. |
| `log_action_type` | `link_open` | `link opened` | Display string. |
| `log_action_type` | `login` | `login` | Display string. |
| `log_action_type` | `memo` | `note` | Match existing mock style. |

Lossy mappings that should be revisited after the first adapter works:

- `todo` and `in_progress` both become `doing`.
- `urgent` becomes `high`.
- `pending` becomes `attention`.
- `event_status='archived'` is filtered out of schedule panel reads.

## ClientSummary Mapping Draft

`ClientSummary` should be assembled from `clients` plus child-table aggregates. The first real adapter may fetch rows and derive in TypeScript. A DB view/RPC can be considered later only if performance requires it.

| `ClientSummary` field | Source | Adapter rule |
| --- | --- | --- |
| `id` | `clients.id` | UUID as string. |
| `name` | `clients.name` | Required. |
| `status` | `clients.status` | Use `client_status` mapping table above. |
| `owner` | Primary active `client_members.staff_name`, fallback `clients.owner_name` | Do not block first adapter on `client_members` joins. |
| `driveRootUrl` | `clients.drive_root_url` | Null maps to empty string. |
| `memo` | `clients.memo` | Null maps to empty string. |
| `updatedAt` | `clients.updated_at` | Return display-safe timestamp string. |
| `openTaskCount` | `client_tasks.status` | Count `todo`, `in_progress`, `blocked`. |
| `upcomingEventCount` | `client_events.status`, `client_events.event_date` | Count `scheduled`; date filtering can remain a later refinement unless UI requires only future items. |
| `hasBizMoneyWarning` | `client_money_items.status` | True when any status is not `normal`. |
| `latestLogAt` | `operation_logs.created_at` | Latest log timestamp per client, newest first. |
| `hasDriveFolder` | `clients.drive_root_url`, `client_files.drive_folder_path` | True if root URL or any non-empty folder path exists. |
| `hasLookerLink` | `client_links.title`, `client_links.url` | Same detection as current projection: title or URL includes Looker/Looker Studio. |
| `hasSheetLink` | `client_links.title`, `client_links.url` | Same detection as current projection: title or URL includes Sheets/spreadsheets. |

Minimum first implementation candidate:

1. Query `clients` ordered by `updated_at desc`.
2. Query child rows required for all returned client IDs.
3. Group child rows by `client_id`.
4. Map base rows and child collections into current `ClientSummary` shape.
5. Keep `clientListSupabasePlaceholderRepository` active until all tests pass and the user approves the data source switch.

## ClientRecord Mapping Draft

`ClientDetailRepository.getClientDetail(clientId)` should return one assembled `ClientRecord` or `undefined`.

| `ClientRecord` field | Source | Adapter rule |
| --- | --- | --- |
| Base fields | `clients` | Same base mapping as `ClientSummary`. |
| `files` | `client_files` | Map `file_name`, `file_type`, `drive_folder_path`, `drive_url`, `uploaded_by_name`, `created_at`, and derived file status. |
| `tasks` | `client_tasks` | Map status/priority enums, nullable due date and assignee to strings, `memo` to `note`. |
| `events` | `client_events` | Exclude archived rows from the current schedule panel; map null times/owner/memo to empty strings. |
| `moneyItems` | `client_money_items` | Map money enum, nullable URL/check fields, `memo` to `note`. |
| `links` | `client_links` | Allow only current UI categories `drive`, `admin`, `report`, `external`; unknown category maps to `external` unless a later task expands UI types. |
| `logs` | `operation_logs` | Order newest first and map action type to display string. |

## Loading, Error, And Empty State Placement

The existing hooks and `App.tsx` already define the correct state boundary.

| State | Current location | TASK-33 recommendation |
| --- | --- | --- |
| Client list loading/error/empty | `useClients.ts`, `App.tsx` | Keep here. Adapter throws typed/clear errors; hook converts to user-facing message. |
| Selected client loading/error/not found | `useSelectedClient.ts`, `App.tsx` | Keep here. Adapter returns `undefined` when no row exists. |
| Smart views loading/error | `useSmartViews.ts`, `App.tsx` | Keep here. Adapter should not render fallback UI. |
| Empty panels | Panel components currently render empty stacks | Leave UI unchanged for first adapter; panel-specific empty text can be a later UI task. |

Do not add loading or error UI inside Supabase adapter files. The adapter should only fetch, validate, map, and throw/return repository values.

## Out Of Scope

- Real Supabase connection values.
- `.env.local` creation.
- Service role key exposure.
- SQL execution or schema changes.
- App-wide real data switch.
- Ads module implementation.
- RAG or Drive implementation.
- Calendar integration or customer Google Calendar creation.
- OpenAI API or AI employee execution.
- Playwright automation.
- External customer portal tables or screens.
