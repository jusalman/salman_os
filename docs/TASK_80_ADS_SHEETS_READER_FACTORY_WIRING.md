# TASK-80 Ads Sheets Reader Factory Wiring

## Purpose

Google Sheets actual API reader를 구현하기 전에 activation resolver 결과를 `AdsSheetsReader` factory에 연결한다. 목표는 mock reader, local reader candidate, error reader를 명확히 분기하면서 credential path나 token 값이 결과에 노출되지 않도록 하는 것이다.

이번 TASK는 factory wiring만 수행한다. Google Sheets API 호출, `googleapis` 패키지 추가, credential/token 파일 내용 읽기, 파일 존재 여부 체크, `.env.local` 출력, Vite client credential env 접근, Supabase/RLS/RPC 변경, 광고 운영 UI 변경은 하지 않는다.

## Factory Branching

`createAdsSheetsReaderFromEnv(envLike, deps)`는 env-like object와 주입된 reader deps를 받아 `AdsSheetsReader`를 반환한다.

- env 없음: `mockReader`
- `ADS_SHEETS_READER_MODE=mock`: `mockReader`
- `ADS_SHEETS_READER_MODE=local` + path validation 통과: `localReaderCandidate`
- invalid mode: sanitized error reader
- local mode + credential path 없음: sanitized error reader
- local mode + path validation 실패: sanitized error reader
- credential 관련 `VITE_` env 발견: sanitized error reader

## Reader Roles

- `mockReader`: 기존 mock pipeline을 유지하는 기본 reader다.
- `localReaderCandidate`: future local-only Google Sheets reader가 들어갈 주입 지점이다. 이번 TASK에서는 actual API 구현이 아니다.
- Error reader: `AdsSheetsReader` interface를 만족하지만 외부 호출을 하지 않고 activation diagnostic만 반환한다.

## Sanitized Diagnostics

Error reader diagnostic은 activation 실패 이유만 전달한다.

- credential path 원문을 포함하지 않는다.
- token path 원문을 포함하지 않는다.
- env 전체 dump를 포함하지 않는다.
- env 이름과 diagnostic code만 전달한다.
- local 활성화 실패 시 mock으로 조용히 fallback하지 않는다.

## Actual API Status

Google Sheets actual API reader는 아직 미구현이다. `localReaderCandidate`는 factory 경계가 준비되었음을 나타내는 주입 슬롯이며, 실제 Google API client나 credential file read는 별도 TASK에서만 구현한다.

## Next Task

다음 TASK는 factory boundary 뒤에 local Google Sheets API reader를 구현하는 것이다. 구현 시에도 credential path validation, `.gitignore` hardening, `VITE_` 금지, sanitized diagnostic 기준을 유지해야 한다.
