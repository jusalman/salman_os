# SALMAN OS Handoff

## Current Status

- Current task state: TASK-120 improved only the SALMAN OS client detail `업무` and `일정` tabs into mock-first operational views while preserving the existing dashboard, CRM table, client workroom tabs, 자료실 UX, Supabase activation gate, and Drive mock repository boundaries. `TasksPanel` now shows summary metrics, scan-friendly task rows with status, priority, assignee, due date, related-file state, mock recent update text, selected task detail, memo, work-log placeholder, and prepared `업무 추가`/`상태 변경`/`완료 처리` actions. `InternalSchedulePanel` now shows summary metrics, scan-friendly schedule rows with date, time, owner, status, related-task placeholder, memo, selected schedule detail including connected client name, and prepared `일정 추가`/`완료 처리`/`일정 변경` actions. The task read projection now passes through existing `relatedFileId` only for display. No Supabase insert/update/delete, Google Drive API wiring, frontend `/api/drive/*` fetch, package change, env/credential edit, Playwright automation, chatbot/RAG/vector implementation, business money automation, or mock-first/activation boundary change was introduced. Verification passed: `node --test`, `npm.cmd run lint`, `npm.cmd run build`.
- Current task state: TASK-119 improved only the SALMAN OS client detail `자료실` tab UX while keeping the existing dashboard, CRM table, client workroom tabs, and Drive mock repository boundaries intact. `FilesPanel` now requires an explicit file click before the right detail panel changes, preserves the left folder tree and `전체 자료` folder, filters the center file list by selected folder, and shows a clearer right-side file detail panel with file name, type, status, sensitivity, folder path, uploader, uploaded date, source-link state, mock linked-task copy, mock memo, and a prepared `보관 이동` action. Archived and excluded file behavior remains owned by the existing mock repository filtering; no Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector implementation, business money automation, or mock-first/activation boundary change was introduced.
- Current task state: TASK-118 cleaned SALMAN OS visible naming and identity copy without changing the dashboard/client management/client detail information structure. The visible UI now uses SALMAN OS as the product name, keeps SALMAN Workspace as secondary sidebar copy, removes the old alternate brand wording from screen components, changes login name copy to `작업자 이름`, explains that the name is used for work records, change history, and future chatbot conversation logs, and shows `현재 작업자: {viewerName}` as small sidebar metadata. No Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector implementation, business money automation, or mock-first/activation boundary change was introduced.
- Current task state: TASK-117 separated SALMAN OS information architecture into a navigation-only dark sidebar, a dashboard-first operating overview, a focused CRM client management table, and the existing client workroom detail tabs. The former sidebar Smart Operation Views/checklist widgets now live in the dashboard right panel alongside today's items, priority tasks, and mock auto-classification pending items; the dashboard main area shows total clients, attention count, open tasks, upcoming schedules, business money issues, attention clients, and recent log-linked clients. The client management screen now keeps only its CRM header, prepared registration action, search/filter mock controls, and dense client table. No Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector, business money automation, or mock-first/activation boundary change was introduced.
- Current task state: TASK-116 revised the SALMAN OS UI/UX away from the full dark command-center treatment into a Digital HQ-style CRM layout: dark fixed left sidebar, bright main workspace, white cards, serif page titles, dense client management table, mock search/filter controls, and a prepared `+ 클라이언트 등록` action. Client detail keeps the separated tab structure with updated labels including `광고`, `견적/계약`, and `정산/비즈머니`; the files tab now shows a three-column folder/file/detail layout backed only by the existing mock Drive repository. No Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector, business money automation, or mock-first/activation boundary change was introduced. Verification passed: `node --test`, `npm.cmd run lint`, `npm.cmd run build`.
- Current task state: TASK-115 upgraded the SALMAN OS UI/UX toward a darker Digital HQ command-center style while preserving the TASK-114 client-list-first and selected-client tab structure. `src/App.css` now defines dark design tokens and refreshed cards, tabs, status badges, Drive hub, Ads preview, login, and responsive fallback styling. Client cards now show only selection-critical information including owner, status, task count, upcoming schedule count, business money state, latest log, and a clear detail CTA; the client detail hero now surfaces status, owner, and latest update. No Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector, business money automation, or data flow change was introduced. Verification passed: `node --test`, `npm.cmd run lint`, `npm.cmd run build`.
- Current task state: TASK-114 reorganized SALMAN OS UI/UX into a client-list-first workspace and a selected-client detail screen with tabs for overview, tasks, schedule, files, ads operations, business money, links, and logs. The overview tab now shows only core summary counts plus recent files/logs; `FilesPanel`, `TasksPanel`, `InternalSchedulePanel`, `BusinessMoneyPanel`, `LinksPanel`, and `OperationLogsPanel` render only inside their matching tabs. No Google Drive API wiring, frontend `/api/drive/*` fetch, Supabase schema/RLS/RPC change, package change, env/credential edit, Playwright automation, chatbot/RAG/vector, or business money automation was introduced. Verification passed: `node --test`, `npm.cmd run lint`, `npm.cmd run build`.
- Resume note: Drive actual smoke mode mismatch is fixed. `DRIVE_SERVER_ADAPTER_MODE` remains the route adapter selector with only `fake` and `google_skeleton`; actual local Drive list smoke now uses smoke-only `GOOGLE_DRIVE_LOCAL_SMOKE_MODE=google_actual`. `drive:smoke:gate` and `drive:smoke:list` may read same-shell env or the ignored `.env.drive.local` file, but they do not read `.env.local` and must print only setting names/counts. Actual Drive list smoke still requires explicit local credentials and should not print credential path/value, folder ID, file ID, file name, URL, token, service account email, private key, raw Google response, or `.env.local` content. Frontend fetch wiring, Supabase schema/RLS/RPC changes, embeddings, vectors, and chatbot UI remain out of scope. Keep README/HANDOFF/AGENTS/README_INDEX as the always-read entry points.
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
- Current task state: TASK-64 wired the Ads operations UI to a static mock `AdsOperationsViewModel` without Google Sheets, real metrics, audit rules, report generation, or Supabase/RLS/RPC changes.
- Current task state: TASK-65 planned Ads v1 metrics, safe formulas, missing/zero handling, health score draft rules, status mapping, and first risk signals without implementing metrics code.
- Current task state: TASK-66 added pure Ads metrics calculator functions and Node tests without UI wiring, Google Sheets, Supabase/RLS/RPC, SQL, real audit, or report generation changes.
- Current task state: TASK-67 aligned the static Ads operations mock view model with `calculateAdsMetrics` outputs while keeping data local and without Google Sheets or Supabase/RLS/RPC changes.
- Current task state: TASK-68 planned the Ads Google Sheets config source and credential boundary without implementing Google Sheets API, adding credentials, or changing Supabase/RLS/RPC.
- Current task state: TASK-69 added a pure Ads Sheets mock config reader and tests without Google Sheets API, credentials, UI wiring, or Supabase/RLS/RPC changes.
- Current task state: TASK-70 added pure Ads raw sheet parser/normalizer functions and tests without Google Sheets API, credentials, UI wiring, or Supabase/RLS/RPC changes.
- Current task state: TASK-71 added a pure Ads mock connector-to-view-model pipeline and tests without Google Sheets API, credentials, UI wiring, or Supabase/RLS/RPC changes.
- Current task state: TASK-72 wired the Ads operations UI to the mock connector view model pipeline without Google Sheets API, credentials, real audit/report generation, or Supabase/RLS/RPC changes.
- Current task state: TASK-73 planned the Ads Sheets server/local connector boundary without implementing Google Sheets API, adding credentials, or changing Supabase/RLS/RPC.
- Current task state: TASK-74 added an Ads Sheets connector interface and fake reader tests without Google Sheets API, credentials, UI runtime wiring, or Supabase/RLS/RPC changes.
- Current task state: TASK-75 planned the local-only Google Sheets reader implementation boundary without implementing Google Sheets API, adding credentials, editing `.env.local`, or changing Supabase/RLS/RPC.
- Current task state: TASK-76 hardened `.gitignore` for local env, Google/GCP/Sheets credential, OAuth token, private key, and local secret files before any actual Google Sheets API reader implementation.
- Current task state: TASK-77 added pure local credential path validation before any Google Sheets actual API reader implementation.
- Current task state: TASK-78 planned the Ads Sheets local-only reader activation/env boundary without implementing Google Sheets API or changing runtime behavior.
- Current task state: TASK-79 added pure Ads Sheets reader activation resolver wiring without Google Sheets API calls or credential exposure.
- Current task state: TASK-80 added Ads Sheets reader factory wiring for mock/local/error reader selection without actual Google Sheets API calls.
- Current task state: TASK-81 added `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` as a review-only Google Drive structure guide for company operations and future AI/RAG readiness; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-82 rewrote `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` so folder names remain English while explanations, purpose notes, and operating rules are Korean for easier review; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-83 revised `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` from a general marketing-company Drive structure into an SA/DA-focused performance marketing structure; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-84 added a Korean `소분류 상세 설명` section to `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` so each low-level folder has a practical usage explanation; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-85 added Korean parenthetical explanations next to English folder names in the visual trees of `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md`; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-86 restructured `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` into a reusable general-company Drive baseline with SALMAN OS SA/DA marketing as a `04_Service_Delivery` extension module; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-87 restored `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` to the SALMAN OS-optimized SA/DA top-level Drive structure after deciding the general-company extension model could cause confusion; no API integration, credentials, SQL, Supabase/RLS/RPC, or runtime behavior changed.
- Current task state: TASK-88 removed confirmed unused UI assets, fully localized the visible mock operating data to Korean, and redesigned the login, customer operations, customer detail, and ads operations screens for a cleaner internal operations dashboard; no Google API, OpenAI API, Playwright, SQL execution, Supabase/RLS/RPC, or real `.env` changes were made.
- Current task state: TASK-89 converted the customer file panel into a Google Drive-style file hub with folder structure navigation, file list rows, prepared add/folder/sync/archive actions, and clear API-pending messaging; no Google Drive API calls, credentials, SQL, Supabase/RLS/RPC, or real file mutations were made.
- Current task state: TASK-90 added `docs/archive/tasks/TASK_90_GOOGLE_DRIVE_API_SYNC_ARCHITECTURE.md` to define the Google Drive API backend boundary, auth options, action-to-API mapping, Supabase metadata candidates, sync states, conflict rules, and phased implementation order; no Google Drive API calls, credentials, SQL execution, Supabase/RLS/RPC changes, or real file mutations were made.
- Current task state: TASK-91 added `docs/archive/tasks/TASK_91_DRIVE_METADATA_SCHEMA_PLAN.md` to define the Supabase metadata plan for `client_drive_roots`, `drive_folders`, `drive_files`, `drive_sync_jobs`, and `drive_action_logs`, including enum candidates, relationships, indexes, read model, RLS direction, migration direction, and sync/archive rules; no SQL execution, Google Drive API calls, credentials, Supabase/RLS/RPC changes, or real file mutations were made.
- Current task state: TASK-92 added review-only SQL draft `docs/archive/tasks/TASK_92_DRIVE_METADATA_SCHEMA_SQL_DRAFT.sql` for Drive metadata enums, tables, indexes, updated_at triggers, and RLS direction; the SQL was not executed and no Supabase connection, Google Drive API call, credential, or real file mutation was introduced.
- Current task state: TASK-93 added `docs/archive/tasks/TASK_93_DRIVE_BACKEND_ADAPTER_PLAN.md` to define the backend Drive adapter interface, mock backend flow, API route candidates, validation/error model, security boundary, frontend migration path, and implementation order; no backend code, package install, Google Drive API call, credential, SQL execution, Supabase/RLS/RPC change, or real file mutation was introduced.
- Current task state: TASK-94 added a mock Drive file repository boundary with Drive domain types, repository interface, mock implementation, hook wiring, file hub UI consumption, and mock repository tests; no Google Drive API call, credential/env read, Supabase schema/RLS/RPC change, SQL execution, embedding/vector/RAG answer, or chatbot UI was introduced.
- Current task state: TASK-95 decided the future actual Drive adapter boundary as server-owned Vercel-style `/api/drive/*` routes, while keeping v1 on the TASK-94 mock repository and recommending a shared route contract plus fake backend client before any actual route or Google API work; no Google Drive API call, package, credential/env read, Supabase schema/RLS/RPC change, SQL execution, embedding/vector/RAG answer, or chatbot UI was introduced.
- Current task state: TASK-96 added a shared Drive backend route contract and fake backend client that reuse sanitized TASK-94 mock metadata without creating actual `/api/drive/*` routes, calling Google Drive API, adding credentials/env access, changing Supabase schema/RLS/RPC, or implementing embedding/vector/RAG answer or chatbot UI.
- Current task state: TASK-97 decided to add lightweight pure Drive route request validators, a response safety checker, and a fake route handler harness before actual route/API work; no real `/api/drive/*` route files, Google Drive API calls, package additions, credential/env reads, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, or chatbot UI were introduced.
- Current task state: TASK-98 decided to defer Vercel-style `/api/drive/*` mock route files because the repo remains Vite frontend-only, route files would not be meaningful in the current build/runtime, and TASK-97 pure validation plus fake handler harness is the safer current boundary; no route files, Google Drive API calls, package additions, credential/env reads, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, or chatbot UI were introduced.
- Current task state: TASK-99 documented the Vercel deployment baseline and future route test convention before adding Drive API routes; route files remain deferred, future route tests should start from pure handler tests in `tests/drive`, and server-only Google secret names are allowed only in future approved server route work while `VITE_` Google credential/secret env remains forbidden.
- Current task state: TASK-100 documented the SALMAN OS deployment baseline for current Vite frontend-only deployment, Vercel static output, allowed public Vite env, forbidden credential/secret env, future `/api` route add conditions, and rollback criteria; no route files, deployment config changes, Google Drive API calls, package additions, credential/env reads, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, chatbot UI, or UI changes were introduced.
- Current task state: TASK-101 replaced the default Vite README with a concise SALMAN OS README that documents project purpose, current scope, local development, verification commands, frontend env allowlist, forbidden secrets, deployment baseline, and references to TASK-99/TASK-100; no code, route files, package changes, credential/env reads, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, chatbot UI, or UI changes were introduced.
- Current task state: TASK-102 added `docs/README_INDEX.md` as the docs index and maintenance policy, keeping README/HANDOFF/AGENTS/README_INDEX as the always-read entry points, grouping Supabase, Ads, Drive/RAG/deployment documents, treating TASK files as work history, and defining archive candidate criteria without moving, deleting, or rewriting old TASK files.
- Current task state: TASK-103 classified docs archive candidates without moving files: keep recent TASK-94 through TASK-100 Drive/route/deployment baselines in place, treat older Supabase/Ads/Drive planning TASK files as possible archive candidates only after a dedicated move task, and continue using README/HANDOFF/AGENTS/README_INDEX as the always-read docs.
- Current task state: TASK-104 hardened Drive route preparation by rejecting unexpected route request body keys, expanding response safety checks for camelCase secret metadata, and adding fake route harness tests for file detail access and archived opt-in behavior; no new TASK document, route files, Google Drive API calls, packages, credential/env reads, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, chatbot UI, or UI changes were introduced.
- Current task state: TASK-105 added mock-only Vercel-style Drive route boundary adapters at `api/drive/list.ts`, `api/drive/detail.ts`, and `api/drive/categories.ts`, plus `tests/api/driveMockApiRoute.test.ts`; these routes call only `handleDriveRouteHarness`, have no Google Drive API/credential/env access, and are not wired into the default UI runtime.
- Current task state: TASK-106 added `api/drive/driveServerAdapter.ts` as the server-owned adapter boundary, updated the mock route adapters to accept adapter injection through `handleDriveServerRoute`, and added route adapter boundary tests; no new TASK document, Google Drive API, packages, credentials/env reads, frontend fetch wiring, Supabase schema/RLS/RPC changes, embedding/vector/RAG answer, chatbot UI, or UI changes were introduced.
- Current task state: Docs cleanup moved 12 historical task artifacts to `docs/archive/tasks/`, updated `docs/README_INDEX.md` and this handoff, deleted no documents, and kept current baseline docs plus TASK-94 through TASK-100 Drive/API/Deployment boundary docs in place.
- Current task state: TASK-107 added an actual Drive adapter readiness checklist and env/secret review gate to the deployment baseline, kept auth mode undecided, kept `.env.example` Google entries out, kept `VITE_GOOGLE_*` and `VITE_DRIVE_*` forbidden, and kept actual Google Drive API, `googleapis`, credential/env reads, and frontend fetch wiring out of scope.
- Current task state: TASK-108 added `api/drive/googleDriveServerAdapter.ts` as an actual adapter skeleton that satisfies `DriveServerAdapter` but returns `drive_backend_unavailable` safe diagnostics only. Added tests for interface shape, route safety checks, no fetch call, no `googleapis`/runtime env access in the skeleton source, and default route behavior staying on the fake adapter.
- Current task state: TASK-109 added `selectDriveServerAdapter()` and `DRIVE_SERVER_ADAPTER_MODE_KEY` to guard non-default adapter selection through injected `envLike` values only. No process env read, `.env.local` read, Google API call, package addition, frontend fetch wiring, Supabase change, or UI change was introduced.
- Current task state: TASK-110 added explicit route-handler test wiring for adapter selection results through `handleDriveServerRouteWithAdapterSelection()` and `handleDriveServerRouteWithAdapterInput()`. Mock list/detail/categories route helpers can now receive fake, `google_skeleton`, or rejected selection results in tests; default route runtime still uses fake adapter when no input is provided.
- Current task state: TASK-111 upgraded the inactive actual Drive adapter skeleton with service-account-first config types, injected envLike mapping, config validation, and a config-backed unavailable adapter. `googleapis` was not added, no credential/env file was read, `.env.example` stayed unchanged, and default `/api/drive/*` behavior remains fake.
- Current task state: TASK-112 installed `googleapis`, added `api/drive/googleDriveClientFactory.ts` as a server-only service account client factory with injected dependencies, added `api/drive/googleDriveLocalSmokeGate.ts` plus `npm.cmd run drive:smoke:gate` for prerequisite checks, and kept actual Drive API smoke execution, credential file reads, `.env.local` reads, `.env.example` Google entries, frontend fetch wiring, and default route activation out of scope.
- Current task state: TASK-113 ran the Drive smoke preflight gate only; it reported missing setting names for `DRIVE_SERVER_ADAPTER_MODE`, `GOOGLE_DRIVE_AUTH_MODE`, `GOOGLE_DRIVE_CREDENTIAL_PATH`, and `GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID`. Added `api/drive/googleDriveListSmoke.ts` plus `scripts/driveListSmoke.ts` and `npm.cmd run drive:smoke:list` as an approval-only local list smoke runner that prints sanitized counts only. The actual list smoke was not run.
- Current task state: TASK-114 received approval to run the local-only Drive list smoke, but the preflight gate failed because the shell environment did not provide `DRIVE_SERVER_ADAPTER_MODE`, `GOOGLE_DRIVE_AUTH_MODE`, `GOOGLE_DRIVE_CREDENTIAL_PATH`, or `GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID`. The actual list smoke command was not run, no Drive API request was made, and no credential path/value, folder ID, file ID, file name, raw Google response, or `.env.local` content was printed.
- Current task state: TASK-115 attempted the user-approved local Drive list smoke after expected env injection, but `npm.cmd run drive:smoke:gate` still reported missing `DRIVE_SERVER_ADAPTER_MODE`, `GOOGLE_DRIVE_AUTH_MODE`, `GOOGLE_DRIVE_CREDENTIAL_PATH`, and `GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID`. The actual list smoke command was not run, API reached stayed false, and no credential path/value, folder ID, file ID, file name, raw Google response, service account email, private key, token, or `.env.local` content was printed.
- Current task state: TASK-116 fixed the Drive actual smoke mode mismatch by separating local smoke mode from route adapter mode. The gate now requires smoke-only `GOOGLE_DRIVE_LOCAL_SMOKE_MODE=google_actual`, keeps `GOOGLE_DRIVE_AUTH_MODE=service_account`, and keeps `GOOGLE_DRIVE_CREDENTIAL_PATH` plus `GOOGLE_DRIVE_ALLOWED_ROOT_FOLDER_ID` as server/local-only settings. Optional `.env.drive.local` loading was added for the smoke scripts only and is explicitly ignored by git; `.env.local` remains app runtime-only and is not read by these smoke scripts. `google_actual` is not accepted by `selectDriveServerAdapter()`, so default `/api/drive/*` behavior remains fake. Actual Drive list smoke was not run during this fix.
- Current write phase: TASK-116 completed and verified.
- TASK-116 changed files: `.gitignore`, `api/drive/googleDriveListSmoke.ts`, `api/drive/googleDriveLocalSmokeEnv.ts`, `api/drive/googleDriveLocalSmokeGate.ts`, `scripts/driveLocalSmokeGate.ts`, `scripts/driveListSmoke.ts`, `tests/api/driveGoogleClientFactory.test.ts`, `tests/api/driveServerAdapterSelection.test.ts`, `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`, `docs/HANDOFF.md`.
- TASK-116 verification: `node --test` passed with 147 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- TASK-116 safe smoke run path: provide the required settings in the same PowerShell session or in local ignored `.env.drive.local`, then run `npm.cmd run drive:smoke:gate`; only after the gate passes, run `npm.cmd run drive:smoke:list`. The success output must stay limited to API-reached/sanitized summary lines, returned count, and additional-page presence.
- TASK-96 changed files: `src/domain/driveBackendContract.ts`, `src/data/adapters/mock/driveBackendFakeClient.ts`, `tests/drive/driveBackendContract.test.ts`, `tests/drive/driveBackendFakeClient.test.ts`, `docs/TASK_96_DRIVE_BACKEND_CONTRACT_AND_FAKE_CLIENT.md`, `docs/HANDOFF.md`.
- TASK-96 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-97 changed files: `src/domain/driveRouteValidation.ts`, `src/data/adapters/mock/driveRouteFakeHandler.ts`, `tests/drive/driveRouteValidation.test.ts`, `tests/drive/driveRouteFakeHandler.test.ts`, `docs/TASK_97_DRIVE_ROUTE_VALIDATOR_HARNESS_DECISION.md`, `docs/HANDOFF.md`.
- TASK-97 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-98 changed files: `docs/TASK_98_DRIVE_MOCK_ROUTE_DECISION.md`, `docs/HANDOFF.md`.
- TASK-98 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-99 changed files: `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`, `docs/HANDOFF.md`.
- TASK-99 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-100 changed files: `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`, `docs/HANDOFF.md`.
- TASK-100 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-101 changed files: `README.md`, `docs/HANDOFF.md`.
- TASK-101 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-102 changed files: `docs/README_INDEX.md`, `docs/HANDOFF.md`.
- TASK-102 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-103 changed files: `docs/README_INDEX.md`, `docs/HANDOFF.md`.
- TASK-103 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-104 changed files: `src/domain/driveRouteValidation.ts`, `tests/drive/driveRouteValidation.test.ts`, `tests/drive/driveRouteFakeHandler.test.ts`, `docs/HANDOFF.md`.
- TASK-104 verification: `node --test` passed with 108 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- TASK-105 changed files: `api/drive/list.ts`, `api/drive/detail.ts`, `api/drive/categories.ts`, `tests/api/driveMockApiRoute.test.ts`, `README.md`, `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`, `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`, `docs/HANDOFF.md`.
- TASK-105 verification: `node --test` passed with 113 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- TASK-106 changed files: `api/drive/driveServerAdapter.ts`, `api/drive/list.ts`, `api/drive/detail.ts`, `api/drive/categories.ts`, `tests/api/driveServerAdapterBoundary.test.ts`, `README.md`, `docs/HANDOFF.md`.
- TASK-106 verification: `node --test` passed with 116 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- Docs cleanup changed files: moved 12 files into `docs/archive/tasks/`, updated `docs/README_INDEX.md`, and updated `docs/HANDOFF.md`. No code, route, API, credential, env, Supabase, embedding, vector, chatbot, or UI changes were made.
- Docs cleanup verification: `node --test`, `npm.cmd run lint`, `npm.cmd run build`, `git status --short`, `git diff --stat`, and relative-link/path checks passed.
- TASK-107 changed files: `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`, `README.md`, `docs/HANDOFF.md`.
- TASK-107 verification: `node --test`, `npm.cmd run lint`, and `npm.cmd run build` passed.
- TASK-108 changed files: `api/drive/googleDriveServerAdapter.ts`, `tests/api/driveGoogleAdapterSkeleton.test.ts`, `docs/HANDOFF.md`.
- TASK-108 verification: `node --test` passed with 121 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- TASK-109 changed files: `api/drive/driveServerAdapter.ts`, `tests/api/driveServerAdapterSelection.test.ts`, `docs/HANDOFF.md`.
- TASK-109 verification: `node --test` passed with 128 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed.
- Next task: run the actual local Drive list smoke once with real local settings available through the same PowerShell session or ignored `.env.drive.local`, then record only sanitized success/failure status. Do not repeat failed smoke attempts in handoff unless the failure changes the implementation or next action.
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
- TASK-32: Planned Supabase read adapter mapping in `docs/SUPABASE_READ_ADAPTER_MAPPING.md` and `docs/archive/tasks/TASK_32_READ_ADAPTER_PLAN.md`; no code, env, SQL, or real data activation changes were made.
- TASK-33: Implemented pure mapper helpers in `src/data/adapters/supabase/mappers.ts` and tests in `tests/supabase/mappers.test.ts`; `VITE_DATA_SOURCE=supabase` remains placeholder-only.
- TASK-34: Documented ClientSummary assembly in `docs/archive/tasks/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md` and added pure assembly helpers/tests without connecting Supabase queries.
- TASK-35: Documented the first Supabase ClientListRepository adapter plan in `docs/archive/tasks/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md`; no code activation, env, SQL, or UI changes were made.
- TASK-36: Added `src/data/adapters/supabase/clientRowsReader.ts`, `src/data/adapters/supabase/clientListRepository.ts`, and `tests/supabase/clientListRepository.test.ts`; `currentRepositories.ts` remains placeholder-selected for `VITE_DATA_SOURCE=supabase`.
- TASK-37: Updated `src/data/projections/clientSummary.ts` to count only scheduled mock events on/after the reference date and added `tests/mock/clientSummaryProjection.test.ts`. Current demo counts do not change because existing scheduled mock events are all on/after `TODAY`.
- TASK-38: Added `docs/archive/tasks/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md`; no env, SQL, runtime selection, or UI changes were made.
- TASK-39: Added `src/data/repositories/repositorySelection.ts` and `tests/supabase/activationGate.test.ts`; updated `currentRepositories.ts` so Supabase ClientList can be selected only with explicit `VITE_SUPABASE_READ_ACTIVATION=client_list` and valid browser config. Default and invalid values still resolve to mock, and Detail/SmartViews remain placeholders for Supabase activation.
- TASK-40: Added `docs/archive/tasks/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md`; no env, SQL, activation, UI, ClientDetail, or SmartViews changes were made.
- TASK-41: Smoke test pre-check confirmed `.gitignore` excludes `.env.local`, local env keys exist, and the activation gate value must be `client_list`.
- TASK-42: Updated `.env.example` with the safe `VITE_SUPABASE_READ_ACTIVATION=off` placeholder and ran one narrow ClientList smoke attempt. Initial result: `error` because the local-only `VITE_SUPABASE_URL` format was invalid.
- TASK-42 retry: Re-ran a narrow ClientList activation diagnostic with fresh Vite env loading. Retry result: `empty`; the live `clients` read succeeds, activation is `client_list`, and frontend Supabase config is present. The remaining blocker is the app/runtime smoke session still using stale client env or a stale dev server process when it shows `fetch failed`. No secrets were printed, no SQL was run, no silent mock fallback occurred, and no code path beyond ClientList activation was enabled.
- TASK-42 final check: Re-ran the approved ClientList smoke test after the full Vite dev server restart. Final result: `empty`. No silent mock fallback occurred, and ClientDetail/SmartViews remain strict placeholders by code path.
- TASK-43: Localized the login screen to Korean, removed visible default password/name placeholders, kept password masking, and removed the extra login explanation notes without changing authentication logic.
- TASK-44: Replaced the green/mint login and empty-state styling with a neutral Salman-style palette, updated login input/button focus states, and localized the empty ClientList state copy without changing auth or Supabase logic.
- TASK-44 design pass: Applied a premium DESIGN.md-inspired neutral theme to the login and empty ClientList screens, restored clean Korean copy, and kept password masking plus existing auth/Supabase behavior unchanged.
- TASK-45: Added `supabase/.temp/` to `.gitignore` and removed tracked Supabase CLI temp files from the git index only. No schema, migration, `.env.local`, app logic, or DB changes were made.
- TASK-46: Added `docs/archive/tasks/TASK_46_CLIENT_SEED_SQL.md` with one review-only `clients` insert for `테스트 고객사`. No SQL was executed, and no schema, app logic, or `.env.local` changes were made.
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

