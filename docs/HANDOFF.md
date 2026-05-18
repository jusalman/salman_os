# SALMAN OS Handoff

## Current Status

- Current task state: TASK-44 DESIGN.md inspired premium Salman OS theme applied to login and empty state.
- Current task state: TASK-45 removed Supabase CLI temp files from git tracking and ignored `supabase/.temp/`.
- Current task state: TASK-46 prepared review-only minimal ClientList seed SQL for one test client.
- Current task state: TASK-47 re-ran ClientList smoke test; live Supabase read still returned empty and did not show `테스트 고객사`.
- Current task state: TASK-47 retry re-ran ClientList smoke test after manual seed insert; live Supabase read still returned empty and did not show `테스트 고객사`.
- Current task state: TASK-47 retry re-ran ClientList smoke test after the anon read policy fix; live Supabase read loaded 1 client and returned `테스트 고객사`.
- Current task state: TASK-48 documented the formal v1 Supabase read RLS direction and kept the current smoke-test policy temporary-only.
- Current task state: TASK-49 specified the production ClientList read surface as a formal RPC, not a direct base-table or view read.
- Current task state: TASK-50 documented the ClientList adapter migration plan from base-table reads to the formal RPC read surface without changing runtime behavior.
- Current task state: TASK-51 added ClientList RPC row typing, mapper, fake reader boundary, and unit tests without activating the RPC runtime path.
- Current task state: TASK-52 wired the ClientList RPC repository behind the existing activation gate while keeping mock as default and Detail/SmartViews as placeholders.
- Current task state: TASK-53 prepared the executable manual SQL for `public.get_client_list_summaries_v1()` to support the activated ClientList RPC path.
- Current task state: TASK-54 re-ran the ClientList RPC smoke test; the RPC path failed because `public.get_client_list_summaries_v1()` was not found in the PostgREST schema cache.
- Current task state: TASK-54 retry re-ran the ClientList RPC smoke test after schema cache reload; the RPC path loaded 1 row and returned `테스트 고객사`.
- Current task state: TASK-55 planned removal of the temporary `smoke_test_read_test_client_only` policy and documented the production ClientList RPC RLS rollout order without executing SQL.
- Current task state: TASK-56 verified the ClientList RPC read after the user manually removed `smoke_test_read_test_client_only`; the RPC path still returned `테스트 고객사` with no silent mock fallback.
- Current task state: TASK-57 locked the Supabase ClientList RPC read milestone as the stable baseline before next feature work.
- Current task state: TASK-58 polished visible Korean UI copy for login, ClientList, workspace headers, and core panels without changing Supabase/RLS/RPC behavior.
- Current task state: TASK-59 planned the Ads module v1 scope and data flow without implementing Ads UI, Google Sheets integration, SQL, or Supabase/RLS/RPC changes.
- Current task state: TASK-60 planned the Ads module screen structure, navigation placement, tab placeholders, and implementation order without implementing Ads UI.
- Current task state: TASK-61 added the `광고 운영` top-level workspace placeholder UI with five Ads v1 tabs and no Google Sheets, audit, report, Supabase, RLS, or RPC changes.
- Current task state: TASK-62 planned the read-only Ads Google Sheets connector structure without implementing Google Sheets API, credentials, metrics, audit, report generation, or Supabase/RLS/RPC changes.
- Current task state: TASK-63 planned the Ads mock view model and UI data contract without implementing Google Sheets API, UI data wiring, metrics, audit, report generation, or Supabase/RLS/RPC changes.
- Current write phase: TASK-44 closed.
- Next task: Wait for the next approved task.
- Supabase schema SQL was manually executed by the user in Supabase SQL Editor.
- SQL Editor result: `Success. No rows returned`.
- Table Editor confirmed the 8 core tables: `client_events`, `client_files`, `client_links`, `client_members`, `client_money_items`, `client_tasks`, `clients`, `operation_logs`.
- The app has a Supabase browser client foundation, but runtime still defaults to mock data.
- TASK-32 documented DB enum to UI read model mapping and ClientSummary adapter planning.
- TASK-33 added pure Supabase mapper helpers and Node test coverage without activating the Supabase app data source.
- TASK-34 fixed `upcomingEventCount` as scheduled events on/after the injected reference date and added pure ClientSummary row assembly tests.
- TASK-35 planned the first Supabase ClientListRepository adapter boundary and kept runtime selection placeholder-only.
- TASK-36 implemented the Supabase ClientListRepository behind the placeholder boundary with fake row-reader tests; runtime selection still uses the placeholder.
- TASK-37 aligned mock `upcomingEventCount` with Supabase summary behavior: scheduled events on/after the reference date only.
- TASK-38 documented the safe activation gate plan for Supabase ClientListRepository without changing runtime selection.
- TASK-39 implemented activation gate selection tests and runtime gate wiring while keeping mock as the default data source.
- TASK-40 documented the approved ClientList activation smoke test procedure with strict placeholder UX and rollback rules.
- TASK-41 pre-check assumptions are outdated: `.env.local` now exists locally and is ignored by git.
- TASK-42 runtime retry diagnostics confirmed `.env.local` loads in a fresh Vite-style env context, `VITE_SUPABASE_READ_ACTIVATION` matches `client_list`, and the live `clients` read now returns successfully with an empty result. There was no silent mock fallback. ClientDetail and SmartViews remain strict placeholders by code path.
- No real `.env` value should be committed. `.env.local` remains local-only.
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
- TASK-36: Added `src/data/adapters/supabase/clientRowsReader.ts`, `src/data/adapters/supabase/clientListRepository.ts`, and `tests/supabase/clientListRepository.test.ts`; `currentRepositories.ts` remains placeholder-selected for `VITE_DATA_SOURCE=supabase`.
- TASK-37: Updated `src/data/projections/clientSummary.ts` to count only scheduled mock events on/after the reference date and added `tests/mock/clientSummaryProjection.test.ts`. Current demo counts do not change because existing scheduled mock events are all on/after `TODAY`.
- TASK-38: Added `docs/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md`; no env, SQL, runtime selection, or UI changes were made.
- TASK-39: Added `src/data/repositories/repositorySelection.ts` and `tests/supabase/activationGate.test.ts`; updated `currentRepositories.ts` so Supabase ClientList can be selected only with explicit `VITE_SUPABASE_READ_ACTIVATION=client_list` and valid browser config. Default and invalid values still resolve to mock, and Detail/SmartViews remain placeholders for Supabase activation.
- TASK-40: Added `docs/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md`; no env, SQL, activation, UI, ClientDetail, or SmartViews changes were made.
- TASK-41: Smoke test pre-check confirmed `.gitignore` excludes `.env.local`, local env keys exist, and the activation gate value must be `client_list`.
- TASK-42: Updated `.env.example` with the safe `VITE_SUPABASE_READ_ACTIVATION=off` placeholder and ran one narrow ClientList smoke attempt. Initial result: `error` because the local-only `VITE_SUPABASE_URL` format was invalid.
- TASK-42 retry: Re-ran a narrow ClientList activation diagnostic with fresh Vite env loading. Retry result: `empty`; the live `clients` read succeeds, activation is `client_list`, and frontend Supabase config is present. The remaining blocker is the app/runtime smoke session still using stale client env or a stale dev server process when it shows `fetch failed`. No secrets were printed, no SQL was run, no silent mock fallback occurred, and no code path beyond ClientList activation was enabled.
- TASK-42 final check: Re-ran the approved ClientList smoke test after the full Vite dev server restart. Final result: `empty`. No silent mock fallback occurred, and ClientDetail/SmartViews remain strict placeholders by code path.
- TASK-43: Localized the login screen to Korean, removed visible default password/name placeholders, kept password masking, and removed the extra login explanation notes without changing authentication logic.
- TASK-44: Replaced the green/mint login and empty-state styling with a neutral Salman-style palette, updated login input/button focus states, and localized the empty ClientList state copy without changing auth or Supabase logic.
- TASK-44 design pass: Applied a premium DESIGN.md-inspired neutral theme to the login and empty ClientList screens, restored clean Korean copy, and kept password masking plus existing auth/Supabase behavior unchanged.
- TASK-45: Added `supabase/.temp/` to `.gitignore` and removed tracked Supabase CLI temp files from the git index only. No schema, migration, `.env.local`, app logic, or DB changes were made.
- TASK-46: Added `docs/TASK_46_CLIENT_SEED_SQL.md` with one review-only `clients` insert for `테스트 고객사`. No SQL was executed, and no schema, app logic, or `.env.local` changes were made.
- TASK-47: Re-ran the approved ClientList-only live Supabase read smoke path after the user's manual seed step. Result remained `empty`, `테스트 고객사` did not appear, there was no silent mock fallback, and ClientDetail/SmartViews remain strict placeholders by repository selection.
- TASK-47 retry: Re-ran the same approved ClientList-only live Supabase read smoke path after the user's additional manual insert confirmation. Result still remained `empty`, `테스트 고객사` still did not appear, there was no silent mock fallback, and ClientDetail/SmartViews remain strict placeholders by repository selection.
- TASK-47 retry after anon read policy fix: Re-ran the same approved ClientList-only live Supabase read smoke path after the user added the temporary `smoke_test_read_test_client_only` policy. Result changed to `loaded` with 1 live client row, `테스트 고객사` was returned by the ClientList query, there was no silent mock fallback, and ClientDetail/SmartViews remain strict placeholders by repository selection. The current RLS policy is temporary smoke-test-only and should not be treated as final production policy.
- TASK-48: Added `docs/TASK_48_RLS_READ_POLICY_PLAN.md`. Recommendation: keep `smoke_test_read_test_client_only` as local/dev temporary-only, do not open production anon full read on base tables, and design a narrower formal ClientList-only production read surface before any wider rollout.
- TASK-49: Added `docs/TASK_49_CLIENT_LIST_READ_SURFACE_SPEC.md`. Decision: use `public.get_client_list_summaries_v1()` as the formal production ClientList read surface, keep anon direct reads off the base tables, and include draft SQL to remove the temporary smoke-test policy.
- TASK-50: Added `docs/TASK_50_CLIENT_LIST_RPC_ADAPTER_PLAN.md`. Decision: for the production path, replace base-table ClientList aggregation with an RPC reader plus an RPC-specific summary mapper; keep the existing assembler/tests as the base-table regression path until a later approved code migration task.
- TASK-51: Added ClientList RPC row typing, `mapClientSummaryFromRpcRow`, a fake/testable RPC reader boundary, and RPC repository unit tests. The current runtime selector and live app read path remain unchanged; RPC activation is still deferred to a later approved task.
- TASK-52: Updated the activated Supabase ClientList runtime path to lazy-load the RPC repository instead of the base-table repository. Default mock behavior remains unchanged, and ClientDetail/SmartViews remain strict placeholders behind the same activation gate.
- TASK-53: Added `docs/TASK_53_CLIENT_LIST_RPC_SQL.md` with the executable manual SQL for `public.get_client_list_summaries_v1()` and safe anon execute grants. No SQL was executed, and runtime behavior was not changed in this task.
- TASK-54: Re-ran the ClientList RPC smoke path after the user's manual SQL step. Result: RPC error `PGRST202` because `public.get_client_list_summaries_v1()` was not found in the schema cache; `테스트 고객사` could not be confirmed through RPC, there was no silent mock fallback, and ClientDetail/SmartViews remain strict placeholders.
- TASK-54 retry: Re-ran the ClientList RPC smoke path after the user's schema cache reload. Result changed to `loaded` with 1 RPC row, `테스트 고객사` was returned through the RPC path, there was no silent mock fallback, and ClientDetail/SmartViews remain strict placeholders.
- TASK-55: Added `docs/TASK_55_RLS_CLEANUP_AND_PRODUCTION_ORDER.md`. Decision: remove `smoke_test_read_test_client_only` only after confirming the ClientList RPC exists, returns the expected summary result, and anon can execute it; production must keep ClientList reads on `public.get_client_list_summaries_v1()` and must not open anon direct SELECT on `public.clients`.
- TASK-56: After the user manually executed the approved TASK-55 RLS cleanup SQL, re-ran the ClientList RPC smoke path only. Result: `public.get_client_list_summaries_v1()` returned 1 row and included `테스트 고객사`; no silent mock fallback occurred. The temporary `smoke_test_read_test_client_only` policy is recorded as manually removed, and ClientDetail/SmartViews remain strict placeholders by repository selection.

