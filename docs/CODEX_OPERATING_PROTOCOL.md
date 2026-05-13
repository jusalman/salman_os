# SALMAN OS Codex Operating Protocol

## Purpose

이 문서는 YOMI Codex Project Operating Protocol v1의 핵심 운영 원칙을 SALMAN OS 현재 상태에 맞게 정리한 것이다.

SALMAN OS는 새 프로젝트 초기화 단계가 아니라 TASK-17까지 완료된 내부 직원용 고객사 운영센터 MVP다. 따라서 초기 세팅 지시는 그대로 적용하지 않고, 현재 문서와 범위를 보존하면서 TASK-18로 이어지는 방식으로만 사용한다.

## Current Project Baseline

- 프로젝트명은 SALMAN OS다.
- 로컬 폴더명과 레포 표기는 `salman_os`다.
- 현재 상태는 TASK-17 완료다.
- 다음 작업은 TASK-18 Supabase schema SQL 초안 작성이다.
- Supabase 실제 연결, 실제 `.env` 생성, 실제 URL/KEY 입력, SQL 실행은 아직 하지 않는다.
- SALMAN OS v1은 Google Sheets, Google Drive, Google Calendar 대체재가 아니라 내부 직원용 고객사 운영센터다.

## Compact Engineer Mode

- 짧고 실행 가능한 답변을 우선한다.
- 작업 전 현재 파일과 범위를 확인한다.
- 변경 내용은 작게 유지하고, 사용자가 승인한 범위를 넘지 않는다.
- 설명은 결정에 필요한 근거 중심으로 제공한다.
- 진행 중 발견한 충돌이나 위험은 숨기지 않고 즉시 알린다.

## Plan-First Rule

- 구조 변경, 문서 체계 변경, SQL 초안, 데이터 모델 변경 전에는 먼저 계획을 제안한다.
- 사용자가 “먼저 계획만” 또는 “수정하지 마”라고 요청하면 파일을 생성하거나 수정하지 않는다.
- 승인 후 write phase에서만 변경한다.
- 계획에는 수정 파일, 생성 파일, 제외 범위, 검증 방법을 포함한다.

## Small Diff Rule

- 한 번의 작업은 목적이 분명한 작은 diff로 제한한다.
- 기존 루트 문서를 임의로 이동하지 않는다.
- `src`, `public`, `package.json`은 별도 요청 없이는 수정하지 않는다.
- 문서 작업 중 코드 변경이 필요해 보이면 먼저 사용자 승인을 받는다.
- TASK-18 전에는 SQL 파일을 만들지 않고, 실제 SQL 실행도 하지 않는다.

## Safety Rules

- 사용자 승인 전 위험 작업을 하지 않는다.
- 실제 `.env` 파일을 생성하지 않는다.
- 실제 Supabase URL, anon key, service role key 등 실제 키를 입력하지 않는다.
- Supabase 프로젝트에 연결하지 않는다.
- SQL을 실행하지 않는다.
- `@supabase/supabase-js`를 설치하지 않는다.
- Google Drive API, Google Calendar API, OpenAI API를 연결하지 않는다.
- Playwright 자동화를 실행하거나 추가하지 않는다.
- 외부 고객 포털 기능을 v1에 포함하지 않는다.
- 삭제보다 보관을 우선하며, 문서상 삭제 정책은 `99_Archive` 보관 처리 기준을 유지한다.

## Verification Rule

- 문서만 수정한 경우에도 가능한 기본 검증을 실행한다.
- 현재 권장 검증 명령은 `npm.cmd run lint`와 `npm.cmd run build`다.
- 검증을 실행하지 못했거나 실패했다면 최종 보고에 이유와 실패 지점을 남긴다.
- 검증 과정에서 새 의존성을 설치하지 않는다.

## Git Rule

- 사용자가 명시하지 않으면 commit, amend, reset, force push를 하지 않는다.
- 기존 변경사항을 임의로 되돌리지 않는다.
- 작업 전후 `git status`로 변경 범위를 확인하는 것을 권장한다.
- 관련 없는 파일 변경은 건드리지 않는다.

