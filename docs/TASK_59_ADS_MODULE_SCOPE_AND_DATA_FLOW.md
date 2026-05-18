# TASK-59 Ads Module Scope And Data Flow

## Purpose

This document defines the SALMAN OS v1 Ads module scope and data flow before implementation.

This task is planning only.

- No Ads UI implementation
- No Google Sheets connection
- No SQL execution
- No Supabase/RLS/RPC changes
- No GEO, RAG, or Calendar implementation

## Ads Module v1 Purpose

The SALMAN OS Ads module helps internal staff review each client's Naver Ads operating state from one internal operations center.

v1 should focus on:

- 광고 성과 현황 파악
- 이상 징후와 리스크 신호 확인
- 담당자 액션 정리
- 고객사 공유용 리포트 초안 작성 보조

The Ads module is not an ad execution console in v1.

## System Relationship

### salman-naver-report-auto

Role: data collection engine.

- Logs into or calls the required Naver Ads/reporting side outside SALMAN OS.
- Collects each client's Naver Ads raw data.
- Writes raw data into each client's Google Sheets.
- Owns collection timing, source extraction, and raw tab refresh.

### Client Google Sheets

Role: raw data store.

- Stores client-specific Naver Ads raw tabs.
- Remains the source file/data workspace for Ads raw report data.
- Can be linked from SALMAN OS as the original operational source.

### SALMAN OS Ads Module

Role: visualization, audit, action, and report layer.

- Reads the prepared client Google Sheets data.
- Shows Ads dashboards inside SALMAN OS.
- Calculates or displays audit results and risk signals.
- Turns issues into 담당자 액션리스트.
- Produces customer-facing report draft content for review.

## Ads v1 Tabs

1. 전체 광고 현황
2. 고객사별 광고 상세
3. AI 광고 감사
4. 담당자 액션리스트
5. 고객사 리포트 초안

## v1 Input Data Source

Allowed input:

- Client Google Sheets raw tabs created or refreshed by `salman-naver-report-auto`

Not allowed in SALMAN OS v1:

- Direct Naver Ads login
- Direct campaign manager session inside SALMAN OS
- Direct bid/campaign mutation API
- Raw Naver credential handling in the frontend

## v1 Output

The Ads module should output:

- health score
- risk signals
- action items
- client-facing report draft

The output is advisory and review-oriented. Staff should review before sending any client-facing report.

## v1 Exclusions

- No bid changes
- No campaign edits
- No auto budget movement
- No direct Naver login inside SALMAN OS
- No GEO
- No RAG integration yet
- No automatic client-send workflow
- No mixing Ads execution, Ads reporting, GEO, and ClientDetail expansion in one task

## Data Flow

```text
Naver Ads source
  -> salman-naver-report-auto
  -> client Google Sheets raw tabs
  -> SALMAN OS Ads module
  -> dashboard / audit / action items / report draft
```

## Implementation Order Recommendation

1. Define expected Google Sheets tab names and column contracts.
2. Create a read-only Ads data adapter plan.
3. Design mock Ads view models and UI states.
4. Implement Ads UI with mock data only.
5. Add Google Sheets read integration only after a separate approval.

## Guardrails

- Keep SALMAN OS as the operating center, not the data collector.
- Keep `salman-naver-report-auto` as the collection engine.
- Keep client Google Sheets as the Ads raw data store.
- Keep v1 outputs advisory unless a later approved task defines execution workflows.
- Keep GEO separate from this Ads module MVP.
