# TASK-49 ClientList Production Read Surface Spec

## Purpose

SALMAN OS v1 production에서 ClientList만 읽기 위한 전용 read surface와 formal SQL draft를 정의한다.

- 문서/SQL draft only
- 실제 SQL 실행 금지
- ClientDetail/SmartViews 범위 제외

## Minimum ClientList Fields

ClientList에 필요한 최소 반환 필드:

- `id`
- `name`
- `status`
- `owner_name`
- `drive_root_url`
- `memo`
- `updated_at`
- `open_task_count`
- `upcoming_event_count`
- `has_biz_money_warning`
- `latest_log_at`
- `has_drive_folder`
- `has_looker_link`
- `has_sheet_link`

## Chosen Read Surface

최종 권장안: `view`가 아니라 `RPC`

선정 이유:

- production에서 anon base-table full read를 열지 않으려는 목표가 우선이다.
- ClientList는 여러 base table의 요약값만 필요하다.
- `view`는 v1에서 base-table 권한/RLS 경계가 덜 명확해질 수 있다.
- `RPC`는 반환 shape를 고정하고, 허용 범위를 ClientList 요약 출력으로만 제한하기 쉽다.

Production read surface 이름:

- `public.get_client_list_summaries_v1()`

## Anon Allowed vs Forbidden

Anon allowed:

- `execute` on `public.get_client_list_summaries_v1()`

Anon forbidden:

- direct select on `public.clients`
- direct select on `public.client_members`
- direct select on `public.client_tasks`
- direct select on `public.client_events`
- direct select on `public.client_files`
- direct select on `public.client_money_items`
- direct select on `public.client_links`
- direct select on `public.operation_logs`

## SQL Draft

```sql
-- TASK-49 review-only SQL draft
-- Do not execute in this task

-- ---------------------------------------------------------------------------
-- 1) Remove temporary smoke-test policy
-- ---------------------------------------------------------------------------

drop policy if exists smoke_test_read_test_client_only on public.clients;

-- ---------------------------------------------------------------------------
-- 2) Keep base tables out of anon direct read scope
-- ---------------------------------------------------------------------------

revoke all on public.clients from anon;
revoke all on public.client_members from anon;
revoke all on public.client_tasks from anon;
revoke all on public.client_events from anon;
revoke all on public.client_files from anon;
revoke all on public.client_money_items from anon;
revoke all on public.client_links from anon;
revoke all on public.operation_logs from anon;

alter table public.clients enable row level security;
alter table public.client_members enable row level security;
alter table public.client_tasks enable row level security;
alter table public.client_events enable row level security;
alter table public.client_files enable row level security;
alter table public.client_money_items enable row level security;
alter table public.client_links enable row level security;
alter table public.operation_logs enable row level security;

-- Intentionally do not add anon select policies to the base tables here.

-- ---------------------------------------------------------------------------
-- 3) Formal ClientList-only RPC
-- ---------------------------------------------------------------------------

create or replace function public.get_client_list_summaries_v1()
returns table (
  id uuid,
  name text,
  status client_status,
  owner_name text,
  drive_root_url text,
  memo text,
  updated_at timestamptz,
  open_task_count bigint,
  upcoming_event_count bigint,
  has_biz_money_warning boolean,
  latest_log_at timestamptz,
  has_drive_folder boolean,
  has_looker_link boolean,
  has_sheet_link boolean
)
language sql
security definer
set search_path = public
as $$
  with primary_members as (
    select
      client_id,
      max(staff_name) as primary_owner_name
    from public.client_members
    where is_primary = true
      and is_active = true
    group by client_id
  ),
  task_counts as (
    select
      client_id,
      count(*)::bigint as open_task_count
    from public.client_tasks
    where status in ('todo', 'in_progress', 'blocked')
    group by client_id
  ),
  event_counts as (
    select
      client_id,
      count(*)::bigint as upcoming_event_count
    from public.client_events
    where status = 'scheduled'
    group by client_id
  ),
  money_flags as (
    select
      client_id,
      bool_or(status <> 'normal') as has_biz_money_warning
    from public.client_money_items
    group by client_id
  ),
  latest_logs as (
    select
      client_id,
      max(created_at) as latest_log_at
    from public.operation_logs
    group by client_id
  ),
  drive_flags as (
    select
      client_id,
      bool_or(coalesce(nullif(trim(drive_folder_path), ''), '') <> '') as has_drive_folder_from_files
    from public.client_files
    where archived_at is null
      and file_category <> 'archive'
    group by client_id
  ),
  link_flags as (
    select
      client_id,
      bool_or(
        lower(title) like '%looker%'
        or lower(url) like '%lookerstudio.google.com%'
      ) as has_looker_link,
      bool_or(
        lower(title) like '%sheet%'
        or lower(url) like '%docs.google.com/spreadsheets%'
      ) as has_sheet_link
    from public.client_links
    group by client_id
  )
  select
    c.id,
    c.name,
    c.status,
    coalesce(pm.primary_owner_name, c.owner_name) as owner_name,
    c.drive_root_url,
    c.memo,
    c.updated_at,
    coalesce(tc.open_task_count, 0) as open_task_count,
    coalesce(ec.upcoming_event_count, 0) as upcoming_event_count,
    coalesce(mf.has_biz_money_warning, false) as has_biz_money_warning,
    ll.latest_log_at,
    (
      coalesce(nullif(trim(c.drive_root_url), ''), '') <> ''
      or coalesce(df.has_drive_folder_from_files, false)
    ) as has_drive_folder,
    coalesce(lf.has_looker_link, false) as has_looker_link,
    coalesce(lf.has_sheet_link, false) as has_sheet_link
  from public.clients c
  left join primary_members pm on pm.client_id = c.id
  left join task_counts tc on tc.client_id = c.id
  left join event_counts ec on ec.client_id = c.id
  left join money_flags mf on mf.client_id = c.id
  left join latest_logs ll on ll.client_id = c.id
  left join drive_flags df on df.client_id = c.id
  left join link_flags lf on lf.client_id = c.id
  order by c.updated_at desc;
$$;

revoke all on function public.get_client_list_summaries_v1() from public;
grant execute on function public.get_client_list_summaries_v1() to anon;
grant execute on function public.get_client_list_summaries_v1() to authenticated;
```

## Notes

- 이 RPC는 ClientList summary shape만 노출한다.
- raw task/event/file/link/log row는 anon에 직접 노출하지 않는다.
- `memo`는 현재 포함했지만, production 최종 승인 전 노출 적정성을 다시 검토해야 한다.
- `upcoming_event_count`는 현재 앱 요약과 맞추려면 후속 TASK에서 기준일(on/after reference date) 정렬 여부를 추가 검토해야 한다.

## Next Step

- 후속 TASK에서 frontend Supabase ClientList adapter를 base-table reader 대신 `get_client_list_summaries_v1()` 호출로 전환하는 설계 검토
