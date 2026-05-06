# SALMAN OS MVP Scope Lock

## Purpose

이 문서는 SALMAN OS v1 MVP 범위를 고정한다. v1은 내부 직원용 고객사 운영센터이며, 자동화 플랫폼이나 Google Workspace 대체재가 아니다.

## MVP Definition

SALMAN OS v1은 고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그를 한 화면에서 연결해 보여주는 내부 운영센터다.

v1의 핵심 성공 기준은 내부 직원이 고객사 상태를 빠르게 파악하고, 다음에 확인할 항목을 놓치지 않는 것이다.

## Must Have

- 공통 비밀번호 `salman1!` + 본인 이름 기반 접속
- 고객사 목록과 고객사 상세 화면
- 고객사별 Google Drive 원본 파일 링크 관리
- 고객사별 업무 관리
- Supabase 기반 내부 일정 관리
- 비즈머니 링크와 확인 상태 관리
- 고객사별 주요 링크 관리
- 운영 로그 기록
- 템플릿 기반 Smart Operation Views
- 파일 삭제 대신 `99_Archive` 보관 처리

## Must Not Have in v1

- OpenAI API
- AI 직원 실행
- 비즈머니 자동 수집
- Playwright 자동화
- Google Calendar 연동
- 고객사별 실제 Google Calendar 생성
- 외부 고객 포털
- 직원별 이메일 인증
- 고객 초대 기능

## Data Boundaries

- Supabase는 운영 데이터 기준이다.
- Google Drive는 원본 파일 기준이다.
- Google Calendar는 v1 시스템 경계 밖이다.

## Calendar Lock

v1 캘린더는 Google Calendar 연동이 아니다. Supabase에 저장한 고객사별 내부 일정 데이터를 SALMAN OS 화면에서 관리한다.

혼동을 막기 위해 v1 문서와 화면에서는 다음 표현을 피한다.

- Google Calendar 동기화
- 고객사 캘린더 생성
- 캘린더 초대 발송

권장 표현:

- 내부 일정
- 고객사 일정
- Supabase 기반 일정 관리

## AI Lock

Smart Operation Views는 AI가 아니다. v1에서는 템플릿 기반 필터와 정렬로 제공한다.

AI 직원 기능은 v1.5 이후 활성화 예정이다.

## Change Control

이 문서와 충돌하는 기능 추가는 v1 범위 밖으로 본다. 새 기능이 필요하면 v1.5 또는 이후 버전 후보로 분리한다.
