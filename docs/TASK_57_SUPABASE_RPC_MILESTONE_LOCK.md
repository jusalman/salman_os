# TASK-57 Supabase RPC Milestone Lock

## Purpose

Lock the current SALMAN OS v1 Supabase ClientList RPC read milestone before starting the next feature task.

This is documentation only.

- No SQL execution
- No `.env.local` edits
- No runtime behavior changes
- No new feature implementation

## Confirmed Current State

- ClientList production read path is `public.get_client_list_summaries_v1()`.
- TASK-56 confirmed the RPC path returned 1 row including `테스트 고객사`.
- The temporary smoke-test RLS policy `smoke_test_read_test_client_only` was manually removed after TASK-55.
- Anon base-table `clients` SELECT is not opened as the production read strategy.
- No silent mock fallback occurred during the RPC smoke verification.
- ClientDetail and SmartViews remain strict placeholders.
- Default mock path remains safe unless Supabase read activation is explicitly set.

## Current Operating Baseline

- SALMAN OS v1 ClientList can use the RPC read surface when the approved activation gate is set.
- Production ClientList read should stay RPC-based, not base-table-read-based.
- Frontend must continue using anon key only.
- `service_role` must not be exposed to frontend code or local client runtime.
- Further Supabase DB changes require a separate approved task.

## Next Allowed Directions

- ClientDetail read adapter planning.
- Ads module planning.
- UI/dashboard refinement.

Each direction should be handled as a separate task with its own scope, verification, and rollback notes.

## Forbidden Next-Step Mistakes

- Do not open anon base-table full read to speed up later features.
- Do not expose or use `service_role` in frontend code.
- Do not change schema without explicit approval.
- Do not mix Ads, RAG, and ClientDetail in one task.
- Do not treat ClientDetail or SmartViews as production-ready until their read surfaces are separately planned and approved.
- Do not use the removed smoke-test policy as a production precedent.

## Milestone Result

The Supabase ClientList RPC read milestone is locked as the current stable boundary.

Next work should start from this baseline rather than reopening the temporary smoke-test RLS approach.
