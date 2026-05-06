# SALMAN OS Architecture

## Overview

SALMAN OS는 고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그를 한 화면에서 연결해 보여주는 내부 직원용 고객사 운영센터 MVP다. Google Workspace를 대체하지 않고, 흩어진 운영 맥락을 연결하는 얇은 운영 레이어로 동작한다.

## System Roles

- React/Vite App: 내부 직원이 사용하는 화면을 제공한다.
- Supabase: 고객사, 업무, 일정, 링크, 로그, 비즈머니 상태 등 운영 데이터의 기준 저장소다.
- Google Drive: 고객사 원본 파일의 기준 저장소다.
- Google Calendar: v1에서는 연동하지 않는다.

## Data Ownership

Supabase가 관리한다.

- 고객사 기본 정보
- 고객사별 업무
- 고객사별 내부 일정
- 비즈머니 확인 상태
- 주요 링크
- 운영 로그
- Google Drive 파일 메타데이터와 링크

Google Drive가 관리한다.

- 원본 문서
- 원본 이미지
- 원본 계약서
- 고객사별 업무 파일
- 보관 파일

## Calendar Architecture

v1 캘린더는 Google Calendar 연동이 아니다. SALMAN OS 내부에서 Supabase에 저장한 고객사별 일정 데이터를 화면에 보여주는 방식이다.

- 고객사별 실제 Google Calendar는 생성하지 않는다.
- Google Calendar API를 호출하지 않는다.
- 일정 생성, 수정, 삭제 상태는 Supabase에 저장한다.
- 일정 삭제가 필요한 경우 운영 정책에 맞춰 상태 변경 또는 로그 기록을 남긴다.

## File Architecture

Google Drive는 원본 파일 기준이다. SALMAN OS는 파일 자체를 복제하거나 대체 저장소가 되지 않는다.

- SALMAN OS에는 파일명, 고객사, Drive 링크, 폴더 위치, 상태, 등록자, 등록일을 저장한다.
- 파일 삭제는 영구 삭제가 아니라 Google Drive의 `99_Archive` 보관 처리로 정의한다.
- Supabase에는 보관 처리 상태와 로그를 남긴다.

## Smart Operation Views

Smart Operation Views는 AI 없이 템플릿 기반으로 제공한다.

- 마감 임박 일정
- 미완료 업무
- 비즈머니 확인 필요
- 최근 업로드 자료
- 최근 운영 로그

이 뷰는 Supabase 데이터를 필터링하고 정렬해 보여주는 기능이며, OpenAI API를 사용하지 않는다.

## Excluded Integrations in v1

- OpenAI API
- AI 직원 실행
- 비즈머니 자동 수집
- Playwright 자동화
- Google Calendar 연동
- 외부 고객 포털
