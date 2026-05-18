# TASK-78 Ads Sheets Activation Env Boundary

## Purpose

Google Sheets actual API reader를 구현하기 전에 광고 운영 Sheets reader의 activation/env boundary를 문서로 확정한다. 목표는 local/server-only credential path를 안전하게 다루고, Vite browser/client bundle에 credential 관련 값이 들어가지 않도록 구현 전 기준을 고정하는 것이다.

이번 TASK는 계획/문서 작업만 수행한다. 실제 Google Sheets API 연결, credential/token 파일 내용 접근, `.env.local` 출력, Supabase/RLS/RPC 변경, 광고 운영 UI 변경, mock pipeline 동작 변경은 하지 않는다.

## Current Mock Pipeline State

현재 광고 운영 화면은 실제 Google Sheets가 아니라 mock pipeline을 사용한다.

- Mock config reader
- Raw sheet normalizer
- Ads metrics calculator
- Ads operations view model builder
- UI는 `buildMockAdsOperationsViewModel()` 결과를 사용

이 기본값은 local-only reader가 명시적으로 활성화되기 전까지 유지한다.

## Activation Conditions

local-only Google Sheets reader는 아래 조건을 모두 만족할 때만 후보가 된다.

- 실행 위치가 browser/client bundle이 아닌 local/server-only boundary다.
- `ADS_SHEETS_READER_MODE=local`이 명시적으로 설정되어 있다.
- credential path env가 설정되어 있다.
- `validateLocalCredentialPath()`가 credential path를 `ok: true`로 판정한다.
- reader 구현이 sanitized result만 domain pipeline에 전달한다.

기본값 또는 누락값은 `mock`으로 본다.

## Env Name Draft

아래 env 이름은 server/local-only 용도다. Vite client runtime에 노출하면 안 된다.

- `ADS_SHEETS_READER_MODE=mock | local`
- `ADS_GOOGLE_CREDENTIAL_PATH`
- `ADS_GOOGLE_TOKEN_PATH`
- `ADS_GOOGLE_SERVICE_ACCOUNT_PATH`

`ADS_GOOGLE_CREDENTIAL_PATH`는 일반 credential path placeholder로 사용할 수 있다. OAuth 방식이면 `ADS_GOOGLE_TOKEN_PATH`, service account 방식이면 `ADS_GOOGLE_SERVICE_ACCOUNT_PATH` 중 하나를 명확히 선택한다. 실제 값은 문서나 repo에 기록하지 않는다.

## VITE Prefix Rule

credential path, token path, service account path, Google API secret, private key 경로에는 `VITE_` 접두사를 사용하지 않는다.

Vite의 `VITE_` env는 browser/client bundle에서 접근 가능한 값으로 취급해야 한다. 따라서 아래 이름은 금지한다.

- `VITE_ADS_GOOGLE_CREDENTIAL_PATH`
- `VITE_ADS_GOOGLE_TOKEN_PATH`
- `VITE_ADS_GOOGLE_SERVICE_ACCOUNT_PATH`
- `VITE_GOOGLE_SERVICE_ACCOUNT_JSON`
- `VITE_GOOGLE_API_KEY`

client runtime은 credential 값이나 path를 알 필요가 없다.

## Client Bundle Exposure Boundary

브라우저/프론트엔드는 sanitized read layer만 호출한다.

- credential path를 import하거나 render하지 않는다.
- `.env.local` 값을 읽거나 출력하지 않는다.
- service account JSON, token JSON, private key 내용을 전달받지 않는다.
- Google Sheets actual API client를 browser bundle에 포함하지 않는다.
- domain normalizer, metrics, view model은 순수 로직으로 유지한다.

actual API reader가 호출 가능한 위치는 local script, Node server, server-only adapter 같은 비브라우저 경계로 제한한다.

## Fallback and Diagnostics

기본 mode가 없거나 `mock`이면 기존 mock pipeline을 유지한다.

`ADS_SHEETS_READER_MODE=local`로 명시했는데 credential path validation이 실패하면 silent mock fallback을 하지 않는다. 이 경우 diagnostic/error를 반환하고 local reader 실행을 차단한다.

Diagnostic 원칙은 다음과 같다.

- env 누락: 명시적 local mode에서는 error
- relative path: error
- example path: error
- repo 내부 path: error
- repo 외부 absolute path: 통과 후보
- credential 내용은 읽지 않음

## Pre-Implementation Checklist

actual Google Sheets API reader 구현 전 아래 항목을 확인한다.

- `.gitignore` credential/token/local secret 패턴이 유지되어 있다.
- `.env.example`은 실제 secret 없이 placeholder만 포함한다.
- local mode env는 `VITE_` 접두사를 쓰지 않는다.
- `validateLocalCredentialPath()` 테스트가 통과한다.
- local reader는 browser bundle에서 import되지 않는다.
- validation 실패 시 mock으로 조용히 넘어가지 않는다.
- output은 sanitized `AdsSheetsReader` result 형태로 domain pipeline에 전달한다.

## Next Task Scope

다음 TASK는 credential을 노출하지 않는 local-only Google Sheets reader interface wiring을 구현하는 것이다. 실제 Google Sheets API 호출까지 포함할지 여부는 별도 승인된 TASK에서 결정한다.
