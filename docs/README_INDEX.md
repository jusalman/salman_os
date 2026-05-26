# SALMAN OS Docs Index

## Purpose

This index keeps the growing `docs/` folder usable before more Drive, API, Supabase, or deployment work is added.

It does not move, delete, or rewrite existing TASK documents. TASK documents remain work history unless a later task explicitly archives them.

## How To Read Docs

Use this order for normal work:

1. Read `README.md` for the current project, verification, env, and deployment summary.
2. Read `docs/HANDOFF.md` for the current task state and next task.
3. Read `AGENTS.md` for SALMAN OS scope and safety rules.
4. Read only the domain-specific documents needed for the task.

Do not read every old TASK document by default. Most TASK files are historical context, not current operating policy.

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

Supabase task history:

- `docs/TASK_32_READ_ADAPTER_PLAN.md`
- `docs/TASK_34_CLIENT_SUMMARY_ASSEMBLY_PLAN.md`
- `docs/TASK_35_SUPABASE_CLIENT_LIST_REPOSITORY_PLAN.md`
- `docs/TASK_38_SUPABASE_ACTIVATION_GATE_PLAN.md`
- `docs/TASK_40_CLIENT_LIST_ACTIVATION_SMOKE_TEST_PLAN.md`
- `docs/TASK_46_CLIENT_SEED_SQL.md`
- `docs/TASK_48_RLS_READ_POLICY_PLAN.md`
- `docs/TASK_49_CLIENT_LIST_READ_SURFACE_SPEC.md`
- `docs/TASK_50_CLIENT_LIST_RPC_ADAPTER_PLAN.md`
- `docs/TASK_53_CLIENT_LIST_RPC_SQL.md`
- `docs/TASK_55_RLS_CLEANUP_AND_PRODUCTION_ORDER.md`

Read old Supabase TASK files only when changing ClientList RPC behavior, RLS policy plans, SQL drafts, or Supabase activation boundaries.

## Ads Docs Group

Current useful Ads baseline:

- `docs/TASK_59_ADS_MODULE_SCOPE_AND_DATA_FLOW.md`
- `docs/TASK_63_ADS_VIEW_MODEL_CONTRACT.md`
- `docs/TASK_65_ADS_METRICS_AND_HEALTH_SCORE_RULES.md`
- `docs/TASK_68_ADS_SHEETS_CONFIG_AND_CREDENTIALS_BOUNDARY.md`
- `docs/TASK_80_ADS_SHEETS_READER_FACTORY_WIRING.md`

Ads task history:

- `docs/TASK_60_ADS_SCREEN_STRUCTURE_PLAN.md`
- `docs/TASK_62_ADS_GOOGLE_SHEETS_CONNECTOR_PLAN.md`
- `docs/TASK_73_ADS_SHEETS_SERVER_BOUNDARY_PLAN.md`
- `docs/TASK_75_ADS_LOCAL_SHEETS_READER_PLAN.md`
- `docs/TASK_76_GITIGNORE_CREDENTIALS_HARDENING.md`
- `docs/TASK_77_LOCAL_CREDENTIAL_PATH_VALIDATION.md`
- `docs/TASK_78_ADS_SHEETS_ACTIVATION_ENV_BOUNDARY.md`
- `docs/TASK_79_ADS_SHEETS_READER_ACTIVATION_WIRING.md`

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

Drive/RAG planning history:

- `docs/TASK_90_GOOGLE_DRIVE_API_SYNC_ARCHITECTURE.md`
- `docs/TASK_91_DRIVE_METADATA_SCHEMA_PLAN.md`
- `docs/TASK_92_DRIVE_METADATA_SCHEMA_SQL_DRAFT.sql`
- `docs/TASK_93_DRIVE_BACKEND_ADAPTER_PLAN.md`

Read old Drive/RAG TASK files only when changing Drive metadata planning, Drive backend boundaries, route contracts, or future RAG readiness. They do not authorize actual Google Drive API, embedding, vector, or chatbot implementation.

## TASK Documents Are Work History

`docs/TASK_*` files are task-level records. They are useful for audit and context, but they should not all be treated as active policy.

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

## Current Archive Review

TASK-103 reviewed archive candidates without moving files.

Keep in place for now:

- `docs/TASK_94_MOCK_DRIVE_BACKEND_REPOSITORY_BOUNDARY.md`
- `docs/TASK_95_DRIVE_BACKEND_ROUTE_BOUNDARY_DECISION.md`
- `docs/TASK_96_DRIVE_BACKEND_CONTRACT_AND_FAKE_CLIENT.md`
- `docs/TASK_97_DRIVE_ROUTE_VALIDATOR_HARNESS_DECISION.md`
- `docs/TASK_98_DRIVE_MOCK_ROUTE_DECISION.md`
- `docs/TASK_99_VERCEL_ROUTE_BASELINE_AND_TEST_CONVENTION.md`
- `docs/TASK_100_SALMAN_OS_DEPLOYMENT_BASELINE.md`

These are recent Drive, route, and deployment boundary documents and are still directly relevant to future `/api/drive/*` work.

Do not move yet, but likely archive candidates after a dedicated move task:

- early Supabase planning TASK files before `docs/TASK_57_SUPABASE_RPC_MILESTONE_LOCK.md`
- early Ads planning TASK files before `docs/TASK_80_ADS_SHEETS_READER_FACTORY_WIRING.md`
- Drive planning TASK files `docs/TASK_90_GOOGLE_DRIVE_API_SYNC_ARCHITECTURE.md` through `docs/TASK_93_DRIVE_BACKEND_ADAPTER_PLAN.md` if their durable rules stay covered by TASK-94 through TASK-100 and this index

Before moving any candidate, update links in `README.md`, `docs/HANDOFF.md`, and this index if needed.

## New Document Rules

Prefer updating an existing baseline document when the change is a small clarification.

Create a new TASK document only when:

- the task introduces a new decision boundary
- the task needs audit history
- the task separates planning from implementation
- the task records security, deployment, SQL, API, or credential guardrails

For future Drive/API work:

- do not create `/api/drive/*` route files until the approved route task
- do not add Google Drive API packages or credentials in docs-only tasks
- keep route/API work separate from embedding/vector/RAG answer work
- keep runtime activation separate from planning documents

## Next Maintenance Step

If docs sprawl still blocks work, run a separate TASK-104 to create `docs/archive/tasks/` and move only the clearly historical TASK files identified above without changing their contents.
