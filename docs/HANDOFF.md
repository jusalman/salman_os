# SALMAN OS Handoff

## Current Status

- Current task state: TASK-18 completed.
- Current write phase: TASK-18 Supabase schema SQL draft documentation.
- Next task: review the TASK-18 SQL draft before any migration, connection, or adapter work.
- Supabase is not connected.
- No real `.env` file exists or should be created for this phase.
- No SQL should be executed.
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

## Next Work

Review `docs/SUPABASE_SCHEMA_DRAFT.sql` before creating any migration, connecting Supabase, or implementing an adapter.

Use these documents first:

- `MVP_SCOPE_LOCK.md`
- `DATABASE_SCHEMA.md`
- `SUPABASE_NAMING_CONVENTIONS.md`
- `SUPABASE_READ_MAPPING.md`
- `AGENTS.md`
- `docs/CODEX_OPERATING_PROTOCOL.md`
- `docs/SUPABASE_SCHEMA_DRAFT.sql`

The next phase should not connect to Supabase or execute SQL unless the user explicitly approves that later task.
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
npm.cmd run lint
npm.cmd run build
```

## Verification Notes

Run verification after documentation or schema draft changes when feasible:

```powershell
npm.cmd run lint
npm.cmd run build
```

If verification fails, record the exact failing command and reason before continuing.