- TASK-57: Added `docs/TASK_57_SUPABASE_RPC_MILESTONE_LOCK.md`. Milestone lock: ClientList production read stays on `public.get_client_list_summaries_v1()`, the temporary smoke-test RLS policy remains removed, anon base-table `clients` SELECT must not be opened, ClientDetail/SmartViews remain placeholders, and next feature work should keep ClientDetail planning, Ads planning, and UI/dashboard refinement as separate scopes.

- TASK-58: Polished visible Korean UI copy across login, loading/error/empty states, ClientList chips, workspace header, Smart Operation Views, and core panels. Removed MVP/debug-looking user-facing copy such as `Internal Staff MVP` and `No AI / No Google Calendar sync`; no auth, Supabase RPC, RLS, schema, ClientDetail, SmartViews, Ads, RAG, or Calendar behavior was changed.

- TASK-59: Added `docs/TASK_59_ADS_MODULE_SCOPE_AND_DATA_FLOW.md`. Decision: `salman-naver-report-auto` remains the Naver Ads data collection engine, client Google Sheets remain the raw data store, and SALMAN OS Ads is the visualization/audit/action/report draft layer. Ads v1 tabs are 전체 광고 현황, 고객사별 광고 상세, AI 광고 감사, 담당자 액션리스트, 고객사 리포트 초안. Exclusions: no bid changes, campaign edits, auto budget movement, GEO, or RAG integration yet.

