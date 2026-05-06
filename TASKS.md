# SALMAN OS Tasks

## Purpose

이 문서는 SALMAN OS v1 문서와 구현 준비 작업을 정리한다. v1은 내부 직원용 고객사 운영센터 MVP다.

## Product Tasks

- SALMAN OS의 역할을 Google Workspace 대체재가 아니라 고객사 운영 정보 연결 화면으로 고정한다.
- 내부 직원용 MVP 기준을 모든 문서와 화면 문구에 반영한다.
- 접속 방식을 공통 비밀번호 `salman1!`과 본인 이름으로 정의한다.
- AI 직원 기능은 v1.5 이후 활성화 예정으로 분리한다.

## Data Tasks

- Supabase를 운영 데이터 기준으로 설계한다.
- Google Drive를 원본 파일 기준으로 설계한다.
- 고객사, 업무, 일정, 파일, 비즈머니, 링크, 로그 데이터를 고객사 기준으로 연결한다.
- v1 일정은 Supabase 기반 내부 일정으로 설계한다.
- Google Calendar 연동 데이터는 만들지 않는다.

## File Tasks

- Google Drive 원본 파일 링크를 고객사별로 연결한다.
- 파일 상태에 active와 archived를 둔다.
- 파일 삭제는 영구 삭제가 아니라 `99_Archive` 보관 처리로 정의한다.
- 보관 처리 시 operation_logs에 기록한다.

## Screen Tasks

- 로그인 화면
- 고객사 목록 화면
- 고객사 상세 운영센터 화면
- 자료 패널
- 업무 패널
- 내부 일정 패널
- 비즈머니 패널
- 주요 링크 패널
- 운영 로그 패널
- 템플릿 기반 Smart Operation Views

## Test Tasks

- v1 제외 기능이 화면과 문서에 기능처럼 포함되지 않았는지 확인한다.
- Google Calendar 연동 표현이 남아 있지 않은지 확인한다.
- AI 기능이 v1 실행 기능으로 표현되지 않았는지 확인한다.
- 파일 삭제가 `99_Archive` 보관 처리로 표현되는지 확인한다.

## Out of Scope Tasks

다음 작업은 v1에서 하지 않는다.

- OpenAI API 연동
- AI 직원 실행
- 비즈머니 자동 수집
- Playwright 자동화
- Google Calendar 연동
- 고객사별 실제 Google Calendar 생성
- 외부 고객 포털 구축