- TASK-60: Added `docs/archive/tasks/TASK_60_ADS_SCREEN_STRUCTURE_PLAN.md`. Decision: Ads should appear as a first-class `광고 운영` workspace section separate from `고객사 운영`, with tabs for 전체 광고 현황, 고객사별 광고 상세, AI 광고 감사, 담당자 액션리스트, and 고객사 리포트 초안. First implementation scope is placeholder UI only; later order is Google Sheets connector plan, data normalizer, dashboard metrics, audit rules, and report draft generator.

- TASK-61: Implemented the `광고 운영` top-level section as UI placeholder only. Added five tabs: 전체 광고 현황, 고객사별 광고 상세, AI 광고 감사, 담당자 액션리스트, 고객사 리포트 초안. Each tab shows Korean preparation copy and static source-role notes for `salman-naver-report-auto`, client Google Sheets, and SALMAN OS. No Google Sheets connection, audit engine, metrics, report generation, GEO, RAG, Calendar, Supabase/RLS/RPC, or schema behavior was changed.

- TASK-62: Added `docs/archive/tasks/TASK_62_ADS_GOOGLE_SHEETS_CONNECTOR_PLAN.md`. Decision: Ads connector v1 should read configured client spreadsheet ids and raw tabs `데일리SA_RAW`, `데일리전환SA_RAW`, and `위클리키워드SA_RAW` as read-only inputs, normalize them into client-scoped Ads raw tables plus diagnostics, and handle missing sheet id, missing tab, empty data, column mismatch, and permission denied states. Later order: config reader, sheet reader, normalizer, mock fallback, UI wiring.

