# TASK-76 Gitignore Credentials Hardening

## Purpose

Google Sheets actual API reader를 구현하기 전에 local/server-only credential 경계를 먼저 고정한다. SALMAN OS 광고 운영 모듈은 이후 고객사 Google Sheets raw 데이터를 읽을 예정이지만, Google credential, OAuth token, service account key, local secret 파일은 Git에 올라가면 안 된다.

이번 TASK는 `.gitignore` 보안 강화와 문서화만 수행한다. Google Sheets API 구현, credential 추가, `.env.local` 수정, Supabase/RLS/RPC 변경은 하지 않는다.

## Ignored Categories

- Local env files: `.env`, `.env.*`
- Local secret directories and files: `.secrets/`, `secrets/`, `*.local.json`, `*.secret.json`, `*.secrets.json`
- Google/GCP/Sheets credentials: `credentials*.json`, `*credentials*.json`, `client_secret*.json`, `service-account*.json`, `*service-account*.json`, `*service_account*.json`, `google-service-account*.json`, `google-credentials*.json`, `gcp-credentials*.json`, `sheets-credentials*.json`, `credentials/`
- OAuth/token files: `token*.json`, `*token*.json`, `google-token*.json`, `sheets-token*.json`, `oauth-token*.json`, `tokens/`
- Private key material: `*.pem`, `*.key`, `*.p12`

## Allowed Example Files

`.env.example`은 계속 추적 가능해야 한다. 실제 secret 값이 없는 placeholder 문서 역할이므로 `.env.*` ignore 뒤에 `!.env.example` 예외를 명시한다.

Docs, tests, mock config, example 파일은 불필요하게 숨기지 않는다. 이번 패턴은 credential/token/private key/local env 범주에만 맞춘다.

## Secret Handling

이번 TASK에서는 실제 secret 파일 내용을 확인하지 않았다. `.env`, credential, token, service account JSON, private key 파일의 내용은 열거나 출력하지 않는다.

검증은 실제 secret 파일 생성 없이 `git check-ignore --stdin`에 임시 파일명만 전달해 수행한다.

## Next Step

다음 최적 TASK는 Google Sheets actual API reader 구현 전에 local credential path validation을 설계/구현하는 것이다. 이 단계에서도 credential 값 자체를 출력하지 않고, 경로 존재 여부와 ignore/환경 경계만 안전하게 검증해야 한다.
