# SALMAN OS Database Schema

## Purpose

이 문서는 SALMAN OS v1의 Supabase 운영 데이터 초안을 정의한다. Supabase는 운영 데이터 기준이며, Google Drive는 원본 파일 기준이다.

## Principles

- 모든 운영 데이터는 고객사 기준으로 연결한다.
- 원본 파일은 Google Drive에 두고, Supabase에는 메타데이터와 링크를 저장한다.
- v1 일정은 Google Calendar가 아니라 Supabase 내부 일정 데이터다.
- 삭제는 기본적으로 상태 변경과 로그 기록으로 처리한다.

## Core Tables

### staff_members

내부 직원 식별용 테이블이다.

- `id`: UUID
- `name`: 직원 이름
- `is_active`: 사용 여부
- `created_at`: 생성일

v1 로그인은 공통 비밀번호 `salman1!`과 본인 이름 입력으로 처리한다. 직원별 계정, 이메일 인증, 권한 체계는 v1 범위가 아니다.

### clients

고객사 기준 테이블이다.

- `id`: UUID
- `name`: 고객사명
- `status`: active, paused, archived
- `owner_name`: 내부 담당자 이름
- `drive_root_url`: 고객사 Google Drive 루트 링크
- `memo`: 내부 메모
- `created_at`: 생성일
- `updated_at`: 수정일

### client_tasks

고객사별 업무 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `title`: 업무명
- `status`: todo, doing, blocked, done, archived
- `priority`: low, normal, high
- `due_date`: 마감일
- `assignee_name`: 담당자 이름
- `related_file_id`: client_files 참조 가능
- `memo`: 업무 메모
- `created_at`: 생성일
- `updated_at`: 수정일

### client_events

Supabase 기반 내부 고객사별 일정 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `title`: 일정명
- `event_date`: 일정일
- `start_time`: 시작 시간
- `end_time`: 종료 시간
- `status`: scheduled, done, canceled, archived
- `owner_name`: 담당자 이름
- `memo`: 일정 메모
- `created_at`: 생성일
- `updated_at`: 수정일

고객사별 실제 Google Calendar는 생성하지 않는다.

### client_files

Google Drive 원본 파일 메타데이터 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `file_name`: 파일명
- `drive_url`: Google Drive 원본 링크
- `drive_folder_path`: Drive 내 폴더 경로
- `file_type`: doc, sheet, slide, pdf, image, other
- `status`: active, archived
- `uploaded_by_name`: 등록자 이름
- `created_at`: 생성일
- `updated_at`: 수정일

파일 삭제는 영구 삭제가 아니라 `99_Archive` 보관 처리다.

### client_money_links

비즈머니 관련 링크와 확인 상태 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `title`: 항목명
- `url`: 확인 링크
- `status`: unknown, check_needed, checked, issue, archived
- `last_checked_at`: 마지막 확인일
- `checked_by_name`: 확인자 이름
- `memo`: 메모
- `created_at`: 생성일
- `updated_at`: 수정일

v1에서는 비즈머니 자동 수집을 하지 않는다. 직원이 확인한 상태와 링크만 관리한다.

### client_links

고객사별 주요 링크 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `title`: 링크명
- `url`: URL
- `category`: drive, admin, report, external, other
- `status`: active, archived
- `created_at`: 생성일
- `updated_at`: 수정일

### operation_logs

운영 로그 테이블이다.

- `id`: UUID
- `client_id`: clients 참조
- `actor_name`: 작업자 이름
- `action_type`: created, updated, archived, checked, note
- `target_type`: client, task, event, file, money, link
- `target_id`: 대상 ID
- `message`: 로그 메시지
- `created_at`: 생성일

## MVP Notes

- 외부 고객 포털용 테이블은 v1에서 만들지 않는다.
- OpenAI API 실행 기록 테이블은 v1에서 만들지 않는다.
- Google Calendar 연동 토큰 테이블은 v1에서 만들지 않는다.
- Playwright 자동화 작업 큐는 v1에서 만들지 않는다.