- TASK-63: Added `docs/TASK_63_ADS_VIEW_MODEL_CONTRACT.md`. Decision: Ads UI should consume `AdsOperationsViewModel`, not raw Google Sheets rows. Contract includes dashboard summary fields, client-level ad summaries, diagnostics, tab-specific data needs, mock data requirements, and no-real-data placeholder states for loading, empty, permission denied, column mismatch, and stale data.

- TASK-64: Updated `src/components/workspace/AdsOperationsPlaceholder.tsx` to use a static mock `AdsOperationsViewModel`. The Ads UI now shows summary cards, a customer ad summary table, mock audit findings, mock action items, and a mock report draft across the five Ads tabs. No Google Sheets connection, credentials, real metrics calculation, audit rules, report generation, GEO, RAG, Calendar, Supabase/RLS/RPC, or schema behavior was changed.

- TASK-65: Added `docs/TASK_65_ADS_METRICS_AND_HEALTH_SCORE_RULES.md`. Decision: Ads v1 metrics are spend, impressions, clicks, ctr, cpc, conversions, cpa, revenue, and roas with safe denominator handling. Health score is a draft 0-100 internal review score based on data completeness/freshness, spend stability, conversion stability, CPC control, ROAS efficiency, and high-cost no-conversion exposure. Status precedence is missing_data, risk, warning, normal. No metrics code or real audit/report automation was implemented.

