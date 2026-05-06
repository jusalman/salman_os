# SALMAN OS Google Drive Policy

## Purpose

이 문서는 SALMAN OS v1에서 Google Drive를 어떻게 다루는지 정의한다. Google Drive는 원본 파일 기준이며, SALMAN OS는 고객사별 원본 자료와 운영 데이터를 연결해 보여주는 내부 운영센터다.

## Drive Role

Google Drive가 담당한다.

- 원본 문서 보관
- 계약서, 보고서, 이미지, 업무 파일 보관
- 고객사별 파일 폴더 운영
- 보관 파일 유지

SALMAN OS가 담당한다.

- 고객사와 파일 링크 연결
- 파일 상태 표시
- 파일 관련 업무, 일정, 로그 연결
- 파일 보관 처리 기록

## Not a Replacement

SALMAN OS는 Google Drive를 대체하지 않는다. 파일 원본은 Google Drive에 남고, SALMAN OS는 파일을 찾고 연결하기 쉽게 만드는 운영 화면을 제공한다.

## Recommended Folder Structure

고객사별 Drive 루트는 다음 구조를 권장한다.

```text
고객사명/
  01_Admin/
  02_Work/
  03_Report/
  04_Assets/
  99_Archive/
```

`99_Archive`는 삭제 대신 보관하는 폴더다.

## Archive Policy

v1에서 파일 삭제는 영구 삭제가 아니다. 사용하지 않는 파일은 Google Drive의 `99_Archive`로 이동하고, SALMAN OS에는 보관 상태와 로그를 남긴다.

보관 처리 기준:

- 잘못 업로드된 파일
- 더 이상 사용하지 않는 이전 버전
- 완료된 업무의 참고 파일
- 운영 화면에서 숨기고 싶은 파일

보관 처리 후:

- Google Drive 원본 파일은 유지한다.
- Supabase의 파일 상태는 `archived`로 변경한다.
- operation_logs에 누가, 언제, 왜 보관했는지 남긴다.

## Prohibited in v1

- SALMAN OS에서 파일 영구 삭제
- Drive 파일 자동 삭제
- Playwright 기반 Drive 자동 정리
- AI 기반 파일 자동 분류
- 고객사별 Google Calendar 생성

## File Metadata

Supabase에는 다음 정보만 저장한다.

- 고객사 ID
- 파일명
- Google Drive 원본 링크
- Drive 폴더 경로
- 파일 유형
- 상태
- 등록자
- 등록일
- 수정일

원본 파일 자체는 Supabase에 저장하지 않는다.
