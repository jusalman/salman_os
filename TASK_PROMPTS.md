# SALMAN OS Task Prompts

## Purpose

이 문서는 SALMAN OS 작업을 요청할 때 사용할 기준 프롬프트를 정리한다. 모든 프롬프트는 v1 내부 직원용 MVP 범위를 지켜야 한다.

## Common Context Prompt

```text
프로젝트명은 SALMAN OS이고, 로컬 폴더/레포 표기는 salman_os로 통일한다.
SALMAN OS는 Google Sheets, Google Drive, Google Calendar를 대체하는 시스템이 아니다.
고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그를 한 화면에서 연결해 보여주는 내부 직원용 고객사 운영센터 MVP다.
v1 접속 방식은 공통 비밀번호 salman1! + 본인 이름이다.
Supabase는 운영 데이터 기준이고, Google Drive는 원본 파일 기준이다.
v1 캘린더는 Google Calendar 연동이 아니라 Supabase 기반 내부 고객사별 일정 관리다.
Smart Operation Views는 AI 없이 템플릿 기반으로 제공한다.
```

## Documentation Prompt

```text
SALMAN OS v1 문서를 작성한다.
문서에서는 v1 범위와 v1.5 이후 범위를 분리한다.
OpenAI API, AI 직원 실행, 비즈머니 자동 수집, Playwright 자동화, Google Calendar 연동, 외부 고객 포털은 v1 제외 항목으로 명시한다.
파일 삭제는 영구 삭제가 아니라 99_Archive 보관 처리로 설명한다.
```

## UI Prompt

```text
SALMAN OS는 내부 직원용 운영 도구다.
첫 화면은 고객사 운영 정보를 바로 다루는 화면이어야 한다.
고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그가 연결되어 보이게 한다.
AI 채팅, Google Calendar 연결, 외부 고객 포털 메뉴는 만들지 않는다.
Smart Operation Views는 템플릿 기반 운영 필터로 표현한다.
```

## Database Prompt

```text
Supabase에 저장할 운영 데이터 구조를 설계한다.
고객사, 업무, 내부 일정, Drive 파일 메타데이터, 비즈머니 확인 상태, 주요 링크, 운영 로그를 고객사 기준으로 연결한다.
Google Drive 원본 파일은 Supabase에 저장하지 않고 링크와 메타데이터만 저장한다.
Google Calendar 연동 토큰이나 이벤트 ID는 v1에서 만들지 않는다.
```

## Testing Prompt

```text
SALMAN OS v1 MVP 기준으로 테스트한다.
공통 비밀번호 salman1! + 본인 이름 접속 흐름을 확인한다.
고객사별 자료, 업무, 내부 일정, 비즈머니, 링크, 로그가 한 화면에서 연결되는지 확인한다.
파일 보관 처리는 99_Archive 기준인지 확인한다.
OpenAI API, AI 직원 실행, 비즈머니 자동 수집, Playwright 자동화, Google Calendar 연동, 외부 고객 포털이 구현되거나 노출되지 않았는지 확인한다.
```

## Review Prompt

```text
SALMAN OS v1 범위 잠금 기준으로 검토한다.
기능이나 문구가 Google Workspace 대체재처럼 보이지 않는지 확인한다.
v1 일정이 Google Calendar 연동으로 오해되지 않는지 확인한다.
Smart Operation Views가 AI 기능처럼 표현되지 않는지 확인한다.
AI 직원 기능은 v1.5 이후 활성화 예정으로만 남긴다.
```