- TASK-66: Added `src/domain/adsMetrics.ts` and `tests/ads/adsMetrics.test.ts`. The pure calculator aggregates raw Ads metric rows, safely calculates `ctr`, `cpc`, `cpa`, and `roas`, maps draft `healthScore` and status, and covers normal data, zero clicks, zero conversions, zero spend, missing data, stale data, and high-cost no-conversion cases. It is not wired into the Ads UI and does not connect Google Sheets or touch Supabase/RLS/RPC.

- TASK-67: Updated `src/components/workspace/AdsOperationsPlaceholder.tsx` so local raw mock rows are passed through `calculateAdsMetrics` before becoming `AdsOperationsViewModel` client summaries. Displayed health score, status, spend, clicks, conversions, CPC, CPA, and ROAS now come from the pure calculator. No Google Sheets connection, real audit/report generation, GEO, RAG, Calendar, Supabase/RLS/RPC, or schema behavior was changed.

- TASK-68: Added `docs/TASK_68_ADS_SHEETS_CONFIG_AND_CREDENTIALS_BOUNDARY.md`. Decision: Ads Sheets config starts as a non-secret mock/docs config with fake spreadsheet ids, later moves to an approved server-side or Supabase-backed config source, and Google credentials must remain server-only/local-only with no service account JSON, private keys, API keys, or service keys committed or exposed through Vite frontend env.

