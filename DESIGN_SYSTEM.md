# SALMAN OS Design System

## Design Goal

SALMAN OS는 내부 직원이 반복적으로 사용하는 고객사 운영센터다. 디자인은 화려한 랜딩 페이지가 아니라 빠르게 스캔하고, 비교하고, 다음 행동을 정할 수 있는 업무형 인터페이스를 목표로 한다.

## Tone

- 조용하고 명확한 운영 도구
- 고객사별 상태를 빠르게 읽을 수 있는 밀도
- 장식보다 정보 우선
- 내부 직원용 MVP에 맞는 실용적 표현

## Information Hierarchy

첫 화면은 고객사 운영 상태를 바로 보여준다.

우선순위는 다음과 같다.

1. 고객사명과 담당자
2. 오늘 확인할 업무와 일정
3. 비즈머니 확인 필요 상태
4. Google Drive 원본 자료 링크
5. 최근 운영 로그
6. 템플릿 기반 Smart Operation Views

## Layout Principles

- 고객사 선택 영역은 항상 명확하게 보인다.
- 고객사 상세 화면은 자료, 업무, 일정, 비즈머니, 링크, 로그가 같은 맥락 안에서 연결되어야 한다.
- 고객사별 실제 Google Calendar 화면처럼 보이게 만들지 않는다.
- Google Drive 파일은 원본 링크와 상태를 보여주되 파일 저장소처럼 과장하지 않는다.
- Smart Operation Views는 AI 채팅 화면이 아니라 운영 필터 또는 요약 패널처럼 표현한다.

## Component Guidelines

### Client Header

- 고객사명
- 상태
- 담당자
- Google Drive 루트 링크
- 최근 업데이트 시간

### Operation Panels

다음 패널을 기본 구성으로 둔다.

- 자료
- 업무
- 일정
- 비즈머니
- 주요 링크
- 운영 로그

### Status Labels

상태는 짧고 명확하게 표시한다.

- 정상
- 확인 필요
- 지연
- 진행 중
- 완료
- 보관됨

### Archive Treatment

삭제 버튼은 영구 삭제를 암시하지 않도록 한다. v1에서는 `99_Archive` 보관 처리를 기준으로 한다.

권장 표현:

- 보관
- Archive로 이동
- `99_Archive` 보관 처리

피해야 할 표현:

- 영구 삭제
- 완전 삭제
- 즉시 제거

## Copy Rules

- 프로젝트명은 SALMAN OS로 표기한다.
- 폴더/레포 표기는 `salman_os`로 표기한다.
- AI 기능처럼 보이는 문구를 피한다.
- "AI가 추천" 대신 "템플릿 기준 보기"를 사용한다.
- "Google Calendar 연동" 대신 "내부 일정 관리"를 사용한다.

## v1 Exclusions in UI

다음 메뉴나 CTA는 v1 화면에 넣지 않는다.

- AI 직원 실행
- OpenAI 연결
- Google Calendar 연결
- Playwright 자동화 실행
- 비즈머니 자동 수집
- 고객 포털 초대
