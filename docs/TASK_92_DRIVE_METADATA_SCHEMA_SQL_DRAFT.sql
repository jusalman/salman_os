-- SALMAN OS Drive metadata schema draft
-- TASK-92 review-only SQL draft.
--
-- Do not execute this file until a separate SQL execution TASK is approved.
-- Do not connect to Supabase while editing this draft.
-- Do not create or edit real .env files.
-- Do not add real Google Drive credentials, service account data, URLs, or keys.
-- This draft only stores Google Drive metadata. File contents remain in Google Drive.
-- Google Drive API integration is not implemented in this task.

-- Assumption:
-- public.clients exists from the core SALMAN OS schema.
-- public.set_updated_at() exists from the core schema draft.
-- If this draft is executed standalone later, confirm those prerequisites first.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enum candidates
-- ---------------------------------------------------------------------------

do $$
begin
  create type drive_root_kind as enum ('shared_drive', 'my_drive', 'external_folder');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_folder_role as enum (
    'client_root',
    'governance',
    'client_operations',
    'sa_operations',
    'da_operations',
    'creative_assets',
    'landing_tracking',
    'reports',
    'admin_finance_legal',
    'inbox',
    'archive',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_file_status as enum (
    'active',
    'archived',
    'missing_in_drive',
    'trashed',
    'deleted'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_sync_status as enum (
    'synced',
    'pending_create',
    'pending_upload',
    'pending_move',
    'pending_archive',
    'missing_in_drive',
    'conflict',
    'error'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_sync_job_status as enum (
    'queued',
    'running',
    'completed',
    'failed',
    'cancelled'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_action_type as enum (
    'create_folder',
    'upload_file',
    'rename_file',
    'move_file',
    'archive_file',
    'sync_scan',
    'external_change_detected',
    'restore_file',
    'open_file'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type drive_read_policy as enum ('allowed', 'restricted', 'blocked');
exception
  when duplicate_object then null;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.client_drive_roots (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  drive_root_kind drive_root_kind not null default 'shared_drive',
  drive_id text,
  root_folder_id text not null,
  root_folder_name text not null,
  root_folder_path text not null,
  archive_folder_id text,
  inbox_folder_id text,
  sync_enabled boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_drive_roots_client_unique unique (client_id),
  constraint client_drive_roots_root_folder_unique unique (root_folder_id)
);

comment on table public.client_drive_roots is
  'Connects each SALMAN OS client to its Google Drive root folder metadata. File contents remain in Google Drive.';
comment on column public.client_drive_roots.drive_id is
  'Google Shared Drive ID when drive_root_kind is shared_drive.';
comment on column public.client_drive_roots.root_folder_id is
  'Google Drive folder ID for the client root folder.';
comment on column public.client_drive_roots.archive_folder_id is
  'Google Drive folder ID for the archive target. SALMAN OS prefers archive movement over deletion.';

create table if not exists public.drive_folders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_drive_root_id uuid not null references public.client_drive_roots(id) on delete cascade,
  drive_folder_id text not null,
  parent_id uuid references public.drive_folders(id) on delete set null,
  parent_drive_folder_id text,
  folder_name text not null,
  folder_path text not null,
  folder_role drive_folder_role not null default 'other',
  read_policy drive_read_policy not null default 'allowed',
  is_archive boolean not null default false,
  is_system_folder boolean not null default false,
  sync_status drive_sync_status not null default 'synced',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint drive_folders_drive_folder_unique unique (drive_folder_id),
  constraint drive_folders_client_path_unique unique (client_id, folder_path)
);

comment on table public.drive_folders is
  'Google Drive folder metadata cache for SALMAN OS customer file navigation.';
comment on column public.drive_folders.read_policy is
  'Future AI/RAG readiness marker only. SALMAN OS v1 does not execute AI/RAG reads.';
comment on column public.drive_folders.sync_status is
  'Current metadata sync status between Google Drive and Supabase cache.';

create table if not exists public.drive_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_drive_root_id uuid not null references public.client_drive_roots(id) on delete cascade,
  folder_id uuid references public.drive_folders(id) on delete set null,
  drive_file_id text not null,
  drive_folder_id text,
  file_name text not null,
  file_extension text,
  mime_type text not null,
  web_view_link text,
  web_content_link text,
  size_bytes bigint,
  checksum_md5 text,
  owner_email text,
  last_modified_at timestamptz,
  last_seen_at timestamptz,
  file_status drive_file_status not null default 'active',
  sync_status drive_sync_status not null default 'synced',
  read_policy drive_read_policy not null default 'allowed',
  archived_at timestamptz,
  archive_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint drive_files_drive_file_unique unique (drive_file_id),
  constraint drive_files_client_drive_file_unique unique (client_id, drive_file_id),
  constraint drive_files_size_nonnegative check (size_bytes is null or size_bytes >= 0)
);

comment on table public.drive_files is
  'Google Drive file metadata cache. File bytes are not stored in Supabase.';
comment on column public.drive_files.drive_file_id is
  'Google Drive file ID.';
comment on column public.drive_files.web_view_link is
  'Browser open link for the original Drive file.';
comment on column public.drive_files.file_status is
  'SALMAN OS operational file status. Prefer archived over deleted for v1.';
comment on column public.drive_files.read_policy is
  'Future AI/RAG readiness marker only. SALMAN OS v1 does not execute AI/RAG reads.';

create table if not exists public.drive_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_drive_root_id uuid not null references public.client_drive_roots(id) on delete cascade,
  requested_by_name text not null,
  job_status drive_sync_job_status not null default 'queued',
  sync_mode text not null default 'manual_full',
  started_at timestamptz,
  finished_at timestamptz,
  scanned_folder_count integer not null default 0,
  scanned_file_count integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  archived_count integer not null default 0,
  missing_count integer not null default 0,
  conflict_count integer not null default 0,
  error_count integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint drive_sync_jobs_counts_nonnegative check (
    scanned_folder_count >= 0
    and scanned_file_count >= 0
    and created_count >= 0
    and updated_count >= 0
    and archived_count >= 0
    and missing_count >= 0
    and conflict_count >= 0
    and error_count >= 0
  )
);

comment on table public.drive_sync_jobs is
  'Google Drive metadata sync job history for SALMAN OS.';
comment on column public.drive_sync_jobs.sync_mode is
  'Expected values include manual_full, manual_folder, scheduled_full, incremental, and webhook_change.';

create table if not exists public.drive_action_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_drive_root_id uuid references public.client_drive_roots(id) on delete set null,
  folder_id uuid references public.drive_folders(id) on delete set null,
  file_id uuid references public.drive_files(id) on delete set null,
  drive_folder_id text,
  drive_file_id text,
  action_type drive_action_type not null,
  actor_name text not null,
  actor_role text,
  result_status text not null default 'pending',
  before_payload jsonb not null default '{}'::jsonb,
  after_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

comment on table public.drive_action_logs is
  'Append-only audit log for Google Drive-related SALMAN OS actions.';
comment on column public.drive_action_logs.result_status is
  'Expected values include success, failed, blocked, and pending.';
comment on column public.drive_action_logs.before_payload is
  'Sanitized metadata before the action. Do not store credentials or file contents.';
comment on column public.drive_action_logs.after_payload is
  'Sanitized metadata after the action. Do not store credentials or file contents.';

-- ---------------------------------------------------------------------------
-- Index candidates
-- ---------------------------------------------------------------------------

create index if not exists client_drive_roots_client_id_idx
  on public.client_drive_roots (client_id);

create index if not exists drive_folders_client_parent_idx
  on public.drive_folders (client_id, parent_id);

create index if not exists drive_folders_client_role_idx
  on public.drive_folders (client_id, folder_role);

create index if not exists drive_folders_client_sync_status_idx
  on public.drive_folders (client_id, sync_status);

create index if not exists drive_files_client_folder_idx
  on public.drive_files (client_id, folder_id);

create index if not exists drive_files_client_file_status_idx
  on public.drive_files (client_id, file_status);

create index if not exists drive_files_client_sync_status_idx
  on public.drive_files (client_id, sync_status);

create index if not exists drive_files_client_read_policy_idx
  on public.drive_files (client_id, read_policy);

create index if not exists drive_files_last_modified_at_idx
  on public.drive_files (last_modified_at);

create index if not exists drive_files_last_seen_at_idx
  on public.drive_files (last_seen_at);

create index if not exists drive_sync_jobs_client_created_at_idx
  on public.drive_sync_jobs (client_id, created_at desc);

create index if not exists drive_sync_jobs_status_created_at_idx
  on public.drive_sync_jobs (job_status, created_at desc);

create index if not exists drive_action_logs_client_created_at_idx
  on public.drive_action_logs (client_id, created_at desc);

create index if not exists drive_action_logs_file_created_at_idx
  on public.drive_action_logs (file_id, created_at desc);

create index if not exists drive_action_logs_action_created_at_idx
  on public.drive_action_logs (action_type, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists set_client_drive_roots_updated_at on public.client_drive_roots;
create trigger set_client_drive_roots_updated_at
before update on public.client_drive_roots
for each row
execute function public.set_updated_at();

drop trigger if exists set_drive_folders_updated_at on public.drive_folders;
create trigger set_drive_folders_updated_at
before update on public.drive_folders
for each row
execute function public.set_updated_at();

drop trigger if exists set_drive_files_updated_at on public.drive_files;
create trigger set_drive_files_updated_at
before update on public.drive_files
for each row
execute function public.set_updated_at();

drop trigger if exists set_drive_sync_jobs_updated_at on public.drive_sync_jobs;
create trigger set_drive_sync_jobs_updated_at
before update on public.drive_sync_jobs
for each row
execute function public.set_updated_at();

-- drive_action_logs is append-only and intentionally has no updated_at trigger.

-- ---------------------------------------------------------------------------
-- RLS direction
-- ---------------------------------------------------------------------------

alter table public.client_drive_roots enable row level security;
alter table public.drive_folders enable row level security;
alter table public.drive_files enable row level security;
alter table public.drive_sync_jobs enable row level security;
alter table public.drive_action_logs enable row level security;

revoke all on public.client_drive_roots from anon;
revoke all on public.drive_folders from anon;
revoke all on public.drive_files from anon;
revoke all on public.drive_sync_jobs from anon;
revoke all on public.drive_action_logs from anon;

-- Intentionally omitted:
-- - anon select policies
-- - authenticated select policies
-- - write policies
-- - Google Drive write functions
--
-- Future read surface candidates:
-- public.get_client_drive_tree_v1(client_id uuid)
-- public.get_client_drive_files_v1(client_id uuid, folder_id uuid default null)
-- public.get_client_drive_sync_status_v1(client_id uuid)
--
-- Future write actions should run through a SALMAN OS backend API, not direct
-- browser-side Google Drive API calls or frontend-exposed credentials.