- TASK-69: Added `src/domain/adsSheetsConfig.ts` and `tests/ads/adsSheetsConfig.test.ts`. The pure mock config reader defines `AdsSheetsClientConfig`, uses fake mock spreadsheet ids only, returns enabled valid configs, reports missing `spreadsheetId`, missing raw tab names, and disabled-client diagnostics, and remains disconnected from Google Sheets, credentials, UI wiring, and Supabase/RLS/RPC.

- TASK-70: Added `src/domain/adsSheetsNormalizer.ts` and `tests/ads/adsSheetsNormalizer.test.ts`. The pure normalizer converts raw Ads sheet rows into normalized rows and `AdsRawTable`, parses comma-formatted numbers safely, returns `null` for empty/missing numeric values, and reports empty table, missing required columns, invalid numbers, and unsupported report type diagnostics. It is not connected to Google Sheets, UI wiring, credentials, or Supabase/RLS/RPC.

- TASK-71: Added `src/domain/adsOperationsViewModel.ts` and `tests/ads/adsOperationsViewModel.test.ts`. The pure mock pipeline reads mock Ads Sheets config, consumes fake raw sheet rows, normalizes them, calculates metrics with `calculateAdsMetrics`, builds an `AdsOperationsViewModel`-compatible shape, and aggregates missing config, missing tab, empty data, invalid number, and column mismatch diagnostics. It remains disconnected from Google Sheets, credentials, UI wiring, and Supabase/RLS/RPC.

