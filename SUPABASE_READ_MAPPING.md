# SALMAN OS Supabase Read Mapping

## Purpose

This document freezes the read-side contract before a real Supabase adapter is implemented for SALMAN OS.

TASK-16 is documentation only. It does not connect to Supabase, does not install `@supabase/supabase-js`, does not create a `.env` file, does not execute SQL, and does not add write features.

SALMAN OS v1 is an internal staff MVP. The active runtime data source remains `VITE_DATA_SOURCE=mock`. `VITE_DATA_SOURCE=supabase` remains a safe not implemented placeholder until a later task.

## Read Boundaries

The app has three read repository contracts.

| Repository | Current adapter | Future Supabase responsibility |
| --- | --- | --- |
| `ClientListRepository` | mock | Load client list summary data only. |
| `ClientDetailRepository` | mock | Load one selected client detail record and its panels. |
| `SmartOperationViewsRepository` | mock | Load or derive template-based Smart Operation Views. |

v1 read behavior must stay separate from future write behavior. Create, update, archive, and sync flows are separate tasks and are not part of this mapping.

## Table Candidates

| Table or view | Purpose | v1 policy |
| --- | --- | --- |
| `clients` | Client master records. | Required. Supabase is the operational data source. |
| `client_members` | Internal staff roles per client. | Candidate table. v1 can still expose owner/assignee names as read fields. |
| `client_files` | Google Drive file/folder metadata and original URLs. | Required. Google Drive remains the source file store. |
| `client_tasks` | Internal client operations tasks. | Required. |
| `client_events` | Internal schedule records. | Required. This is not Google Calendar integration. |
| `client_money_items` | Manual Biz Money check links/status. | Required. No automatic collection in v1. |
| `client_links` | Drive, admin, report, and external reference links. | Required. |
| `operation_logs` | Internal operation log entries. | Required for recent activity. |
| `smart_operation_views` | Optional materialized/read view for smart view rows. | Not required for v1. Prefer derived read model first. |

## Enum Alignment

The Supabase adapter should map DB values into the current TypeScript read model without changing UI contracts.

| Read model type | Allowed values |
| --- | --- |
| `ClientStatus` | `active`, `attention`, `archived` |
| `TaskStatus` | `doing`, `blocked`, `done`, `archived` |
| `TaskPriority` | `high`, `normal`, `low` |
| `EventStatus` | `scheduled`, `done`, `canceled` |
| `FileStatus` | `active`, `archived` |
| `MoneyStatus` | `check_needed`, `checked`, `issue` |
| `ClientLink.category` | `drive`, `admin`, `report`, `external` |

If an existing schema uses older names such as `owner_name`, `memo`, or `file_name`, the adapter should translate them to the read model names shown below. Do not force UI components to know DB column names.

## `clients`

Maps to `ClientRecord` and `ClientSummary` base fields.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `clients.id` | UUID/string. |
| `name` | `clients.name` | Client display name. |
| `status` | `clients.status` | Must map to `active`, `attention`, or `archived`. |
| `owner` | `clients.owner_name` or primary `client_members.name` | v1 currently reads an owner string. |
| `driveRootUrl` | `clients.drive_root_url` | Google Drive root folder URL only. No Drive API. |
| `memo` | `clients.memo` | Internal note. |
| `updatedAt` | `clients.updated_at` | Used for display and sorting candidates. |

## `client_members`

Candidate normalization table for internal staff assignments.

| Candidate column | Notes |
| --- | --- |
| `id` | UUID/string. |
| `client_id` | FK to `clients.id`. |
| `staff_name` | Internal staff display name. |
| `role` | Example: `owner`, `assignee`, `viewer`. |
| `is_primary` | Useful for choosing `ClientRecord.owner`. |
| `is_active` | Exclude inactive assignments from v1 reads unless needed. |

If this table is not implemented in the first Supabase read adapter, `clients.owner_name` is acceptable as the read source for `owner`.

## `client_files`

Maps to `ClientFile`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `client_files.id` | UUID/string. |
| `name` | `client_files.file_name` or `name` | File/folder display name. |
| `type` | `client_files.file_type` | Display metadata only. |
| `folderPath` | `client_files.drive_folder_path` | Drive folder path metadata. |
| `driveUrl` | `client_files.drive_url` | Original Google Drive URL. |
| `status` | `client_files.status` | `active` or `archived`. |
| `uploadedBy` | `client_files.uploaded_by_name` | Internal staff name. |
| `uploadedAt` | `client_files.created_at` | Current read model has upload time. |

Google Drive is the source file store. `client_files` stores metadata and original URLs only. v1 must not call Google Drive API.

File deletion policy is archive-only. Archived files should be represented by `status='archived'` and a Drive path that follows the `99_Archive` policy; permanent deletion is outside v1 scope.

## `client_tasks`

Maps to `ClientTask`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `client_tasks.id` | UUID/string. |
| `title` | `client_tasks.title` | Task title. |
| `status` | `client_tasks.status` | `doing`, `blocked`, `done`, `archived`. |
| `priority` | `client_tasks.priority` | `high`, `normal`, `low`. |
| `dueDate` | `client_tasks.due_date` | Date string. |
| `assignee` | `client_tasks.assignee_name` or `client_members.staff_name` | v1 reads a display string. |
| `relatedFileId` | `client_tasks.related_file_id` | Optional FK to `client_files.id`. |
| `note` | `client_tasks.memo` or `note` | Internal note. |