- TASK-60: Added `docs/TASK_60_ADS_SCREEN_STRUCTURE_PLAN.md`. Decision: Ads should appear as a first-class `광고 운영` workspace section separate from `고객사 운영`, with tabs for 전체 광고 현황, 고객사별 광고 상세, AI 광고 감사, 담당자 액션리스트, and 고객사 리포트 초안. First implementation scope is placeholder UI only; later order is Google Sheets connector plan, data normalizer, dashboard metrics, audit rules, and report draft generator.

- TASK-61: Implemented the `광고 운영` top-level section as UI placeholder only. Added five tabs: 전체 광고 현황, 고객사별 광고 상세, AI 광고 감사, 담당자 액션리스트, 고객사 리포트 초안. Each tab shows Korean preparation copy and static source-role notes for `salman-naver-report-auto`, client Google Sheets, and SALMAN OS. No Google Sheets connection, audit engine, metrics, report generation, GEO, RAG, Calendar, Supabase/RLS/RPC, or schema behavior was changed.

- TASK-62: Added `docs/TASK_62_ADS_GOOGLE_SHEETS_CONNECTOR_PLAN.md`. Decision: Ads connector v1 should read configured client spreadsheet ids and raw tabs `데일리SA_RAW`, `데일리전환SA_RAW`, and `위클리키워드SA_RAW` as read-only inputs, normalize them into client-scoped Ads raw tables plus diagnostics, and handle missing sheet id, missing tab, empty data, column mismatch, and permission denied states. Later order: config reader, sheet reader, normalizer, mock fallback, UI wiring.