- TASK-72: Updated `src/components/workspace/AdsOperationsPlaceholder.tsx` so the Ads operations UI now consumes `buildMockAdsOperationsViewModel()` instead of component-local static metric data. The visible UI remains a Korean mock/no-real-data screen, audit/action/report tabs stay placeholders, and there is still no Google Sheets API, credential, real sheet read, real audit/report generation, GEO, RAG, Calendar, or Supabase/RLS/RPC change.

- TASK-73: Added `docs/TASK_73_ADS_SHEETS_SERVER_BOUNDARY_PLAN.md`. Decision: the Ads UI remains a sanitized frontend consumer, real Google Sheets credentials must stay in a server/local-only connector boundary, domain config/normalizer/metrics/view-model modules remain pure and reusable, and placeholder env names are documented without real values. No Google Sheets API, credentials, `.env.local`, real sheet read, Supabase/RLS/RPC, GEO, RAG, Calendar, audit, or report generation changes were made.

- TASK-74: Added `src/domain/adsSheetsConnector.ts` and extended `tests/ads/adsOperationsViewModel.test.ts` with fake reader coverage. The connector interface returns sanitized raw sheet rows plus diagnostics, fake tests cover successful read, missing tab, empty tab, permission denied, and column mismatch, and fake output is passed into the existing normalizer/view-model pipeline. No Google Sheets API, credentials, `.env.local`, UI runtime wiring, real sheet read, Supabase/RLS/RPC, GEO, RAG, Calendar, audit, or report generation changes were made.