## `client_events`

Maps to `ClientEvent`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `client_events.id` | UUID/string. |
| `title` | `client_events.title` | Internal schedule title. |
| `eventDate` | `client_events.event_date` | Date string. |
| `startTime` | `client_events.start_time` | Time string. |
| `endTime` | `client_events.end_time` | Time string. |
| `owner` | `client_events.owner_name` | Internal owner. |
| `status` | `client_events.status` | `scheduled`, `done`, `canceled`. |
| `note` | `client_events.memo` or `note` | Internal note. |

SALMAN OS v1 calendar UI is an internal schedule UI backed by `client_events`. It is not Google Calendar integration, does not create customer Google Calendars, and must not call Google Calendar API.

## `client_money_items`

Maps to `ClientMoneyItem`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `client_money_items.id` | UUID/string. |
| `title` | `client_money_items.title` | Manual check item title. |
| `url` | `client_money_items.url` | Admin/report URL. |
| `status` | `client_money_items.status` | `check_needed`, `checked`, `issue`. |
| `lastCheckedAt` | `client_money_items.last_checked_at` | Nullable. |
| `checkedBy` | `client_money_items.checked_by_name` | Nullable. |
| `note` | `client_money_items.memo` or `note` | Internal note. |

v1 supports manual Biz Money status review only. Automatic collection is outside scope.

## `client_links`

Maps to `ClientLink`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `client_links.id` | UUID/string. |
| `title` | `client_links.title` | Link display title. |
| `url` | `client_links.url` | URL string. |
| `category` | `client_links.category` | `drive`, `admin`, `report`, `external`. |

`drive` links are references to original Google Drive resources. They are not Drive API connections.

## `operation_logs`

Maps to `OperationLog`.

| Read model field | Candidate column | Notes |
| --- | --- | --- |
| `id` | `operation_logs.id` | UUID/string. |
| `createdAt` | `operation_logs.created_at` | Used for latest activity. |
| `actor` | `operation_logs.actor_name` | Internal staff name. |
| `action` | `operation_logs.action_type` | Display action label source. |
| `message` | `operation_logs.message` | Log message. |

## Client List Query

Repository: `ClientListRepository.listClientSummaries()`.

Returns: `Promise<ClientSummary[]>`.

Required source data:

| `ClientSummary` field | Source |
| --- | --- |
| `id`, `name`, `status`, `owner`, `driveRootUrl`, `memo`, `updatedAt` | `clients` plus optional primary `client_members`. |
| `openTaskCount` | Count `client_tasks` where `status in ('doing', 'blocked')`. |
| `upcomingEventCount` | Count `client_events` where `status='scheduled'`. |
| `hasBizMoneyWarning` | Exists `client_money_items` where `status != 'checked'`. |
| `latestLogAt` | Latest `operation_logs.created_at` per client. |
| `hasDriveFolder` | `clients.drive_root_url` is not empty or active `client_files.drive_folder_path` exists. |
| `hasLookerLink` | `client_links.title` or `client_links.url` indicates Looker Studio. |
| `hasSheetLink` | `client_links.title` or `client_links.url` indicates Google Sheets. |

Implementation options for a future Supabase adapter:

- Use one read-optimized Supabase view/RPC for summaries if performance requires it.
- Or fetch base rows and derive counts in the adapter for the first implementation.
- Keep the returned shape as `ClientSummary[]`; UI must not receive raw DB rows.

## Client Detail Query

Repository: `ClientDetailRepository.getClientDetail(clientId)`.

Returns: `Promise<ClientRecord | undefined>`.

Required source data:

| `ClientRecord` field | Source |
| --- | --- |
| Base fields | One row from `clients` plus optional owner from `client_members`. |
| `files` | `client_files` filtered by `client_id`. |
| `tasks` | `client_tasks` filtered by `client_id`. |
| `events` | `client_events` filtered by `client_id`. |
| `moneyItems` | `client_money_items` filtered by `client_id`. |
| `links` | `client_links` filtered by `client_id`. |
| `logs` | `operation_logs` filtered by `client_id`, newest first. |

The adapter may use Supabase nested selects or separate queries. Either option must assemble a `ClientRecord` before passing data to projection functions.

## Smart Operation Views Query

Repository: `SmartOperationViewsRepository.getSmartOperationViews()`.

Returns: `Promise<SmartViews>`.

Smart Operation Views are template-based summaries. They are not AI, do not call OpenAI API, and do not execute AI employees.

Current derived policy:

| Smart view section | Source rule |
| --- | --- |
| `todaysItems` | `client_events` where `event_date` equals SALMAN OS `TODAY` and `status='scheduled'`. |
| `priorityTasks` | `client_tasks` where `status='blocked'` or `priority='high'`. |
| `moneyAlerts` | `client_money_items` where `status != 'checked'`. |
| `recentArchive` | `client_files` where `status='archived'`; display should reflect `99_Archive` policy. |

v1 should derive this from base tables in the read adapter first. A future `smart_operation_views` DB view can be added only as an optimization, with the same output contract.

## Out Of Scope For This Mapping

- Supabase connection code.
- `@supabase/supabase-js` installation.
- Real `.env` creation or real keys.
- SQL migration files or SQL execution.
- Write repositories.
- Google Drive API.
- Google Calendar API.
- OpenAI API or AI employee execution.
- Biz Money automatic collection.
- Playwright automation.
- External customer portal.
