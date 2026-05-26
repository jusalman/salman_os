# SALMAN OS Docs Index

## Purpose

This index keeps the growing `docs/` folder usable before more Drive, API, Supabase, or deployment work is added.

Historical TASK documents may live under `docs/archive/tasks/`. Archived TASK files remain available for audit, but they are not default reading material and are not current operating policy.

## How To Read Docs

Use this order for normal work:

1. Read `README.md` for the current project, verification, env, and deployment summary.
2. Read `docs/HANDOFF.md` for the current task state and next task.
3. Read `AGENTS.md` for SALMAN OS scope and safety rules.
4. Read only the domain-specific documents needed for the task.

Do not read every old TASK document by default. Most TASK files, especially files under `docs/archive/tasks/`, are historical context, not current operating policy.

## Always Read First

These are the current baseline entry points:

- `README.md`
- `docs/HANDOFF.md`
- `AGENTS.md`
- `docs/README_INDEX.md`

Do not replace this set with old TASK documents. Use TASK documents only when the task directly touches that domain.

For work that touches implementation, also check:

- `package.json`
- the relevant `src/` files
- the relevant `tests/` files

## Current Core Docs

Use these as active references:

- `docs/HANDOFF.md`: current state, task history summary, next task, verification notes.
- `docs/CODEX_OPERATING_PROTOCOL.md`: long-form operating protocol. Treat outdated task numbers inside it as historical when HANDOFF is newer.
- `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md`: Drive folder structure and file organization guide.
- `docs/SUPABASE_READ_ADAPTER_MAPPING.md`: Supabase row-to-UI mapping rules.
- `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`: current deployment and env/security baseline.
- `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`: future route and route test convention.

## Supabase Docs Group

Current useful Supabase baseline:

- `docs/SUPABASE_SCHEMA_DRAFT.sql`
- `docs/SUPABASE_READ_ADAPTER_MAPPING.md`
- `docs/TASK_57_SUPABASE_RPC_MILESTONE_LOCK.md`

Supabase task history kept in `docs/`:

- `docs/TASK_48_RLS_READ_POLICY_PLAN.md`
- `docs/TASK_49_CLIENT_LIST_READ_SURFACE_SPEC.md`
- `docs/TASK_50_CLIENT_LIST_RPC_ADAPTER_PLAN.md`
- `docs/TASK_53_CLIENT_LIST_RPC_SQL.md`
- `docs/TASK_55_RLS_CLEANUP_AND_PRODUCTION_ORDER.md`

Archived Supabase task history:

- `docs/archive/tasks/TASK_32_READ_ADAPTER_PLAN.md`
- `docs/archive/tasks/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md`
- `docs/archive/tasks/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md`
- `docs/archive/tasks/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md`
- `docs/archive/tasks/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md`
- `docs/archive/tasks/TASK_46_CLIENT_SEED_SQL.md`

Read old Supabase TASK files only when changing ClientList RPC behavior, RLS policy plans, SQL drafts, or Supabase activation boundaries.

## Ads Docs Group

Current useful Ads baseline:

- `docs/TASK_59_ADS_MODULE_SCOPE_AND_DATA_FLOW.md`
- `docs/TASK_63_ADS_VIEW_MODEL_CONTRACT.md`
- `docs/TASK_65_ADS_METRICS_AND_HEALTH_SCORE_RULES.md`
- `docs/TASK_68_ADS_SHEETS_CONFIG_AND_CREDENTIALS_BOUNDARY.md`
- `docs/TASK_80_ADS_SHEETS_READER_FACTORY_WIRING.md`

Ads task history kept in `docs/`:

- `docs/TASK_73_ADS_SHEETS_SERVER_BOUNDARY_PLAN.md`
- `docs/TASK_75_ADS_LOCAL_SHEETS_READER_PLAN.md`
- `docs/TASK_76_GITIGNORE_CREDENTIALS_HARDENING.md`
- `docs/TASK_77_LOCAL_CREDENTIAL_PATH_VALIDATION.md`
- `docs/TASK_78_ADS_SHEETS_ACTIVATION_ENV_BOUNDARY.md`
- `docs/TASK_79_ADS_SHEETS_READER_ACTIVATION_WIRING.md`

Archived Ads task history:

- `docs/archive/tasks/TASK_60_ADS_SCREEN_STRUCTURE_PLAN.md`
- `docs/archive/tasks/TASK_62_ADS_GOOGLE_SHEETS_CONNECTOR_PLAN.md`

Read old Ads TASK files only when changing Ads metrics, Google Sheets reader activation, credential safety, or Ads mock pipeline behavior.

## Drive, RAG, And Deployment Docs Group

Current useful Drive and deployment baseline:

