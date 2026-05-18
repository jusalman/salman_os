# TASK-79 Ads Sheets Reader Activation Wiring

## Purpose

Local-only Google Sheets reader를 실제 API 호출 없이 활성화 후보로 판정하는 코드 경계를 추가한다. 목표는 광고 운영 Sheets reader가 언제 mock으로 유지되고, 언제 local reader 후보가 되며, 언제 diagnostic error로 차단되는지 순수 함수로 고정하는 것이다.

## Actual API Status

이번 TASK에서는 Google Sheets actual API reader를 구현하지 않는다.

- `googleapis` 패키지를 추가하지 않는다.
- Google Sheets API를 호출하지 않는다.
- credential/token/service account JSON 파일 내용을 읽지 않는다.
- 파일 존재 여부도 확인하지 않는다.
- `.env.local` 내용을 출력하지 않는다.

## Activation Resolver Decision

`resolveAdsSheetsReaderMode(envLike)`는 env-like object를 입력받아 activation 결과를 반환한다.

- env가 없으면 `mock`
- `ADS_SHEETS_READER_MODE=mock`이면 `mock`
- `ADS_SHEETS_READER_MODE=local`이고 local/server-only credential path validation이 통과하면 `local_candidate`
- 알 수 없는 mode는 `error`
- local mode에서 credential path가 없으면 `error`
- local mode에서 credential path validation이 실패하면 `error`

local mode 실패는 mock으로 조용히 fallback하지 않는다.

## Client Bundle Credential Exposure Block

resolver는 `VITE_` 접두사의 credential 관련 env가 발견되면 error diagnostic을 반환한다. Credential path, token path, service account path, secret, key, private key, JSON path는 browser/client bundle에 노출되면 안 된다.

금지 예시는 다음과 같다.

- `VITE_GOOGLE_CREDENTIAL_PATH`
- `VITE_ADS_GOOGLE_TOKEN_PATH`
- `VITE_ADS_GOOGLE_SERVICE_ACCOUNT_PATH`
- `VITE_GOOGLE_SERVICE_ACCOUNT_JSON`

허용되는 env 초안은 server/local-only 범위다.

- `ADS_SHEETS_READER_MODE`
- `ADS_GOOGLE_CREDENTIAL_PATH`
- `ADS_GOOGLE_SERVICE_ACCOUNT_PATH`
- `ADS_GOOGLE_TOKEN_PATH`

## Silent Fallback Rule

기본값은 mock이지만, 명시적으로 `ADS_SHEETS_READER_MODE=local`을 켠 뒤 validation이 실패하면 mock으로 되돌아가지 않는다. 이 상태는 설정 오류로 보고 diagnostic error를 반환해야 한다.

이 규칙은 실제 API reader 구현 전에 운영자가 credential 경계를 잘못 설정했을 때 오류를 숨기지 않기 위한 것이다.

## Next Task Scope

다음 TASK는 actual API 호출 없이 local-only reader factory와 sanitized `AdsSheetsReader` 연결부를 구현하는 것이다. 실제 Google Sheets API 호출은 별도 승인된 TASK로 분리한다.
