# SALMAN OS Workflow

## Purpose

이 문서는 SALMAN OS v1을 내부 직원이 어떻게 사용하는지 설명한다. SALMAN OS는 고객사별 자료, 업무, 일정, 비즈머니, 링크, 로그를 한 화면에서 연결해 보여주는 내부 운영센터다.

## Daily Workflow

### 1. Login

내부 직원은 SALMAN OS에 접속한 뒤 공통 비밀번호 `salman1!`과 본인 이름을 입력한다.

v1에서는 직원별 계정이나 외부 고객 로그인을 사용하지 않는다.

### 2. Select Client

고객사 목록에서 확인할 고객사를 선택한다.

확인 기준:

- 오늘 일정이 있는 고객사
- 마감 업무가 있는 고객사
- 비즈머니 확인 필요 고객사
- 최근 자료가 추가된 고객사
- 운영 로그가 변경된 고객사

### 3. Review Operation Center

고객사 상세 화면에서 다음을 함께 확인한다.

- 자료
- 업무
- 일정
- 비즈머니
- 주요 링크
- 운영 로그

이 화면은 Google Sheets, Google Drive, Google Calendar를 대체하는 화면이 아니라 고객사 운영 맥락을 연결해 보여주는 화면이다.

### 4. Open Source Files

자료는 Google Drive 원본 링크로 이동해 확인한다. SALMAN OS에는 파일 원본을 저장하지 않는다.

### 5. Update Tasks and Events

업무와 일정은 고객사 기준으로 업데이트한다. v1 일정은 Google Calendar 연동이 아니라 Supabase 기반 내부 일정이다.

### 6. Check Business Money

비즈머니 영역에서 확인 필요 상태를 확인하고, 직원이 직접 확인한 뒤 상태와 메모를 갱신한다.

v1에서는 비즈머니 자동 수집을 하지 않는다.

### 7. Archive Files

더 이상 운영 화면에서 볼 필요가 없는 파일은 삭제하지 않고 Google Drive의 `99_Archive`로 보관 처리한다.

SALMAN OS에는 보관 상태와 로그를 남긴다.

## Weekly Workflow

매주 다음 항목을 확인한다.

- 고객사별 미완료 업무
- 이번 주 일정
- 비즈머니 미확인 항목
- 최근 보관 처리된 자료
- 고객사별 운영 로그 누락 여부

## Smart Operation Views

Smart Operation Views는 AI 없이 템플릿 기반으로 제공한다. 직원은 이 뷰를 통해 확인할 항목을 빠르게 찾는다.

## Not Used in v1

- OpenAI API
- AI 직원 실행
- Playwright 자동화
- Google Calendar 연동
- 외부 고객 포털
