# TASK-48 Formal v1 Supabase Read RLS Policy Plan

## Purpose

This document defines the formal SALMAN OS v1 read RLS direction that should replace the temporary smoke-test policy.

- Documentation and SQL draft only
- No SQL execution in this task
- No DB change in this task

## Current Temporary Policy Limits

Current state:

- `smoke_test_read_test_client_only` proved the anon-key ClientList smoke path.
- It is useful for local/dev verification only.

Limits:

- test data name match based
- not a stable v1 access rule
- does not define related-table boundaries
- does not protect production scope decisions
- shared password UI is not a DB security layer

## v1 Anon Read Risk Summary

- `clients`: medium risk
- `client_members`: medium risk
- `client_tasks`: high risk
- `client_events`: high risk
- `client_files`: high risk
- `client_money_items`: high risk
- `client_links`: medium/high risk
- `operation_logs`: high risk

Conclusion:

- production anon full read on base tables is not recommended
- ClientList read scope must stay narrower than future ClientDetail/SmartViews scope

## ClientList Read Scope Needed In v1

ClientList currently depends on these read surfaces:

- `clients`
- `client_members`
- `client_tasks`
- `client_events`
- `client_files`
- `client_money_items`
- `client_links`
- `operation_logs`

But the UI needs only summary outputs, not full raw row exposure.

## Recommended v1 Direction

1. Keep `smoke_test_read_test_client_only` temporary and non-production.
2. Do not open anon full read on all base tables for production.
3. Split local/dev smoke-test policy from formal production policy.
4. For production, prefer a dedicated ClientList-only read surface such as a reviewed view or RPC that returns summary-safe fields only.
5. Keep ClientDetail and SmartViews outside production anon read scope until a separate approved security/task decision.

## Review-Only SQL Draft

### A. Local/dev smoke-test only

```sql
-- Local/dev smoke-test only.
-- Do not treat as production policy.

alter table public.clients enable row level security;

create policy smoke_test_read_test_client_only
on public.clients
for select
to anon
using (name = '테스트 고객사');
```

### B. Production direction skeleton

```sql
-- Production direction only.
-- Do not execute in TASK-48.
-- Prefer a narrow ClientList read surface over anon full-table read.

-- Example shape:
-- create view public.client_list_read_model as
-- select ...
-- from public.clients
-- left join ...
-- ;

-- Then review anon select policy on that read surface only.
```

## Non-Recommendations

- no frontend `service_role`
- no reliance on shared password as DB auth
- no production anon full read on `client_tasks`, `client_events`, `client_files`, `client_money_items`, `operation_logs`
- no ClientDetail/SmartViews policy expansion in this task

## Next Decision

- whether `clients.memo` is safe for production ClientList exposure
- whether the first formal production read surface will be a dedicated view/RPC

Recommended next step:

- design the dedicated ClientList production read surface and its formal RLS draft
