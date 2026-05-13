-- SALMAN OS Supabase schema draft
-- TASK-18 review draft only.
--
-- Do not execute this file during TASK-18.
-- Do not connect to Supabase during TASK-18.
-- Do not create a real .env file or enter real URL/key values.
-- SALMAN OS v1 is read-first; write workflows are separate future TASKs.
-- RLS/Auth are not implemented in v1. RLS policy SQL is intentionally omitted.

-- UUID generation for draft schema review.
-- Supabase/Postgres commonly supports gen_random_uuid() through pgcrypto.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- Source of truth: SUPABASE_NAMING_CONVENTIONS.md
-- ---------------------------------------------------------------------------

create type client_status as enum ('pending', 'active', 'ended');
create type service_type as enum ('sa', 'da', 'sa_da');
create type task_status as enum ('todo', 'in_progress', 'done', 'blocked');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');
create type event_type as enum (
  'meeting',
  'deadline',
  'campaign',
  'report',
  'biz_money',
  'creative',
  'other'
);
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
create type money_status as enum ('normal', 'warning', 'low', 'empty');
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
  'Use archive category with archived_at for 99_Archive policy. Permanent deletion is outside v1.';
comment on column client_files.archived_at is
  'Set when a file is archived according to the 99_Archive policy. Restore behavior belongs to a later write workflow.';

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
  action_type log_action_type not null,
  target_table text,
  target_id uuid,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table operation_logs is
  'Append-only internal operation history. Archive and restore actions should be recorded here.';

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
create index idx_client_events_date_type on client_events(client_id, event_date, event_type);

create index idx_client_money_items_client_id on client_money_items(client_id);
create index idx_client_money_items_status on client_money_items(client_id, status);

create index idx_client_links_client_id on client_links(client_id);
create index idx_client_links_category on client_links(client_id, category);

create index idx_operation_logs_client_id on operation_logs(client_id);
create index idx_operation_logs_created_at on operation_logs(client_id, created_at desc);
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
-- adapter and write workflow boundaries are approved.
