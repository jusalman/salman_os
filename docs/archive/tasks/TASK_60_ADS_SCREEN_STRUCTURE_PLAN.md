# TASK-60 Ads Screen Structure Plan

## Purpose

This document defines the SALMAN OS Ads module screen structure, navigation placement, tab composition, and placeholder UI scope before implementation.

This task is planning only.

- No Ads UI implementation
- No Google Sheets connection
- No Supabase/RLS/RPC changes
- No SQL execution
- No GEO, RAG, or Calendar implementation

## Navigation Decision

Ads should appear as a first-class SALMAN OS workspace section, separate from the existing customer operation center panels.

Recommended navigation placement:

- Primary workspace navigation: `고객사 운영` and `광고 운영`
- `고객사 운영`: current ClientList and client operation center
- `광고 운영`: new Ads module entry point

Rationale:

- Ads is client-related, but it has a distinct workflow from files, tasks, schedule, business money, links, and logs.
- Ads should not be hidden inside ClientDetail because it needs cross-client overview and staff action queues.
- GEO must not appear in this navigation group for Ads v1.

## Ads v1 Information Architecture

Ads module top-level screen:

- Header: `광고 운영`
- Supporting copy: `고객사 Google Sheets 원본 데이터를 기준으로 광고 현황, 감사 결과, 액션, 리포트 초안을 확인합니다.`
- Source note: `데이터 수집은 salman-naver-report-auto가 담당하며, SALMAN OS는 시각화와 검토 레이어입니다.`
- Tab navigation:
  1. 전체 광고 현황
  2. 고객사별 광고 상세
  3. AI 광고 감사
  4. 담당자 액션리스트
  5. 고객사 리포트 초안

## Tab Purposes And Placeholder Copy

### 1. 전체 광고 현황

Purpose:

- Show cross-client Ads health at a glance.
- Surface spend, conversion, warning, and freshness status once data is connected.

Placeholder copy:

`광고 전체 현황은 준비 중입니다. 이후 고객사 Google Sheets 원본 데이터를 기준으로 예산, 성과, 위험 신호를 한 화면에 요약합니다.`

### 2. 고객사별 광고 상세

Purpose:

- Show per-client campaign/ad group/keyword summary after Google Sheets read integration.
- Keep direct Naver login outside SALMAN OS.

Placeholder copy:

`고객사별 광고 상세는 준비 중입니다. SALMAN OS는 네이버 광고에 직접 로그인하지 않고, 고객사 Google Sheets에 정리된 원본 데이터를 읽어 표시합니다.`

### 3. AI 광고 감사

Purpose:

- Present audit findings, health score, and risk signals.
- v1 planning may call it AI-facing in product language, but implementation should begin with deterministic placeholder/rule structure until a separate AI/RAG approval exists.

Placeholder copy:

`AI 광고 감사 화면은 준비 중입니다. v1에서는 자동 실행이나 캠페인 수정 없이, 광고 위험 신호와 점검 결과를 검토용으로 표시하는 방향을 먼저 잡습니다.`

### 4. 담당자 액션리스트

Purpose:

- Convert Ads issues into staff-owned action items.
- Help internal staff track what to check next.

Placeholder copy:

`담당자 액션리스트는 준비 중입니다. 광고 점검 결과에서 확인이 필요한 항목을 담당자별 업무로 정리할 예정입니다.`

### 5. 고객사 리포트 초안

Purpose:

- Draft customer-facing Ads report text from normalized data and audit findings.
- Staff must review before sending.

Placeholder copy:

`고객사 리포트 초안은 준비 중입니다. 광고 현황과 점검 결과를 바탕으로 고객사 공유 전 검토할 초안을 생성하는 화면입니다.`

## First Implementation Scope

First implementation should be UI placeholder only.

Allowed:

- Add `광고 운영` navigation placeholder.
- Add Ads module shell and tab placeholders.
- Use static placeholder copy only.
- Match the existing Korean SALMAN OS visual tone.

Not allowed:

- No Google Sheets connection yet.
- No audit engine yet.
- No report generation yet.
- No Naver Ads login or mutation workflow.
- No GEO or RAG integration.
- No Supabase/RLS/RPC change.

## Later Implementation Order

1. Placeholder UI.
2. Google Sheets connector plan.
3. Data normalizer.
4. Dashboard metrics.
5. Audit rules.
6. Report draft generator.

Each step should be a separate approved task with its own scope and verification.

## Guardrails

- Keep Ads v1 read-only and review-oriented.
- Keep `salman-naver-report-auto` as the data collection engine.
- Keep client Google Sheets as the raw data store.
- Keep SALMAN OS Ads as the visualization/audit/action/report layer.
- Do not mix Ads with GEO, RAG, Calendar, or ClientDetail expansion in one task.
