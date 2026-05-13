-- SALMAN OS initial Supabase schema execution candidate
-- TASK-24 candidate file.
--
-- This file is an execution candidate for Supabase SQL Editor review.
-- It has not been executed.
-- Supabase SQL Editor execution is allowed only after explicit user approval.
-- Review against a new Supabase project or empty schema before execution.
-- Do not create a real .env file or enter real URL/key values for this task.
-- SALMAN OS v1 is read-first; write workflows are separate future TASKs.
-- RLS/Auth are not implemented in v1. RLS policy SQL is intentionally omitted.

-- UUID generation candidate.
-- Supabase/Postgres commonly supports gen_random_uuid() through pgcrypto.
-- Confirm pgcrypto availability in the target Supabase project before execution.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- Source of truth: SUPABASE_NAMING_CONVENTIONS.md
--
-- create type is not idempotent in PostgreSQL. These blocks reduce duplicate
-- type failures if this candidate is re-run during review. They do not make
-- table/trigger/index creation fully idempotent.
-- ---------------------------------------------------------------------------

do $$
begin
  create type client_status as enum ('pending', 'active', 'ended');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type service_type as enum ('sa', 'da', 'sa_da');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type task_status as enum ('todo', 'in_progress', 'done', 'blocked');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type task_priority as enum ('low', 'medium', 'high', 'urgent');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type event_status as enum ('scheduled', 'done', 'canceled', 'archived');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type event_type as enum (
    'meeting',
    'deadline',
    'campaign',
    'report',
    'biz_money',
    'creative',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type file_category as enum (
    'common',
    'sa',
    'da',
    'report',
    'contract',
    'meeting_note',
    'creative',
    'archive',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type money_status as enum ('normal', 'warning', 'low', 'empty');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type log_action_type as enum (
    'create',
    'update',
    'archive',
    'restore',
    'view',
    'link_open',
    'login',
    'memo'
  );
exception
  when duplicate_object then null;
end;
$$;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status client_status not null default 'pending',
  service_type service_type not null,
  owner_name text not null,
  drive_root_url text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ended_at timestamptz
);

comment on table clients is
  'SALMAN OS client master records. v1 is an internal staff MVP.';
comment on column clients.drive_root_url is
  'Google Drive root URL reference only. SALMAN OS v1 does not call Google Drive API.';

create table client_members (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  staff_name text not null,
  role text not null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_members is
  'Internal staff assignments per client. v1 uses display names, not per-user auth.';

create table client_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  file_name text not null,
  file_category file_category not null default 'common',
  file_type text not null default 'other',
  drive_url text not null,
  drive_folder_path text,
  uploaded_by_name text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_files is
  'Google Drive original file metadata and original URLs only. File contents remain in Google Drive.';
comment on column client_files.file_category is
  'Operational file grouping. Use archive category with archived_at for 99_Archive policy.';
comment on column client_files.file_type is
  'Display/file metadata type from Google Drive context, for example doc, sheet, slide, pdf, image, or other. This is metadata only.';
comment on column client_files.archived_at is
  'Set when a file is archived according to the 99_Archive policy. Permanent deletion is outside v1.';

create table client_tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  title text not null,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  due_date date,
  assignee_name text,
  related_file_id uuid references client_files(id) on delete set null,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_tasks is
  'Internal client operation tasks. v1 schema is read-first; write workflows are separate TASKs.';

create table client_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  title text not null,
  status event_status not null default 'scheduled',
  event_type event_type not null default 'other',
  event_date date not null,
  start_time time,
  end_time time,
  owner_name text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_events is
  'Supabase-backed internal schedule data. This is not Google Calendar integration and does not create customer Google Calendars.';
comment on column client_events.status is
  'Internal schedule state for read filters such as upcoming, done, canceled, and archived. This is not Google Calendar status.';

create table client_money_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  title text not null,
  url text,
  status money_status not null default 'normal',
  last_checked_at timestamptz,
  checked_by_name text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_money_items is
  'Manual Biz Money status records and reference links. v1 does not automatically collect Biz Money data.';

create table client_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  title text not null,
  url text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table client_links is
  'Client reference links such as Drive, admin, report, and external URLs. API integrations are outside v1.';

create table operation_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  actor_name text not null,
  ip_address inet,
  user_agent text,
  action_type log_action_type not null,
  target_table text,
  target_id uuid,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table operation_logs is
  'Append-only internal operation history. Archive, restore, login, and other staff actions should be recorded here.';
comment on column operation_logs.ip_address is
  'Nullable connection metadata for login/access logs. Privacy/security policy must be reviewed before production use.';
comment on column operation_logs.user_agent is
  'Nullable browser/client metadata for login/access logs. Privacy/security policy must be reviewed before production use.';

-- ---------------------------------------------------------------------------
-- Archive / restore policy notes
-- ---------------------------------------------------------------------------

-- SALMAN OS v1 does not permanently delete operational files by default.
-- Archived files should be represented in client_files with file_category='archive'
-- and/or archived_at set, while the source file is expected to be moved to a
-- Google Drive 99_Archive location by a separate adapter/write workflow.
--
-- This schema candidate stores archive state and operation_logs history only.
-- Actual Google Drive move/delete behavior is outside this SQL candidate and
-- must be handled in a later approved TASK. Restore behavior should likewise be
-- a separate write workflow and recorded with operation_logs.action_type='restore'.

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger set_clients_updated_at
before update on clients
for each row execute function set_updated_at();

create trigger set_client_members_updated_at
before update on client_members
for each row execute function set_updated_at();

create trigger set_client_files_updated_at
before update on client_files
for each row execute function set_updated_at();

create trigger set_client_tasks_updated_at
before update on client_tasks
for each row execute function set_updated_at();

create trigger set_client_events_updated_at
before update on client_events
for each row execute function set_updated_at();

create trigger set_client_money_items_updated_at
before update on client_money_items
for each row execute function set_updated_at();

create trigger set_client_links_updated_at
before update on client_links
for each row execute function set_updated_at();

-- operation_logs intentionally has no updated_at trigger because logs are append-only.

-- ---------------------------------------------------------------------------
-- Indexes for read-first repository queries
-- ---------------------------------------------------------------------------

create index idx_client_members_client_id on client_members(client_id);
create index idx_client_members_primary on client_members(client_id, is_primary) where is_active = true;

create index idx_client_files_client_id on client_files(client_id);
create index idx_client_files_archive on client_files(client_id, file_category, archived_at);

create index idx_client_tasks_client_id on client_tasks(client_id);
create index idx_client_tasks_status_priority on client_tasks(client_id, status, priority);
create index idx_client_tasks_due_date on client_tasks(client_id, due_date);

create index idx_client_events_client_id on client_events(client_id);
create index idx_client_events_date_status_type on client_events(client_id, event_date, status, event_type);

create index idx_client_money_items_client_id on client_money_items(client_id);
create index idx_client_money_items_status on client_money_items(client_id, status);

create index idx_client_links_client_id on client_links(client_id);
create index idx_client_links_category on client_links(client_id, category);

create index idx_operation_logs_client_id on operation_logs(client_id);
create index idx_operation_logs_created_at on operation_logs(client_id, created_at desc);
create index idx_operation_logs_action_type on operation_logs(client_id, action_type, created_at desc);
create index idx_operation_logs_target on operation_logs(target_table, target_id);

-- ---------------------------------------------------------------------------
-- Future RLS/Auth notes
-- ---------------------------------------------------------------------------

-- RLS/Auth are intentionally not implemented in SALMAN OS v1.
-- Future RLS should use client_id as the data isolation boundary for all
-- client-owned tables:
--
-- - client_members
-- - client_files
-- - client_tasks
-- - client_events
-- - client_money_items
-- - client_links
-- - operation_logs
--
-- clients has no client_id because it is the client master table.
-- Future Auth/RLS work must be handled in a separate TASK after the v1 read
-- adapter and write workflow boundaries are approved. Do not add RLS policy SQL
-- to this v1 execution candidate without a separate plan and approval.

-- ---------------------------------------------------------------------------
-- v1 explicit exclusions
-- ---------------------------------------------------------------------------

-- This schema does not implement:
-- - Google Calendar integration or customer Google Calendar creation.
-- - Google Drive API integration or actual Drive file movement.
-- - OpenAI API integration or AI employee execution.
-- - Playwright automation.
-- - External customer portal features.
-- - Biz Money automatic collection.

-- ---------------------------------------------------------------------------
-- SQL execution review TODO
-- ---------------------------------------------------------------------------

-- Before this candidate is executed, confirm:
--
-- - The target is a new Supabase project or empty schema.
-- - No existing enum/table/function/trigger/index conflicts with this file.
-- - pgcrypto/gen_random_uuid() is available in the target Supabase project.
--   If not, choose an approved UUID strategy before executing this schema.
-- - duplicate_object enum blocks are acceptable for the final execution method.
-- - client_events.status values are correct for scheduled/done/canceled/archived reads.
-- - The privacy/security policy for storing operation_logs.ip_address and
--   operation_logs.user_agent before operational collection is enabled.
-- - The boundary between client_files.file_category as operational grouping and
--   client_files.file_type as display/file metadata.
-- - The separate TASK scope for Auth/RLS design and policy SQL.
