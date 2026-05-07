# SALMAN OS Supabase Naming Conventions

## Purpose

This document fixes the v1 Supabase naming baseline before SQL migrations are written.

TASK-17 is documentation only. It does not connect to Supabase, does not install `@supabase/supabase-js`, does not create a `.env` file, does not create SQL migration files, does not execute SQL, and does not add write features.

## Scope

SALMAN OS v1 is an internal staff MVP. Supabase is the future operational data source, while the current runtime still uses mock repositories through `VITE_DATA_SOURCE=mock`.

The naming rules below are the source of truth for the next SQL migration task. If the current TypeScript mock read model uses older labels, the future adapter or a separate read model alignment task must translate them without changing the UI during TASK-17.

## General Naming Rules

- Table names use plural `snake_case`.
- Column names use `snake_case`.
- Primary keys use `id`.
- Foreign keys use `{table_singular}_id`, for example `client_id`.
- Timestamps use `created_at` and `updated_at`.
- Date columns use `_date`.
- Time columns use `_time`.
- URL columns use `_url`.
- Display names use `_name`.
- Notes use `memo` unless the value is a log message.
- Archive state uses explicit enum/status fields and optional `archived_at`; physical deletion is outside v1.

## Fixed Enum Values

These enum names and values are fixed for v1 schema design.

| Enum name | Values |
| --- | --- |
| `client_status` | `pending`, `active`, `ended` |
| `service_type` | `sa`, `da`, `sa_da` |
| `task_status` | `todo`, `in_progress`, `done`, `blocked` |
| `task_priority` | `low`, `medium`, `high`, `urgent` |
| `event_type` | `meeting`, `deadline`, `campaign`, `report`, `biz_money`, `creative`, `other` |
| `file_category` | `common`, `sa`, `da`, `report`, `contract`, `meeting_note`, `creative`, `archive`, `other` |
| `money_status` | `normal`, `warning`, `low`, `empty` |
| `log_action_type` | `create`, `update`, `archive`, `restore`, `view`, `link_open`, `login`, `memo` |

## TypeScript Read Model Mapping Policy

The Supabase adapter must return the repository contract shapes, not raw DB rows.

| TypeScript field style | DB column style | Rule |
| --- | --- | --- |
| `driveRootUrl` | `drive_root_url` | Convert camelCase to snake_case at adapter boundary. |
| `updatedAt` | `updated_at` | Convert timestamp names at adapter boundary. |
| `eventDate` | `event_date` | Convert date names at adapter boundary. |
| `startTime`, `endTime` | `start_time`, `end_time` | Convert time names at adapter boundary. |
| `uploadedBy` | `uploaded_by_name` | DB stores staff display name for v1 reads. |
| `lastCheckedAt` | `last_checked_at` | Nullable timestamp. |
| `checkedBy` | `checked_by_name` | Nullable staff display name. |
| `createdAt` | `created_at` | Used by operation logs and ordering. |

Enum transition notes:

- Current mock `ClientStatus` values are not the final DB enum values. DB `client_status` is fixed as `pending`, `active`, `ended`.
- Current mock task value `doing` should become DB `task_status='in_progress'`.
- Current mock task priority `normal` should become DB `task_priority='medium'`.
- Current file active/archive display can be derived from `file_category='archive'` or `archived_at is not null`.
- Current money warning display should be derived from `money_status` where values other than `normal` require attention.

## Table Standards

All client-owned tables must include `client_id` to keep customer data isolated by client. v1 does not implement RLS/Auth, but the schema must preserve the future RLS boundary.

### `clients`

Purpose: client master record for SALMAN OS operations.

Primary key: `id`.

