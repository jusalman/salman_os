# SALMAN OS Agent Guide

## Purpose

이 문서는 `salman_os`에서 작업하는 사람 또는 자동화 에이전트가 지켜야 할 공통 작업 기준을 정의한다. SALMAN OS v1은 내부 직원용 고객사 운영센터 MVP이며, 코드보다 문서와 범위 정합성이 우선이다.

## Product Baseline

- 프로젝트명은 항상 SALMAN OS로 표기한다.
- 폴더와 레포 표기는 항상 `salman_os`로 표기한다.
- SALMAN OS는 Google Sheets, Google Drive, Google Calendar를 대체하는 시스템이 아니다.
- SALMAN OS는 고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그를 한 화면에서 연결해 보여주는 내부 운영센터다.
- v1 사용자는 외부 고객이 아니라 내부 직원이다.
- v1 접속 방식은 공통 비밀번호 `salman1!`과 본인 이름 입력이다.

## v1 Scope Rules

반드시 포함한다.

- 고객사별 운영 정보 대시보드
- Supabase 기반 운영 데이터 저장
- Google Drive 원본 파일 링크 관리
- Supabase 기반 내부 고객사별 일정 관리
- 템플릿 기반 Smart Operation Views
- 삭제 대신 `99_Archive` 보관 처리

반드시 제외한다.

- OpenAI API 연동
- AI 직원 실행
- 비즈머니 자동 수집
- Playwright 자동화
- Google Calendar 연동
- 고객사별 실제 Google Calendar 생성
- 외부 고객 포털

## Work Rules

- `package.json`, `src`, `public` 코드는 별도 요청 없이는 수정하지 않는다.
- 문서 수정 시 v1 범위와 v1.5 이후 범위를 섞지 않는다.
- AI 직원 기능은 v1.5 이후 활성화 예정으로만 표현한다.
- Google Drive는 원본 파일 저장소이며, Supabase는 운영 데이터 기준이라는 관계를 유지한다.
- 캘린더라는 표현을 쓰더라도 v1에서는 Supabase 기반 내부 일정 관리임을 명시한다.