## Handoff Rule

- 작업 종료 시 다음 사람이 바로 이어갈 수 있도록 `docs/HANDOFF.md`를 최신 상태로 유지한다.
- Handoff에는 현재 TASK 상태, 완료 요약, 다음 작업, 금지 사항, 검증 명령을 남긴다.
- Handoff는 긴 회고가 아니라 재개를 위한 운영 메모여야 한다.

## Context Management Rule

- 장기 규칙은 `AGENTS.md`에 짧게 두고, 긴 운영 지침은 이 문서에 둔다.
- 현재 진행 상태와 다음 작업은 `docs/HANDOFF.md`에 둔다.
- v1 범위 기준은 `MVP_SCOPE_LOCK.md`와 `AGENTS.md`를 우선한다.
- Supabase 명명 기준은 `SUPABASE_NAMING_CONVENTIONS.md`를 우선한다.
- Supabase read mapping 기준은 `SUPABASE_READ_MAPPING.md`를 참고한다.

## SALMAN OS Development Harness

SALMAN OS Development Harness는 Superpowers, G-Stack, Compound Engineering 계열의 작업 습관을 현재 SALMAN OS 운영 방식에 맞게 축약한 실행 규칙이다.

### Planning Harness

- AI가 바로 구현하지 않도록 먼저 TASK 단위 계획을 만든다.
- 한 번에 하나의 TASK만 진행한다.
- 구조 변경, SQL 초안, 데이터 경계 변경, 문서 체계 변경은 승인 전에는 계획 단계에 머문다.
- 사용자가 승인한 뒤에만 write phase로 들어간다.
- 구현이나 문서 수정은 작은 diff로 제한하고, 현재 TASK 목표 밖으로 확장하지 않는다.

### Security / Quality Harness

- `.env`, SQL, Supabase, 외부 API, 보안 관련 작업은 별도 승인 전에는 실행하지 않는다.
- 실제 URL, key, token, secret, service role 정보는 문서에도 넣지 않는다.
- Supabase 실제 연결, SQL 실행, 패키지 설치, API 연결은 승인 없는 기본 동작이 아니다.
- 변경 전에는 v1 범위와 v1.5 이후 범위가 섞이지 않는지 확인한다.
- 변경 후에는 가능한 기본 검증 명령을 실행하고 결과를 남긴다.

### Learning Harness

- 실패한 작업은 원인, 막힌 지점, 재시도 조건을 `docs/HANDOFF.md`에 남긴다.
- 성공한 작업도 검증 명령과 다음 작업을 `docs/HANDOFF.md`에 남긴다.
- 다음 세션은 Handoff를 먼저 읽고 이어서 진행한다.
- 반복되는 실수나 승인 누락이 있으면 다음 TASK 전에 운영 규칙을 먼저 보정한다.

## Non-Applicable YOMI Initialization Guidance

YOMI 프로토콜의 새 프로젝트 초기화 지시는 SALMAN OS에 그대로 적용하지 않는다.

- 새 레포 생성 지시는 비적용이다.
- 기존 문서 구조를 초기화하거나 재배치하지 않는다.
- TASK-00부터 다시 시작하지 않는다.
- 이미 완료된 TASK-17 상태를 리셋하지 않는다.
- 초기 환경변수 생성, 실제 서비스 연결, API 키 입력 지시는 비적용이다.

## TASK-18 Guardrails

TASK-18은 Supabase schema SQL 초안 작성이다. 단, 다음 경계를 유지한다.

- 실제 Supabase 연결 금지
- 실제 `.env` 생성 금지
- 실제 URL/KEY 입력 금지
- SQL 실행 금지
- 필요 시 SQL은 초안 문서 또는 승인된 초안 파일로만 작성
- v1 범위를 넘어서는 자동화, AI 실행, 외부 포털 기능 제외