Foreign keys: none required in v1.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientRecord.id`, `ClientSummary.id` |
| `name` | text | No | `name` |
| `status` | `client_status` | No | client lifecycle/status display |
| `service_type` | `service_type` | No | future filtering and labels |
| `owner_name` | text | No | `owner` until `client_members` ownership is used |
| `drive_root_url` | text | Yes | `driveRootUrl`, `hasDriveFolder` |
| `memo` | text | Yes | `memo` |
| `created_at` | timestamp | No | audit/read ordering candidate |
| `updated_at` | timestamp | No | `updatedAt` |
| `ended_at` | timestamp | Yes | lifecycle reference when `status='ended'` |

Enum columns: `status`, `service_type`.

Timestamps: `created_at`, `updated_at` required.

### `client_members`

Purpose: internal staff assignment per client.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | not exposed directly |
| `client_id` | UUID/string | No | client data isolation |
| `staff_name` | text | No | owner/assignee display candidate |
| `role` | text | No | future ownership/role filtering |
| `is_primary` | boolean | No | owner resolution candidate |
| `is_active` | boolean | No | exclude inactive members by default |
| `created_at` | timestamp | No | audit |
| `updated_at` | timestamp | No | audit |

Enum columns: none fixed for v1. Keep `role` as text until role values are separately locked.

Timestamps: `created_at`, `updated_at` required.

### `client_files`

Purpose: Google Drive original file/folder metadata and URL references.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientFile.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `file_name` | text | No | `ClientFile.name` |
| `file_category` | `file_category` | No | file grouping; `archive` maps to archived display |
| `drive_url` | text | No | `driveUrl` |
| `drive_folder_path` | text | Yes | `folderPath`, `hasDriveFolder` |
| `uploaded_by_name` | text | No | `uploadedBy` |
| `archived_at` | timestamp | Yes | archive state/reference |
| `created_at` | timestamp | No | `uploadedAt` |
| `updated_at` | timestamp | No | audit |

Enum columns: `file_category`.

Timestamps: `created_at`, `updated_at` required. `archived_at` nullable.

Google Drive remains the source file store. This table stores metadata and original URLs only. No Google Drive API connection is part of v1.

Archive policy: files are not permanently deleted in v1. Archive handling follows the `99_Archive` policy and should use `file_category='archive'` and/or `archived_at`.

### `client_tasks`

Purpose: internal client operation tasks.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`; `related_file_id` optionally references `client_files.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientTask.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `title` | text | No | `title` |
| `status` | `task_status` | No | task status display/counts |
| `priority` | `task_priority` | No | task priority display/smart views |
| `due_date` | date | Yes | `dueDate` |
| `assignee_name` | text | Yes | `assignee` |
| `related_file_id` | UUID/string | Yes | `relatedFileId` |
| `memo` | text | Yes | `note` |
| `created_at` | timestamp | No | audit |
| `updated_at` | timestamp | No | audit |

Enum columns: `status`, `priority`.

Timestamps: `created_at`, `updated_at` required.

### `client_events`

Purpose: internal schedule records for client operations.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientEvent.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `title` | text | No | `title` |
| `event_type` | `event_type` | No | schedule grouping/filtering |
| `event_date` | date | No | `eventDate`, Smart Operation Views |
| `start_time` | time | Yes | `startTime` |
| `end_time` | time | Yes | `endTime` |
| `owner_name` | text | Yes | `owner` |
| `memo` | text | Yes | `note` |
| `created_at` | timestamp | No | audit |
| `updated_at` | timestamp | No | audit |

Enum columns: `event_type`.

Timestamps: `created_at`, `updated_at` required.

SALMAN OS v1 calendar is this internal `client_events` UI. It is not Google Calendar integration and does not create customer Google Calendars.

### `client_money_items`

Purpose: manual Biz Money status records and related reference links.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientMoneyItem.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `title` | text | No | `title` |
| `url` | text | Yes | `url` |
| `status` | `money_status` | No | money status display/warnings |
| `last_checked_at` | timestamp | Yes | `lastCheckedAt` |
| `checked_by_name` | text | Yes | `checkedBy` |
| `memo` | text | Yes | `note` |
| `created_at` | timestamp | No | audit |
| `updated_at` | timestamp | No | audit |

Enum columns: `status`.

Timestamps: `created_at`, `updated_at` required.

v1 does not automatically collect Biz Money data. Staff update/check behavior belongs to a later write task.

### `client_links`

Purpose: client reference links for Drive, admin, report, and external resources.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `ClientLink.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `title` | text | No | `title`, Looker/Sheet detection |
| `url` | text | No | `url`, Looker/Sheet detection |
| `category` | text | No | `category` |
| `created_at` | timestamp | No | audit |
| `updated_at` | timestamp | No | audit |

Enum columns: none fixed for v1. Keep `category` as text because the current read model categories are UI-oriented and may expand.

Timestamps: `created_at`, `updated_at` required.

### `operation_logs`

Purpose: internal operation history for client records.

Primary key: `id`.

Foreign keys: `client_id` references `clients.id`.

| Column | Type intent | Nullable | Read model usage |
| --- | --- | --- | --- |
| `id` | UUID/string | No | `OperationLog.id` |
| `client_id` | UUID/string | No | detail query filtering |
| `actor_name` | text | No | `actor` |
| `action_type` | `log_action_type` | No | `action` |
| `target_table` | text | Yes | audit target context |
| `target_id` | UUID/string | Yes | audit target context |
| `message` | text | No | `message` |
| `created_at` | timestamp | No | `createdAt`, `latestLogAt` |

Enum columns: `action_type`.

Timestamps: `created_at` required. `updated_at` is not required for append-only logs.

## Read Query Naming Baseline

Future Supabase read adapter functions should keep repository naming stable:

| Repository method | DB query target |
| --- | --- |
| `listClientSummaries()` | `clients` plus derived counts/existence from client-owned tables. |
| `getClientDetail(clientId)` | one `clients` row plus child rows filtered by `client_id`. |
| `getSmartOperationViews()` | derived query across `client_events`, `client_tasks`, `client_money_items`, and `client_files`. |

`smart_operation_views` is not required as a physical table for v1. If added later, it must match the existing Smart Operation Views output contract and stay template-based, not AI-based.

## Explicit v1 Exclusions

- No Supabase connection in TASK-17.
- No `@supabase/supabase-js` installation.
- No real `.env` file or real URL/key values.
- No SQL migration file in TASK-17.
- No SQL execution.
- No write feature.
- No Google Drive API connection.
- No Google Calendar API connection.
- No OpenAI API or AI employee execution.
- No Biz Money automatic collection.
- No Playwright automation.
- No external customer portal.
