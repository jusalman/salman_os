# TASK-55 RLS Cleanup And Production Order

## Purpose

This document plans the cleanup of the temporary SALMAN OS v1 smoke-test RLS policy and the production ClientList RPC read rollout order.

- SQL draft only
- Do not execute SQL in this task
- Do not modify Supabase DB in this task
- Do not use `service_role` in frontend

## Current Decision

`smoke_test_read_test_client_only` was useful only to prove the anon-key ClientList smoke path with one test client.

It must be removed before treating the read path as production-ready because it is a temporary base-table `clients` SELECT policy, not the formal SALMAN OS v1 production read rule.

Production ClientList read stays on:

- `public.get_client_list_summaries_v1()`

Production anon access rule:

- allow anon `execute` on `public.get_client_list_summaries_v1()`
- do not allow anon direct `select` on base table `public.clients`
- do not open anon base-table full read for ClientDetail, SmartViews, Ads, RAG, Calendar, or related raw operation tables

## Review-Only SQL Draft

```sql
-- TASK-55 review-only SQL draft
-- Do not execute in this task.

-- ---------------------------------------------------------------------------
-- 1) Confirm the production ClientList RPC exists
-- ---------------------------------------------------------------------------

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'get_client_list_summaries_v1';

-- ---------------------------------------------------------------------------
-- 2) Confirm the RPC returns the expected ClientList summary shape
-- ---------------------------------------------------------------------------

select *
from public.get_client_list_summaries_v1()
limit 5;

-- ---------------------------------------------------------------------------
-- 3) Confirm anon execute grant on the RPC
-- ---------------------------------------------------------------------------

select
  has_function_privilege(
    'anon',
    'public.get_client_list_summaries_v1()',
    'EXECUTE'
  ) as anon_can_execute_client_list_rpc;

-- ---------------------------------------------------------------------------
-- 4) Remove the temporary smoke-test base-table policy
-- ---------------------------------------------------------------------------

drop policy if exists smoke_test_read_test_client_only on public.clients;

-- Keep RLS enabled and intentionally do not add anon SELECT policy to clients.
alter table public.clients enable row level security;

-- Optional verification: anon should not have direct table SELECT.
select
  has_table_privilege('anon', 'public.clients', 'SELECT') as anon_can_select_clients_base_table;

-- ---------------------------------------------------------------------------
-- 5) Reload PostgREST schema cache after function/policy/grant changes
-- ---------------------------------------------------------------------------

notify pgrst, 'reload schema';
```

## Production Rollout Order

1. Confirm `public.get_client_list_summaries_v1()` exists.
2. Confirm the RPC returns the expected ClientList summary result.
3. Confirm anon has `execute` permission on the RPC.
4. Remove `smoke_test_read_test_client_only` from `public.clients`.
5. Reload the PostgREST schema cache.
6. Re-run the ClientList RPC smoke test and confirm one test client is still returned through the RPC path.

## Stop Rules

- Stop if the RPC is missing.
- Stop if the RPC result shape does not match ClientList summary expectations.
- Stop if anon execute permission is missing.
- Stop if the ClientList RPC smoke test falls back to mock data.
- Do not proceed by opening anon base-table `clients` SELECT as a production shortcut.
