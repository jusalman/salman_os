# SALMAN OS Handoff

## Current Status

- Current task state: TASK-35 completed.
- Current write phase: TASK-35 Supabase ClientListRepository adapter plan.
- Next task: TASK-36 implement fake-reader-tested Supabase ClientListRepository behind the placeholder boundary.
- Supabase schema SQL was manually executed by the user in Supabase SQL Editor.
- SQL Editor result: `Success. No rows returned`.
- Table Editor confirmed the 8 core tables: `client_events`, `client_files`, `client_links`, `client_members`, `client_money_items`, `client_tasks`, `clients`, `operation_logs`.
- The app has a Supabase browser client foundation, but runtime still defaults to mock data.
- TASK-32 documented DB enum to UI read model mapping and ClientSummary adapter planning.
- TASK-33 added pure Supabase mapper helpers and Node test coverage without activating the Supabase app data source.
- TASK-34 fixed `upcomingEventCount` as scheduled events on/after the injected reference date and added pure ClientSummary row assembly tests.
- TASK-35 planned the first Supabase ClientListRepository adapter boundary and kept runtime selection placeholder-only.
- No real `.env` or `.env.local` file exists or should be created without explicit approval.
- `@supabase/supabase-js` is installed for the browser client foundation.
- No additional SQL should be executed without a separate approved TASK.
- Development Harness remains active: plan first, get approval, keep diffs small, verify, then record outcomes in Handoff.

## Completed Work Summary

- TASK-00: SALMAN OS project baseline and MVP direction established.
- TASK-01: Product scope fixed as an internal staff customer operation center.
- TASK-02: v1 exclusions separated from v1.5+ candidates.
- TASK-03: Google Drive role defined as original file storage.
- TASK-04: Supabase role defined as operational data source.
- TASK-05: Internal login rule defined as shared password `salman1!` plus staff name.
- TASK-06: Customer list and customer operation center screen direction documented.
- TASK-07: Core panels documented for files, tasks, internal schedule, business money, links, and logs.
- TASK-08: v1 calendar wording locked to Supabase-based internal schedule management.
- TASK-09: Smart Operation Views defined as template-based, not AI execution.
- TASK-10: `99_Archive` policy documented for file archival instead of deletion.
- TASK-11: AI employee functionality kept as v1.5+ only.
- TASK-12: Google Calendar integration excluded from v1.
- TASK-13: Playwright automation excluded from v1.
- TASK-14: OpenAI API integration excluded from v1.
- TASK-15: External customer portal excluded from v1.
- TASK-16: Supabase read adapter preparation documented without real connection.
- TASK-17: Supabase naming conventions and read mapping documented as preparation for SQL drafting.
- TASK-18: Review-only Supabase schema SQL draft created at `docs/SUPABASE_SCHEMA_DRAFT.sql`.
- TASK-19: SQL draft reviewed against schema, naming conventions, and read mapping without execution.
- TASK-20: SQL draft revised with operation log access metadata, client file type metadata, clearer archive/restore notes, and SQL execution review TODOs.
- TASK-21: Migration readiness plan completed; remaining decisions identified before SQL execution.
- TASK-22: SQL draft refined as a migration-ready candidate with `event_status`, `client_events.status`, enum re-run notes, pgcrypto checks, and RLS/Auth execution guardrails.
- TASK-23: Final SQL execution review plan completed without modifying SQL or connecting Supabase.
- TASK-24: Execution candidate SQL file created at `docs/migrations/2026-05-13_initial_schema_candidate.sql` with duplicate_object enum guards and final execution review notes.
- TASK-25: SQL execution approval plan documented manual execution, success checks, failure stop rules, and rollback/retry guidance.
- TASK-26: User manually executed `docs/migrations/2026-05-13_initial_schema_candidate.sql` in Supabase SQL Editor and reported `Success. No rows returned`.
- TASK-27: User confirmed the 8 core tables in Supabase Table Editor; execution result recorded in this handoff.
- TASK-28: Supabase read adapter preparation plan defined schema verification checks before app connection.
- TASK-29: Schema verification guide provided read-only SQL checks for tables, columns, enums, FK, indexes, triggers, and functions.
- TASK-30: Schema verification results reviewed; read adapter prerequisites were acceptable with mapping conversion still required.
- TASK-31: Installed `@supabase/supabase-js`, added browser client foundation, and added a read-only `clients` table adapter draft without switching the app from mock data.
- TASK-32: Planned Supabase read adapter mapping in `docs/SUPABASE_READ_ADAPTER_MAPPING.md` and `docs/TASK_32_READ_ADAPTER_PLAN.md`; no code, env, SQL, or real data activation changes were made.
- TASK-33: Implemented pure mapper helpers in `src/data/adapters/supabase/mappers.ts` and tests in `tests/supabase/mappers.test.ts`; `VITE_DATA_SOURCE=supabase` remains placeholder-only.
- TASK-34: Documented ClientSummary assembly in `docs/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md` and added pure assembly helpers/tests without connecting Supabase queries.
- TASK-35: Documented the first Supabase ClientListRepository adapter plan in `docs/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md`; no code activation, env, SQL, or UI changes were made.

## Next Work

Implement the first Supabase `ClientListRepository` read adapter with fake row-reader tests, behind the placeholder boundary, without adding write workflows, changing UI behavior, or activating the real Supabase data source by default.

Use these documents first:

- `MVP_SCOPE_LOCK.md`
- `DATABASE_SCHEMA.md`
- `SUPABASE_NAMING_CONVENTIONS.md`
- `SUPABASE_READ_MAPPING.md`
- `AGENTS.md`
- `docs/CODEX_OPERATING_PROTOCOL.md`
- `docs/SUPABASE_SCHEMA_DRAFT.sql`
- `docs/migrations/2026-05-13_initial_schema_candidate.sql`

`upcomingEventCount` is now defined as `scheduled` events whose `event_date` is on/after the injected SALMAN OS reference date.
Use `docs/SUPABASE_READ_ADAPTER_MAPPING.md` for DB enum to UI model conversion and `docs/TASK_32_READ_ADAPTER_PLAN.md` for the implementation/test sequence.
Use `docs/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md` for ClientSummary row assembly rules.
Use `docs/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md` for repository boundary, query row shapes, and TASK-36 test strategy.
The next phase should not create real `.env` values, execute additional SQL, add write workflows, switch the whole app to real data, or change UI behavior unless the user explicitly approves that later task.
Any follow-up should follow the Development Harness in `docs/CODEX_OPERATING_PROTOCOL.md` before changes begin.

## Prohibited Until Explicit Approval

- Supabase 실제 연결 금지
- 실제 `.env` 생성 금지
- 실제 URL/KEY 입력 금지
- SQL 실행 금지
- Google Drive API 연결 금지
- Google Calendar API 연결 금지
- OpenAI API 연결 금지
- Playwright 자동화 금지
- 외부 고객 포털 금지
- `@supabase/supabase-js` 설치 금지
- `src`, `public`, `package.json` 수정 금지 unless explicitly requested

## Recommended Model

- TASK-18 recommended model: gpt-5.5 High.
- If gpt-5.5 capacity is unavailable, use gpt-5.4 High.

## Resume Commands

```powershell
git status
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts
npm.cmd run lint
npm.cmd run build
```

## Verification Notes

Run verification after documentation or schema draft changes when feasible:

```powershell
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts
npm.cmd run lint
npm.cmd run build
```

If verification fails, record the exact failing command and reason before continuing.