- TASK-63: Added `docs/TASK_63_ADS_VIEW_MODEL_CONTRACT.md`. Decision: Ads UI should consume `AdsOperationsViewModel`, not raw Google Sheets rows. Contract includes dashboard summary fields, client-level ad summaries, diagnostics, tab-specific data needs, mock data requirements, and no-real-data placeholder states for loading, empty, permission denied, column mismatch, and stale data.

## Next Work

Wait for the next approved task.

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
Mock and Supabase summary behavior now use the same upcoming event count rule. Existing demo counts remain unchanged with the current mock dates.
Supabase ClientList activation should require an explicit gate such as `VITE_SUPABASE_READ_ACTIVATION=client_list`; `VITE_DATA_SOURCE=supabase` alone should not activate real reads.
TASK-39 implemented that gate. ClientList real read is lazy-loaded only when `VITE_DATA_SOURCE=supabase`, `VITE_SUPABASE_READ_ACTIVATION=client_list`, and frontend Supabase config are all present.
TASK-40 defines the smoke test as ClientList-only. ClientDetail and SmartViews remain strict placeholders and may surface placeholder errors after list load.
For the current code, the activation value must be `VITE_SUPABASE_READ_ACTIVATION=client_list`. The value `on` is treated as activation off.
The current smoke blocker is the stale app/runtime session showing `fetch failed` even though a fresh Vite-style ClientList diagnostic now returns an empty live result.
Use `docs/SUPABASE_READ_ADAPTER_MAPPING.md` for DB enum to UI model conversion and `docs/TASK_32_READ_ADAPTER_PLAN.md` for the implementation/test sequence.
Use `docs/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md` for ClientSummary row assembly rules.
Use `docs/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md` for repository boundary, query row shapes, and TASK-36 test strategy.
Use `docs/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md` before further changing `currentRepositories.ts`.
Use `docs/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md` before any real env entry or activation smoke test.
The implemented Supabase ClientListRepository remains outside the central Supabase barrel and is lazy-loaded by the activation path to avoid pulling Supabase read code into the default mock path.
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
node --test tests\supabase\activationGate.test.ts
node --test tests\mock\clientSummaryProjection.test.ts
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts tests\supabase\clientListRepository.test.ts
npm.cmd run lint
npm.cmd run build
```

## Verification Notes

Run verification after documentation or schema draft changes when feasible:

```powershell
node --test tests\supabase\activationGate.test.ts
node --test tests\mock\clientSummaryProjection.test.ts
node --test tests\supabase\mappers.test.ts tests\supabase\clientSummaryAssembler.test.ts tests\supabase\clientListRepository.test.ts
npm.cmd run lint
npm.cmd run build
```

If verification fails, record the exact failing command and reason before continuing.