- `docs/GOOGLE_DRIVE_STRUCTURE_GUIDE.md`
- `docs/TASK_94_MOCK_DRIVE_BACKEND_REPOSITORY_BOUNDARY.md`
- `docs/TASK_95_DRIVE_BACKEND_ROUTE_BOUNDARY_DECISION.md`
- `docs/TASK_96_DRIVE_BACKEND_CONTRACT_AND_FAKE_CLIENT.md`
- `docs/TASK_97_DRIVE_ROUTE_VALIDATOR_HARNESS_DECISION.md`
- `docs/TASK_98_DRIVE_MOCK_ROUTE_DECISION.md`
- `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`
- `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`

Archived Drive/RAG planning history:

- `docs/archive/tasks/TASK_90_GOOGLE_DRIVE_API_SYNC_ARCHITECTURE.md`
- `docs/archive/tasks/TASK_91_DRIVE_METADATA_SCHEMA_PLAN.md`
- `docs/archive/tasks/TASK_92_DRIVE_METADATA_SCHEMA_SQL_DRAFT.sql`
- `docs/archive/tasks/TASK_93_DRIVE_BACKEND_ADAPTER_PLAN.md`

Read old Drive/RAG TASK files only when changing Drive metadata planning, Drive backend boundaries, route contracts, or future RAG readiness. They do not authorize actual Google Drive API, embedding, vector, or chatbot implementation.

## TASK Documents Are Work History

`docs/TASK_*` and `docs/archive/tasks/TASK_*` files are task-level records. They are useful for audit and context, but they should not all be treated as active policy.

Current policy order:

1. `AGENTS.md`
2. `README.md`
3. `docs/HANDOFF.md`
4. `docs/README_INDEX.md`
5. latest relevant domain baseline document
6. old TASK documents only as supporting history

When an older TASK document conflicts with HANDOFF or a newer baseline, use the newer baseline and mention the conflict in the task report.

## Archive Candidate Criteria

A TASK document is an archive candidate when all are true:

- its outcome is summarized in `docs/HANDOFF.md`
- its durable rule is captured in README, this index, or a domain baseline document
- it is not the latest active baseline for a domain
- it contains no pending decision that is still open
- moving it would not break a current README or HANDOFF link

Do not move archive candidates during ordinary feature work. Use a separate archive task.

Never archive or move:

- `README.md`
- `AGENTS.md`
- `docs/HANDOFF.md`
- `docs/README_INDEX.md`
- the latest active baseline for a domain
- documents directly linked from `README.md`
- documents directly required by the current HANDOFF resume note

Suggested future archive location:

```text
docs/archive/tasks/
```

## Current Archive State

TASK-103 reviewed archive candidates without moving files. A later docs cleanup created `docs/archive/tasks/` and moved clearly historical task artifacts there.

Keep in place for now:

- `docs/TASK_94_MOCK_DRIVE_BACKEND_REPOSITORY_BOUNDARY.md`
- `docs/TASK_95_DRIVE_BACKEND_ROUTE_BOUNDARY_DECISION.md`
- `docs/TASK_96_DRIVE_BACKEND_CONTRACT_AND_FAKE_CLIENT.md`
- `docs/TASK_97_DRIVE_ROUTE_VALIDATOR_HARNESS_DECISION.md`
- `docs/TASK_98_DRIVE_MOCK_ROUTE_DECISION.md`
- `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`
- `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`

These are recent Drive, route, and deployment boundary documents and are still directly relevant to future `/api/drive/*` work.

Moved to `docs/archive/tasks/`:

- early Supabase planning TASK files before `docs/TASK_57_SUPABASE_RPC_MILESTONE_LOCK.md` that were absorbed by HANDOFF, mapping docs, or later RPC baselines
- early Ads screen and connector planning docs absorbed by the current Ads baseline and later reader boundary docs
- Drive planning TASK files `docs/archive/tasks/TASK_90_GOOGLE_DRIVE_API_SYNC_ARCHITECTURE.md` through `docs/archive/tasks/TASK_93_DRIVE_BACKEND_ADAPTER_PLAN.md`

Do not archive newer Drive/API route boundary docs `TASK_94` through `TASK_100` yet.

## New Document Rules

Prefer updating an existing baseline document when the change is a small clarification.

Create a new TASK document only when:

- the task introduces a new decision boundary
- the task needs audit history
- the task separates planning from implementation
- the task records security, deployment, SQL, API, or credential guardrails

For future Drive/API work:

- do not add actual Google Drive API-backed route behavior until an approved route task
- do not add Google Drive API packages or credentials in docs-only tasks
- keep route/API work separate from embedding/vector/RAG answer work
- keep runtime activation separate from planning documents

## Next Maintenance Step

Continue TASK-107 from the current Drive/API boundary. If docs sprawl grows again, run a separate cleanup task and move only clearly historical files after checking references.
