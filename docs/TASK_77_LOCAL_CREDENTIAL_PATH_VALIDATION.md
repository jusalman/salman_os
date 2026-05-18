# TASK-77 Local Credential Path Validation

## Purpose

Google Sheets actual API reader를 구현하기 전에 SALMAN OS 광고 운영 모듈이 사용할 local/server-only credential path의 안전 기준을 코드로 고정한다. 이 단계는 credential 값을 검증하는 것이 아니라, credential 파일을 참조하는 경로가 repository에 커밋될 위험이 없는 형태인지 확인하는 선행 안전장치다.

## Validation Criteria

- 빈 값, `null`, `undefined`는 error로 처리한다.
- relative path는 error로 처리한다.
- `.env.example`, `credentials.example.json` 같은 example 파일은 error로 처리한다.
- repository 내부 absolute path는 error로 처리한다.
- repository 외부 local absolute path는 허용한다.
- Windows drive path와 Unix absolute path를 모두 문자열 기준으로 판정한다.
- token 또는 service account로 보이는 파일명 자체는 차단하지 않지만, local/server 전용 absolute path일 때만 허용한다.

## Credential Content Boundary

`validateLocalCredentialPath()`는 파일 내용을 읽지 않는다. `fs` 접근, Google Sheets API 호출, credential JSON 파싱, token 출력, `.env.local` 접근을 하지 않는다.

반환값은 throw가 아니라 diagnostic object 기반이다. 호출자는 `ok`, `normalizedPath`, `diagnostics`를 보고 actual reader 실행 여부를 결정해야 한다.

## Why Before Actual API Reader

actual Google Sheets API reader는 credential path를 입력받아야 한다. 경로 검증 없이 reader를 구현하면 repository 내부 credential, example 파일, relative path가 실수로 연결될 수 있다. TASK-77은 actual API 연결 전 단계에서 이 위험을 먼저 차단한다.

## Next Step

다음 단계는 이 검증 유틸을 기준으로 local-only Google Sheets reader의 activation/env boundary를 설계하는 것이다. 그 다음 별도 승인된 TASK에서만 실제 Google Sheets API reader 구현을 진행한다.
