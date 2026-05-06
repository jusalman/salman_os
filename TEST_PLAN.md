# SALMAN OS Test Plan

## Purpose

이 문서는 SALMAN OS v1 MVP의 테스트 기준을 정의한다. 테스트의 핵심은 내부 직원이 고객사 운영 정보를 한 화면에서 연결해 확인할 수 있는지 검증하는 것이다.

## Scope Tests

### Product Positioning

- SALMAN OS가 Google Sheets, Google Drive, Google Calendar 대체재처럼 설명되지 않는다.
- SALMAN OS가 내부 고객사 운영센터로 설명된다.
- v1 사용자가 내부 직원으로 제한된다.

### Login

- 공통 비밀번호 `salman1!` 입력이 가능하다.
- 본인 이름 입력이 가능하다.
- 직원별 이메일 인증이나 외부 고객 로그인 흐름이 없다.

## Core Flow Tests

### Client Operation Center

- 고객사 목록에서 고객사를 선택할 수 있다.
- 고객사 상세 화면에서 자료, 업무, 일정, 비즈머니, 링크, 로그가 함께 보인다.
- 고객사별 담당자와 상태를 확인할 수 있다.

### Files

- Google Drive 원본 파일 링크가 표시된다.
- 원본 파일은 Google Drive에서 열린다.
- SALMAN OS가 파일 원본 저장소처럼 동작하지 않는다.
- 파일 삭제는 영구 삭제가 아니라 `99_Archive` 보관 처리로 표현된다.

### Tasks

- 고객사별 업무를 확인할 수 있다.
- 업무 상태, 담당자, 마감일을 확인할 수 있다.
- 관련 파일 링크와 업무가 연결될 수 있다.

### Events

- 고객사별 내부 일정을 확인할 수 있다.
- 일정 데이터는 Supabase 기반으로 설명된다.
- Google Calendar 연동 버튼이나 고객사별 실제 Google Calendar 생성 흐름이 없다.

### Business Money

- 비즈머니 확인 링크가 표시된다.
- 확인 필요, 확인 완료, 이슈 상태를 구분할 수 있다.
- 자동 수집처럼 보이는 기능이나 문구가 없다.

### Operation Logs

- 고객사별 최근 변경 사항이 로그로 남는다.
- 업무, 일정, 파일, 비즈머니, 링크 변경이 로그와 연결된다.

## Smart Operation Views Tests

- Smart Operation Views는 AI 없이 템플릿 기반으로 동작한다고 설명된다.
- 마감 임박, 확인 필요, 최근 변경 같은 필터형 뷰를 제공한다.
- AI 추천, AI 직원 실행, OpenAI API 호출 흐름이 없다.

## Negative Tests

다음 기능은 v1에서 없어야 한다.

- OpenAI API 연동
- AI 직원 실행
- 비즈머니 자동 수집
- Playwright 자동화
- Google Calendar 연동
- 고객사별 실제 Google Calendar 생성
- 외부 고객 포털

## Documentation Verification

문서 검증 시 다음을 확인한다.

- 프로젝트명은 SALMAN OS로 통일되어 있다.
- 폴더/레포 표기는 `salman_os`로 통일되어 있다.
- Supabase는 운영 데이터 기준으로 설명된다.
- Google Drive는 원본 파일 기준으로 설명된다.
- AI 직원 기능은 v1.5 이후 활성화 예정으로 설명된다.
