# TASK-53 ClientList RPC SQL

아래 SQL은 Supabase SQL Editor에서 `public.get_client_list_summaries_v1()`를 수동 생성/교체하기 위한 최종 실행본이다.

- 이 TASK에서는 실행하지 않는다.
- 시크릿은 포함하지 않는다.
- ClientList `ClientSummary`에 필요한 필드만 반환한다.

```sql
-- SALMAN OS v1 ClientList RPC
-- Manual SQL Editor execution only

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

확인 포인트:

- RPC 응답 필드는 현재 `mapClientSummaryFromRpcRow` 기대값과 일치한다.
- `create or replace function`을 사용하므로 동일 시그니처 함수는 안전하게 교체 가능하다.
- 이 SQL은 임시 smoke-test policy 제거를 포함하지 않는다. 해당 정리는 별도 승인 SQL 단계에서 수행한다.