- TASK-75: Added `docs/TASK_75_ADS_LOCAL_SHEETS_READER_PLAN.md`. Decision: the future local Sheets reader must implement `AdsSheetsReader` only in a server/local Node context, load credentials from local/server-only env or path placeholders, never expose credentials to Vite frontend, keep fake-reader tests as regression coverage, and require a separate approved task before adding `.gitignore` credential patterns or real Google Sheets API code. No credentials, `.env.local`, real sheet read, UI runtime wiring, Supabase/RLS/RPC, GEO, RAG, Calendar, audit, or report generation changes were made.

- TASK-76: Added `docs/TASK_76_GITIGNORE_CREDENTIALS_HARDENING.md` and hardened `.gitignore` with explicit local env, local secret, Google/GCP/Sheets credential, OAuth token, token directory, and private key patterns. `.env.example` remains explicitly allowed for tracking. No secret contents were opened or printed, no credentials were added, no local files were deleted, no Google Sheets API was implemented, and no Supabase/RLS/RPC changes were made. Changed files: `.gitignore`, `docs/TASK_76_GITIGNORE_CREDENTIALS_HARDENING.md`, `docs/HANDOFF.md`. Verification commands: `git status --short`, `git check-ignore --stdin -v` with temporary filenames, `.env.example` negative ignore check, `npm.cmd run lint`, `npm.cmd run build`. Commit hash: `<pending>`. Next optimal TASK: design/implement local credential path validation before the Google Sheets actual API reader.

- TASK-77: Added `src/domain/adsLocalCredentialValidation.ts`, `tests/ads/adsLocalCredentialValidation.test.ts`, and `docs/TASK_77_LOCAL_CREDENTIAL_PATH_VALIDATION.md`. The new pure validator checks only credential path strings for missing values, relative paths, example files, and repository-internal commit-risk paths, while allowing repo-external local absolute Windows/Unix paths. It does not read credential contents, access `.env.local`, parse service account or token JSON, call Google Sheets API, or change Supabase/RLS/RPC, Ads UI, metrics, normalizer, or view model behavior. Next optimal TASK: design the local-only Google Sheets reader activation/env boundary using this validator before implementing the actual API reader.

- TASK-78: Added `docs/TASK_78_ADS_SHEETS_ACTIVATION_ENV_BOUNDARY.md`. Decision: keep the mock pipeline as the default, allow the local-only Google Sheets reader only behind explicit `ADS_SHEETS_READER_MODE=local`, keep credential/token/service-account path env names server/local-only without `VITE_`, never expose credential paths or secrets to the browser bundle, and block local reader execution with diagnostics instead of silent mock fallback when validation fails. Changed files: `docs/TASK_78_ADS_SHEETS_ACTIVATION_ENV_BOUNDARY.md`, `docs/HANDOFF.md`. Verification: `npm.cmd run lint`, `npm.cmd run build`, `git status --short`. Next optimal TASK: implement local-only Google Sheets reader interface wiring without exposing credentials.

- TASK-79: Added `src/domain/adsSheetsReaderActivation.ts`, `tests/ads/adsSheetsReaderActivation.test.ts`, and `docs/TASK_79_ADS_SHEETS_READER_ACTIVATION_WIRING.md`. The resolver defaults to mock, returns `local_candidate` only for explicit `ADS_SHEETS_READER_MODE=local` with a validated local/server-only credential path, returns error diagnostics for invalid mode or missing/invalid local credential path, and blocks credential-related `VITE_` env exposure. Validation failure does not silently fall back to mock. No Google Sheets API, `googleapis`, credential file reading, `.env.local` output, Vite client credential access, Supabase/RLS/RPC, or Ads UI changes were made. Next optimal TASK: implement a local-only reader factory/sanitized `AdsSheetsReader` wiring layer without actual Google Sheets API calls.

