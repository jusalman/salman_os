# TASK-50 ClientList RPC Adapter Migration Plan

## Purpose

현재 base-table row reader 기반 ClientList Supabase adapter를 `public.get_client_list_summaries_v1()` RPC 기반으로 전환하기 위한 구현/테스트 계획이다.

- 문서 only
- 코드 전환 없음
- SQL 실행 없음
- runtime behavior 변경 없음

## Current Base-Table Flow Summary

현재 흐름:

1. `clientListRepository.ts`가 `rowsReader.listClients()`를 호출한다.
2. client id 목록을 만든다.
3. `members/tasks/events/files/moneyItems/links/logs`를 base table별로 병렬 조회한다.
4. `clientSummaryAssembler.ts`가 raw child rows를 집계해서 `ClientSummary`를 만든다.

현재 장점:

- row-level assembly 규칙이 테스트로 고정돼 있다.

현재 한계:

- production 방향과 달리 base table direct read에 의존한다.
- anon direct read 제한 방향과 맞지 않는다.
- ClientList만 필요한데 child table 전체 read orchestration이 남아 있다.

## RPC Response Shape Rule

RPC `public.get_client_list_summaries_v1()` 응답은 이미 ClientList summary-safe shape를 반환해야 한다.

기준 필드:

- `id`
- `name`
- `status`
- `owner_name`
- `drive_root_url`
- `memo`
- `updated_at`
- `open_task_count`
- `upcoming_event_count`
- `has_biz_money_warning`
- `latest_log_at`
- `has_drive_folder`
- `has_looker_link`
- `has_sheet_link`

Frontend mapping target:

- `id -> id`
- `name -> name`
- `status -> mapClientStatusFromDb(status)`
- `owner_name -> owner`
- `drive_root_url ?? '' -> driveRootUrl`
- `memo ?? '' -> memo`
- `updated_at -> updatedAt`
- `open_task_count -> openTaskCount`
- `upcoming_event_count -> upcomingEventCount`
- `has_biz_money_warning -> hasBizMoneyWarning`
- `latest_log_at -> latestLogAt`
- `has_drive_folder -> hasDriveFolder`
- `has_looker_link -> hasLookerLink`
- `has_sheet_link -> hasSheetLink`

## Adapter Decision

결정:

- 기존 assembler는 RPC migration path에서 유지하지 않는다.
- RPC 전용 mapper를 새로 만든다.

이유:

- assembler는 child rows 조합 책임을 가진다.
- RPC 경로는 이미 집계된 summary row를 받는다.
- assembler를 억지로 재사용하면 fake child rows 구조와 책임이 뒤섞인다.
- RPC mapper는 더 좁고 테스트도 단순하다.

권장 구조:

- `clientListRpcReader` 또는 동급의 RPC 호출 모듈 1개
- `mapClientSummaryFromRpcRow` 같은 전용 mapper 1개
- `createClientListSupabaseRepository`는 옵션 기반으로 row-reader path와 rpc-reader path를 모두 받을 수 있게 계획

## Test Strategy

1. Mapper unit test
- RPC row 1건을 `ClientSummary`로 정확히 매핑하는지 확인
- `null`/빈 문자열 fallback 확인
- `status` 변환 확인

2. Repository unit test
- RPC reader가 summary row 목록을 반환하면 repository가 그대로 `ClientSummary[]`를 반환하는지 확인
- 빈 배열이면 child read 없이 빈 결과인지 확인
- RPC reader failure가 그대로 reject 되는지 확인

3. Regression boundary test
- 기존 base-table repository 테스트는 유지
- 새 RPC repository 테스트를 별도로 추가
- activation gate/runtime selection은 이 TASK 범위에서는 변경하지 않음

4. Assembler test policy
- `clientSummaryAssembler.test.ts`는 base-table assembly 규칙 회귀 방지용으로 유지
- RPC migration 후에도 즉시 삭제하지 않음

## Dev/Local Smoke vs Production Split

local/dev smoke path:

- 기존 base-table smoke path를 당장 제거하지 않는다.
- 임시 smoke-test policy와 함께 local verification fallback 경로로만 유지 검토

production path:

- formal production path는 RPC only를 목표로 한다.
- anon은 base table direct read가 아니라 RPC execute만 사용한다.

정리:

- local/dev: base-table smoke path 허용 가능
- production: RPC path only

## Migration Steps

1. RPC row type 정의
2. RPC reader 초안 추가
3. RPC row -> `ClientSummary` mapper 추가
4. RPC repository unit tests 추가
5. 기존 repository factory에 RPC reader option 추가
6. production path에서 RPC repository를 선택하도록 후속 설계
7. local/dev smoke path와 production RPC path 분리 문서 갱신
8. 이후 별도 승인 TASK에서 실제 코드 전환

## Non-Goals In This Task

- 실제 RPC 호출 구현 안 함
- current runtime selection 변경 안 함
- ClientDetail/SmartViews 확장 안 함
- SQL 실행 안 함

## Recommended Next Step

- 후속 TASK에서 RPC reader + mapper + repository tests를 먼저 추가하고, runtime selection 전환은 그 다음 단계에서 분리 수행