- TASK-80: Added `src/domain/adsSheetsReaderFactory.ts`, `tests/ads/adsSheetsReaderFactory.test.ts`, and `docs/TASK_80_ADS_SHEETS_READER_FACTORY_WIRING.md`. The factory returns `mockReader` for default/mock mode, `localReaderCandidate` only for explicit local mode with valid credential path activation, and a sanitized error reader for invalid mode, missing/invalid local credential path, or credential-related `VITE_` env exposure. Error reader diagnostics do not expose raw credential paths, token paths, or env dumps, and local activation failure does not silently fall back to mock. Verification commands: `node --test tests\ads\adsSheetsReaderActivation.test.ts tests\ads\adsSheetsReaderFactory.test.ts`, full Ads test bundle, `npm.cmd run lint`, `npm.cmd run build`, `git status --short`. Next optimal TASK: implement local Google Sheets API reader behind the factory boundary.

- TASK-81: Added `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` with a full visual 대분류/중분류/소분류 Google Drive structure for marketing company operations, client folders, read-ok/do-not-index AI context areas, naming rules, and first setup order. This is documentation only for future readiness; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-82: Rewrote `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` to keep actual folder names in English while changing the explanations, purpose notes, usage guidance, AI read/do-not-index rules, and setup steps into Korean. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-83: Rewrote `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` for an SA/DA-centered performance marketing company. The new structure separates `04_SA_Operations` and `05_DA_Operations`, updates the client folder template to split SA/DA/Creative/Landing/Reports, adds SA and DA raw sheet tab recommendations, and removes the broader general-marketing/HR-heavy structure. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-84: Added a `소분류 상세 설명` section to `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md`. The added section explains what belongs in each low-level folder across Governance, Client Operations, Sales/Onboarding, Strategy, SA, DA, Creative, Landing/Tracking, Reports, Internal Knowledge, Templates, AI Automation, Admin/Finance/Legal, Inbox, and Archive. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-85: Updated `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` so visual folder trees show English folder names followed by Korean explanations in parentheses, with a note that the parenthetical text is only for understanding and should not be included in actual Google Drive folder names. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-86: Reworked `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` from an SA/DA-first top-level structure into a general-company Drive baseline. The new baseline keeps universal top-level folders such as Governance, Client/Customer Operations, Sales/Onboarding, Strategy/Research, Service Delivery, Marketing/Growth, Data/Reports, Internal Knowledge, Templates, AI Automation, Admin/Finance/Legal, People/Training, Tools/Security, Inbox, and Archive. SALMAN OS-specific SA/DA operations now live as `04_Service_Delivery/10_SALMAN_SA_DA_Marketing`, with client-level SA/DA folders under each client's `03_Service_Delivery`. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-87: Restored `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md` to the SALMAN OS-optimized SA/DA top-level structure. The guide again uses direct top-level folders such as `04_SA_Operations`, `05_DA_Operations`, `06_Creative_Assets`, `07_Landing_Tracking`, and `08_Reports_Insights`, while retaining Korean parenthetical explanations, `13_People_Training`, and `14_Tools_Security`. The general-company `04_Service_Delivery` extension model was removed to avoid ambiguity. This is documentation only; no Google Drive API, Google Sheets API, OpenAI/RAG, credentials, SQL, Supabase/RLS/RPC, `src`, `public`, or runtime behavior changes were made.

- TASK-94: Added `src/domain/driveFiles.ts`, `src/data/repositories/driveFileRepository.ts`, `src/data/adapters/mock/driveFileMockRepository.ts`, `src/hooks/useClientDriveFiles.ts`, and `tests/mock/driveFileRepository.test.ts`; updated repository selection, mock adapter exports, `FilesPanel`, `Workspace`, and `tests/supabase/activationGate.test.ts`. The Drive file hub now reads sanitized mock Drive metadata through `DriveFileRepository`, defaults to active files, excludes archived/restricted files from the default list, and keeps `sourceUrl` empty instead of using real Drive URLs. Verification: `node --test` targeted/full suite, `npm.cmd run lint`, `npm.cmd run build`. Next optimal TASK: decide backend route location for Drive repository calls before actual Google Drive API or Supabase Drive metadata activation.

- TASK-95: Added `docs/TASK_95_DRIVE_BACKEND_ROUTE_BOUNDARY_DECISION.md`. Decision: future actual Google Drive adapter must live behind server-owned Vercel-style `/api/drive/*` routes, not inside the Vite frontend bundle. Current v1 keeps the mock repository from TASK-94. The next implementation should add a shared route contract and fake backend client before creating actual routes or adding Google API packages. Verification: `node --test`, `npm.cmd run lint`, `npm.cmd run build`. Next optimal TASK: create the shared Drive backend route contract and fake backend client without actual Google Drive API, credentials, Supabase Drive metadata activation, embeddings, vectors, or chatbot UI.

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
Use `docs/SUPABASE_READ_ADAPTER_MAPPING.md` for DB enum to UI model conversion and `docs/archive/tasks/TASK_32_READ_ADAPTER_PLAN.md` for the implementation/test sequence.
Use `docs/archive/tasks/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md` for ClientSummary row assembly rules.
Use `docs/archive/tasks/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md` for repository boundary, query row shapes, and TASK-36 test strategy.
Use `docs/archive/tasks/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md` before further changing `currentRepositories.ts`.
Use `docs/archive/tasks/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md` before any real env entry or activation smoke test.
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
